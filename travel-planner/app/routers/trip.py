from fastapi import APIRouter
from fastapi import Response
from fastapi import status
from config.db import connection
from models.tables import trips
from schemas.tables import Trip
from datetime import datetime

trip = APIRouter(tags=["Trips"])

# ENDPOINT / PATHS

# Listar viajes
@trip.get("/trips",response_model=list[Trip])
def get_trips():
    return connection.execute(trips.select()).fetchall()


# Crear un nuevo viaje
@trip.post("/trips", response_model=Trip)
def create_trip(trip: Trip):
    details = {"id_trip":trip.id_trip, "departure_date": trip.departure_date, 
               "arrival_date": trip.arrival_date, "origin_name":trip.origin_name,
               "destination_name": trip.destination_name, "username":trip.username}
    connection.execute(trips.insert().values(details))
    return connection.execute(trips.select().where(trips.c.id_trip == trip.id_trip)).first()


# Listar un unico viaje
@trip.get("/trips/{id_trip}", response_model=Trip)
def search_trip(id_trip: int):
    return connection.execute(trips.select().where(trips.c.id_trip == id_trip)).first()


# Listar viaje por usuario
@trip.get("/trips_user/{username}")
def search_trip_by_user(username: str):
    return connection.execute(trips.select().where(trips.c.username == username)).fetchall()


# Eliminar viaje
@trip.delete("/trips/{id_trip}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(id_trip: int):
    connection.execute(trips.delete().where(trips.c.id_trip == id_trip))
    return Response(status_code = status.HTTP_204_NO_CONTENT)


# Actualizar viaje
@trip.put("/trips/{id_trip}", response_model=Trip)
def update_trip(id_trip: int, trip: Trip):
    connection.execute(trips.update().values(departure_date = trip.departure_date, arrival_date = trip.arrival_date,
                                             origin_name = trip.origin_name, destination_name = trip.destination_name,)
                       .where(trips.c.id_trip == id_trip))
    return connection.execute(trips.select().where(trips.c.id_trip == id_trip)).first()