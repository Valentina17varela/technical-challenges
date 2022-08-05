from fastapi import APIRouter
from fastapi import Response
from fastapi import status
from config.db import connection
from models.tables import trips
from schemas.tables import Trip
from api.forecasted_weather import get_forecast_by_city_name
import datetime

trip = APIRouter(tags=["Trips"])


# ENDPOINT / PATHS

# Listar viajes
@trip.get("/trips",response_model=list[Trip])
def get_trips():
    return connection.execute(trips.select()).fetchall()


# Crear un nuevo viaje
@trip.post("/trips", response_model=Trip)
def create_trip(trip: Trip):
    weather_departure = get_forecast_by_city_name(trip.origin_name)
    weather_arrive = get_forecast_by_city_name(trip.destination_name)
    details = {"id_trip":trip.id_trip, "departure_date": trip.departure_date, 
               "arrival_date": trip.arrival_date, "origin_name":trip.origin_name,
               "destination_name": trip.destination_name, "username":trip.username,
               "forecasted_weather_departure": weather_departure, "forecasted_weather_arrival": weather_arrive}
    
    # Validaciones
    dias = trip.departure_date
    maximo = dias + datetime.timedelta(days=8)
    # El viaje no debe ser mayor a 8 dias
    if trip.arrival_date <= maximo:
        # La fecha de salida debe ser antes de la fecha de llegada
        if trip.departure_date < trip.arrival_date:
            connection.execute(trips.insert().values(details))
            return connection.execute(trips.select().where(trips.c.id_trip == trip.id_trip)).first()
        else:
            return Response("the departure date must be before the arrival date")
    else:
        return Response("The trip cannot have a duration of more than 8 days")
    
    
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
    weather_departure = get_forecast_by_city_name(trip.origin_name)
    weather_arrive = get_forecast_by_city_name(trip.destination_name)
    connection.execute(trips.update().values(departure_date = trip.departure_date, arrival_date = trip.arrival_date,
                                             origin_name = trip.origin_name, destination_name = trip.destination_name,
                                             forecasted_weather_departure = weather_departure , 
                                             forecasted_weather_arrival = weather_arrive )
                       .where(trips.c.id_trip == id_trip))
    return connection.execute(trips.select().where(trips.c.id_trip == id_trip)).first()


