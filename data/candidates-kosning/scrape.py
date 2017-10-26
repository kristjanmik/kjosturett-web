import requests
from bs4 import BeautifulSoup
import json

kjordaemi = [
  'nordvesturkjordaemi',
  'nordausturkjordaemi',
  'sudurkjordaemi',
  'sudvesturkjordaemi',
  'reykjavik-sudur',
  'reykjavik-nordur'
]

d = {}

for k in kjordaemi:
  page = requests.get('http://www.kosning.is/althingiskosningar-2017/althingiskosningar/kjordaemi/%s/' % k)
  soup = BeautifulSoup(page.text, 'lxml')
  d[k] = {}
  trs = soup.find_all('tr')
  currentParty = ''
  cl = []
  for i, tr in enumerate(trs):
    if tr.find_all('h3'):
      if currentParty:
        d[k][currentParty] = cl
      partyText = tr.find_all('h3')[0].text.replace('\r\n','')
      currentParty = partyText[:1]
      cl = []
    else:
      if(tr.find_all('b')):
        info_split = trs[i+1].text.strip().replace('\r\n', '').split(',')
        if len(info_split) == 5:
          street = ' ,'.join(info_split[2:4])
        elif len(info_split) == 3:
          street = ''
        else:
          street = info_split[2]

        cl.append({
          'seat': tr.find_all('b')[0].text.replace('.',''),
          'name': tr.find_all('b')[1].text.replace(',',''),
          'ssn': info_split[0].replace('kt. ',''),
          'occupation': info_split[1].strip(),
          'street':  street.strip(),
          'place': info_split[-1].replace('.','').strip(),
        })
    d[k][currentParty] = cl

f = open('candidates.json', 'w')
f.write(json.dumps(d, indent=2, sort_keys=True))
f.close()
