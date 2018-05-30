import json
import requests
import sys
import os

try:
	r = requests.post(url='https://google-books.glitch.me/', data={'link' : sys.argv[1]})
	json_data = r.json()
	# takes links from the JSON
	lista = json_data['list'][0]['pages']
	title = json_data['list'][0]['title'][0]
	# check if the book folder exists
	try:
		os.stat(title)
	except:
		os.mkdir(title)

	# downloads file
	print("Download in progress...")
	for i in range(len(lista)):
		nome_pagina = lista[i].split("&pg=")[1].split("&img=")[0]
		print("Download of " + nome_pagina)
		r = requests.get(url=lista[i])
		file = open( title + "/" + nome_pagina + ".png", "wb")
		file.write(r.content)
		file.close()
	print("Done")

except:
	print("Error URL check README.md")
