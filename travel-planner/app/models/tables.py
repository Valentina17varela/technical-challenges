from sqlalchemy import Table, Column, ForeignKey, TIME, DATETIME
from sqlalchemy.sql.sqltypes import Integer
from sqlalchemy.sql.sqltypes import String
from config.db import meta
from config.db import SQLengine
from sqlalchemy.orm import relationship

users = Table("users", meta, 
              Column("username",String(255),primary_key=True),
              Column("email",String(255)),
              Column("password",String(255)))

trips = Table("trips", meta,
              Column("id_trip",Integer,primary_key=True),
              Column("departure_date",DATETIME),
              Column("arrival_date",DATETIME),
              Column("origin_name",String(255)),
              Column("destination_name",String(255)),
              Column("username", String(255), ForeignKey("users.username"))
              )

meta.create_all(SQLengine)