from lxml import html
import requests
import re
import json

months = {'Januar': '01', 'Februar': '02', 'März': '03', 'April': '04', 'Mai': '05', 'Juni': '06', 'Juli': '07',
          'August': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Dezember': '12'}

page = requests.get('https://www.serienjunkies.de/docs/serienkalender-aktuell-deutschland.html')
tree = html.fromstring(page.content)

table = tree.xpath('//table[@class="splaner"]/tr/td/*')

series = []
temp = []
current_date = None
for entry in table:
    if entry.text is None:
        continue

    date = re.findall('[0-9]{1,2}\..*[0-9]{4}', str(entry.text))
    if date.__len__() == 1:
        if len(temp) is not 0:
            series.append((current_date, temp.copy()))
            temp.clear()

        date = date[0].split(' ')
        date[0] = date[0].split('.')[0]
        date[1] = months[date[1]]
        current_date = str(date[0]) + '_' + str(date[1]) + '_' + str(date[2])
    else:
        temp.append(entry.text)

for (date, names) in series:
    temp = []
    dictionary = {}
    for name in names:
        split_name = name.split(' (')
        split_season_episode = split_name[1].split('x')
        series_name = split_name[0]
        series_season = split_season_episode[0]
        series_episode = split_season_episode[1].split(')')[0]
        dictionary['name'] = series_name
        dictionary['season'] = series_season
        dictionary['episode'] = series_episode
        temp.append(dictionary.copy())
        dictionary.clear()
    temp = {'series': temp}

    with open('data/' + date, 'w') as outfile:
        json.dump(temp, outfile)
