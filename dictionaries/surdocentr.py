import requests
import json
from time import sleep

for i in range(1, 2101):
    url = f'https://slovar.surdocentr.ru/storage/media/video/{i}.webm'
    if requests.head(url).status_code == 200:
        word = json.loads(requests.get(f'https://slovar.surdocentr.ru/api/v1/jest/{i}').text)['jest']
        print(word, url)
    sleep(1)
