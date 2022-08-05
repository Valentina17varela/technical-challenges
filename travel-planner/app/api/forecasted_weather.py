import requests
import unittest

WEATHER_KEY = '65f907908eb63276682c3955f7527668'


def get_forecast_by_city_name(city_name: str):

    r = requests.get(
        f"https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={WEATHER_KEY}")
    result = r.json()
    return str(result['list'])


class Test_forecast(unittest.TestCase):
    def runTest(self):
        get_forecast_by_city_name("London"), str, "no se encontro la ciudad"
        get_forecast_by_city_name("Tampa"), str, "no se encontro la ciudad"
        
        
unittest.main()


