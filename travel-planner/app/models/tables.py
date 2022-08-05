from sqlalchemy import Table, Column, ForeignKey, TIMESTAMP
from sqlalchemy.sql.sqltypes import Integer
from sqlalchemy.sql.sqltypes import String
from sqlalchemy.sql.sqltypes import Text
from config.db import meta
from config.db import SQLengine

users = Table("users", meta, 
              Column("username",String(255),primary_key=True),
              Column("email",String(255)),
              Column("password",String(255)))

trips = Table("trips", meta,
              Column("id_trip",Integer,primary_key=True),
              Column("departure_date",TIMESTAMP),
              Column("arrival_date",TIMESTAMP),
              Column("origin_name",String(255)),
              Column("destination_name",String(255)),
              Column("username", String(255), ForeignKey("users.username")),
              Column("forecasted_weather_departure",Text),
              Column("forecasted_weather_arrival",Text)
              )

# Quitar comentario de la linea 23 para reiniciar la base de datos
#meta.drop_all(SQLengine)
meta.create_all(SQLengine)