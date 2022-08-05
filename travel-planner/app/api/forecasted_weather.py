from unicodedata import name
from decouple import config
import requests


WEATHER_KEY = '65f907908eb63276682c3955f7527668'


def get_forecast_by_city_name(city_name: str):

    r = requests.get(
        f"https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={WEATHER_KEY}")
    result = r.json()
    return str(result['list'])


if __name__ == "__main__":
    print(get_forecast_by_city_name("London"))