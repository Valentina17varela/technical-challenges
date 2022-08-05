from fastapi import FastAPI
from routers.user import user

app = FastAPI(title="👨‍✈️🛩 Travel's Planner 🛩👨‍✈️",
              description="Personal trip planner integrating weather data from OpenWeater's Public API")

app.include_router(user)


@app.get("/")
def read_root():
    return {"Heru :)"}


