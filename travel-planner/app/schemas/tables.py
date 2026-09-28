from datetime import datetime
from typing import Text
from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str
    password: str
    
    class Config:
        orm_mode = True
    
    
class Trip(BaseModel):
    id_trip: int
    departure_date: datetime
    arrival_date: datetime
    origin_name: str
    destination_name: str
    forecasted_weather_departure: str
    forecasted_weather_arrival: str
    username: str
    
    class Config:
            orm_mode = True