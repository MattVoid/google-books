import json
import requests
import sys
import os

try:
    r = requests.get(url=sys.argv[1])
    json_data = r.json()

    # takes links from the JSON
    lista = json_data['list'][0]['pages']

    # check if the book folder exists
    try:
        os.stat("book")
    except:
        os.mkdir("book")

    # downloads file
    print("Download in progress...")
    for i in range(len(lista)):
        nome_pagina = lista[i].split("&pg=")[1].split("&img=")[0]

        print("Download of " + nome_pagina)
        r = requests.get(url=lista[i])
        file = open("book/" + nome_pagina + ".png", "wb")
        file.write(r.content)
        file.close()
    print("Done")

except:
    print("Error URL check README.md")