# Travel Planner
# Heru - Technical Challenge Backend Jr

![](https://img.shields.io/badge/Code-Python-informational?style=flat&logo=python&logoColor=yellow&color=4b8bbe)
![](https://img.shields.io/badge/Framework-FastAPI-informational?style=flat&logo=fastapi&logoColor=white&color=28BB0E)
![](https://img.shields.io/badge/Code-PostgreSQL-informational?style=flat&logo=postgresql&logoColor=white&color=f29111)
![](https://img.shields.io/badge/Lib-unittesting-informational?style=flat&logo=python&logoColor=yellow&color=4b8bbe)


Planificador de viajes personal que integra datos meteorológicos de una API externa.
<br>
Para mas informacion sobre los detalles ver [Challenge Heru](https://github.com/Valentina17varela/Heru/blob/main/HERU%20Technical%20Challenge%20Jr.pdf)

## Deploy

- Clonar el siguiente repositorio
```
git clone https://github.com/Valentina17varela/Heru.git
```

- Crear el entorno virtual y activarlo
  - Windows:
  ```
  py -m venv env
  .\env\Scripts\activate
  ```
  - Unix/macOS:
  ```
  python3 -m venv env
  source env/bin/activate
  ```

- Instalar las dependencias necesarias
```
pip install -r requirements.txt
```

- Configurar los parametros para conectarse a la base de datos, en el archivo ```\app\config\.env``` reemplazar el valor de las variables globales con la informacion correspondiente
``` 
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_PASSWORD=
POSTGRES_USER=
POSTGRES_DB=
```

> Para cambiar la llave de la API cambiar el valor de la variable ```WEATHER_KEY``` ubicado en el archivo ```\app\api\forecasted_weather.py```

- Cargar el servidor de la API, dirigirse al directorio \app y ejecutar el comando ```uvicorn main:app --reload```

<br>

## Ejecucion 
Para iniciar el servidor ir a la direccion  
```
http://127.0.0.1:8000/docs
```

<br>

## Implementacion 

- app
    - api
        - forecasted_weather.py: Se hace el llamado a la APIWeather y se comprueba el correcto funcionamiento de las salidas 
        con unittesting
    - config
        - .env: Variables de entorno para la conexion a la base de datos
        - db.py: Configuracion y conexion a la base de datos postgresql
    - models: 
        - tables.py: Se guardan los modelos para la creacion de las tablas que se usaran en la base de datos
    - routers:  
        - trip.py:Rutas a usar para el CRUD de trips, contiene los endpoints con las funcionalidades necesarias, 
        se realizan las validaciones correspondientes (viaje no mayor a 8 dias, la fecha de salida-llegada es acorde)
        - user.py: Rutas a usar para el CRUD de usuarios, contiene los endpoints con las funcionalidades necesarias
    - schemas
        - tables.py: Define que tipo de datos se retornan en la creacion de las tablas
    main.py: Archivo principal donde se hace el llamado a FastAPI y al servidor postgresql


### Modelamiento de datos
Para esta Implementacion se realizo un modelado de base de datos relacional, esto debido a que las entidades correspondientes (usuarios, trips) presentan atributos que pueden compartir, en este caso se uso una tabla para manejar el registro de usuarios, y otra para el registro de viajes que tiene cada usuario, es decir, se presenta una relacion de uno a muchos, dando como resultado el siguiente modelo: 

<div align="center">
  <img src="https://github.com/Valentina17varela/Heru/blob/main/imagenes/relaciones.png" width="550"/>
</div>


### Base de datos
Despues de realizar el modelamiento se puede observar que al tener una base de datos relacional se puede usar el gestor de 
PostgreSQL ya que permite manejar este tipo de relaciones y que en conjunto con Python y ORM es facil de usar y entender para 
crear las relaciones adecuadas entre las tablas.

> Un plus para usar este gestor tiene soporte al tipo de dato TIMESTAMP el cual se necesita para crear las fechas de los viajes


### Funcionalides / Endpoints
- Users
    - Crear usuario
    - Eliminar usuario
    - Actualizar usuario
    - Buscar usuario
    - Listar usuarios

- Trips
    - Crear viaje
    - Eliminar viaje
    - Actualizar viaje
    - Buscar informacion de un viaje
    - Listar viajes por usuario 
    - Listar viajes

### Validaciones
Se consideraron las siguientes validaciones para la coherencia del programa
- El viaje no debe durar mas de 8 dias
- La fecha de salida debe ser antes cronologicamente que la fecha de llegada 



