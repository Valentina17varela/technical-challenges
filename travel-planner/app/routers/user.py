from fastapi import APIRouter
from fastapi import Response
from fastapi import status
from config.db import connection
from models.user import users
from schemas.user import User

user = APIRouter(tags=["Users"])

# ENDPOINT / PATHS

@user.get("/users",response_model=list[User])
def get_users():
    return connection.execute(users.select()).fetchall()

# Crear un nuevo usuario
@user.post("/users", response_model=User)
def create_users(user: User):
    details = {"username":user.username, "email":user.email, "password":user.password}
    connection.execute(users.insert().values(details))
    return connection.execute(users.select().where(users.c.username == user.username)).first()

# Listar un unico usuario
@user.get("/users/{username}", response_model=User)
def search_user(username: str):
    return connection.execute(users.select().where(users.c.username == username)).first()

# Eliminar usuario
@user.delete("/users/{username}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(username: str):
    connection.execute(users.delete().where(users.c.username == username))
    return Response(status_code = status.HTTP_204_NO_CONTENT)

# Actualizar usuario
@user.put("/users/{username}", response_model=User)
def update_user(username: str, user: User):
    connection.execute(users.update().values(username = user.username, email = user.email, password = user.password).where(users.c.username == username))
    return connection.execute(users.select().where(users.c.username == username)).first()
    