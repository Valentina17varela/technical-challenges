from fastapi import FastAPI
from routers.user import user
from routers.trip import trip

app = FastAPI(title="👨‍✈️🛩 Travel's Planner 🛩👨‍✈️",
              description="Personal trip planner integrating weather data from OpenWeater's Public API")

app.include_router(user)
app.include_router(trip)




