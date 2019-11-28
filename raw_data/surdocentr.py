import requests
import json
from time import sleep

for i in range(2020, 2101):
    url = f'https://slovar.surdocentr.ru/storage/media/video/{i}.webm'
    try:
        if requests.head(url).status_code == 200:
            word = json.loads(requests.get(f'https://slovar.surdocentr.ru/api/v1/jest/{i}').text)['jest']
            print(word, url)
    except:
        pass
    sleep(1)
