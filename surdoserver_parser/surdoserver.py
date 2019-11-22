import re
import json
import requests
from bs4 import BeautifulSoup


def char_range(c1, c2):
    for c in range(ord(c1), ord(c2) + 1):
        yield chr(c)


result = []
for letter in char_range('А', 'Я'):
    bs = BeautifulSoup(requests.get('http://www.surdoserver.ru/surdo/letter/' + letter, headers={
        'X-Requested-With': 'XMLHttpRequest'
    }).text, 'lxml')
    word_list = bs.find_all('a')

    for word_url in word_list:
        res = BeautifulSoup(requests.get('http://www.surdoserver.ru' + word_url['href'], headers={
            'X-Requested-With': 'XMLHttpRequest'
        }).text, 'lxml')

        breadcrumbs = res.find('h2', attrs={'id': "word-header"})

        try:
            word_name = res.find('div', attrs={'class': 'header-sub'}).contents[0]
        except AttributeError:
            word_name = breadcrumbs.contents[-1]

        # category = ' – '.join([x.contents[0] for x in breadcrumbs.find_all('a', attrs={'class': 'theme-in-breadcumb'})])
        raw_script = res.find('script', text=re.compile('video_id')).contents[0]
        video_id = re.search(r'video_id = "(.*)"', raw_script).group(1)

        word = {
            'word': word_name.rstrip(),
            'variants': [
                {
                    'video': 'https://www.youtube.com/watch?v='+video_id,
                    'source': 'http://surdoserver.ru'+word_url['href']
                }
            ]
        }

        print(word)
        result.append(word)


f = open('surdoserver.json', 'w')
f.write(json.dumps(result, ensure_ascii=False, indent=4))
f.close()
