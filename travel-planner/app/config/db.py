from multiprocessing import connection
from sqlalchemy import create_engine, MetaData
from sqlalchemy_utils import create_database
from sqlalchemy_utils import database_exists
from decouple import config


HOST = config('POSTGRES_HOST')
PORT = config('POSTGRES_PORT')
PASS = config('POSTGRES_PASSWORD')
USER = config('POSTGRES_USER')
NAME = config('POSTGRES_DB')


db = 'postgresql://'+USER+':'+PASS+'@'+HOST+':'+PORT+'/'+NAME
if not database_exists(db):
    create_database(db)
SQLengine = create_engine(db)

meta = MetaData()
connection = SQLengine.connect()