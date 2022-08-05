from sqlalchemy import Table, Column, true
from sqlalchemy.sql.sqltypes import Integer
from sqlalchemy.sql.sqltypes import String
from config.db import meta
from config.db import SQLengine

users = Table("users", meta, 
              Column("username",String(255),primary_key=True),
              Column("email",String(255)),
              Column("password",String(255)),
              Column("id_trip",Integer))

meta.create_all(SQLengine)