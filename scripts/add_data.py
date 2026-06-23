# temporary script files used by me to fill data in the ongoing project
# using Yaml format, because more human readable
# I put the argument in the file itself and call the function!

import yaml
import requests

""" This script will add a new customer to the database
The information should be in the yaml format like the example below:
firstname: Damien
email: 6yE9o@example.com
dog:
  name: Vaya
  age: 1
  breed: English cocker spaniel
  sex: F
ongoingForfaits:
  - type: F15
    numberOfSessions: 15
    passedSessions:
      - date: 06/02/2026
        theme: Règles de vie concernant la nourriture et les contacts jeux et caresses.
        content: |
          Séance règles de vie concernant la nourriture et les contacts jeux et caresses.

          Nous avons aussi fait le conditionnement canette, Vaya n'est pas sensible à autre chose que la canette qui fonctionne sur elle.
      - date: 11/02/2026
        theme: Séance règle de vie partie territoire + solutions contre le vol d'objet.
        content: |
          Territoire :
          - interdit de se cacher sous les meubles qui est un point stratégique pour elle.
          - interdit de suivre les humains partout
          - passer la porte en second, attendre avant d'aller voir les invités

          Solutions contre le vol :
          - on fait exprès de mettre les objets partout, des qu'elle y va canette sinon récompense
          - solution de la pierre d'alun dans les mouchoirs

          Je joins la fiche générale des règles de vie
      - date: 17/02/2026
        theme: Travail du rappel et du début de patience avec le "assis".
        content: ''
  - type: 1 balade éducative offerte
    numberOfSessions: 1
    passedSessions: []
'''
"""
def add_customer(customer_yaml : str) -> None:
  # 1. Parse the input string into a dictionary
  customer_info : dict = yaml.safe_load(customer_yaml)
  print("customer_info 1", customer_info)

  # 2. Deduce ids of the customer, the dog, the ongoing forfaits and the passed sessions
  existing_customers = requests.get("http://localhost:8000/customers").json()
  __append_ids__(existing_customers, customer_info)
  print("customer_info", customer_info)

  # 3. Send the data to the backend
  requests.post("http://localhost:8000/customers", json=customer_info)
  print("succes")


def __append_ids__(existing_customers : list, new_customer : dict) -> None:
  new_customer_id = len(existing_customers) + 1
  new_customer['id'] = new_customer_id
  print("new_customer_id", new_customer_id)

  new_dog_id = len(existing_customers) + 1
  new_customer['dog']['id'] = new_dog_id
  print("new_dog_id", new_dog_id)

  new_first_ongoing_forfait_id = 1
  for c in existing_customers:
    new_first_ongoing_forfait_id += len(c['ongoingForfaits'])
  for forfait in new_customer['ongoingForfaits']:
    forfait['id'] = new_first_ongoing_forfait_id
    new_first_ongoing_forfait_id += 1
  print("new_first_ongoing_forfait_id", new_first_ongoing_forfait_id)

  new_first_passed_session_id = 1
  for c in existing_customers:
    for forfait in c['ongoingForfaits']:
      new_first_passed_session_id += len(forfait['passedSessions'])
  for forfait in new_customer['ongoingForfaits']:
    for session in forfait['passedSessions']:
      session['id'] = new_first_passed_session_id
      new_first_passed_session_id += 1
  print("new_first_passed_session_id", new_first_passed_session_id)
  print("object after append id:", new_customer)


yaml_dum = '''
firstname: Damien
email: 6yE9o@example.com
dog:
  name: Vaya
  age: 1
  breed: English cocker spaniel
  sex: F
ongoingForfaits:
  - type: F15
    numberOfSessions: 15
    passedSessions:
      - date: 06/02/2026
        theme: Règles de vie concernant la nourriture et les contacts jeux et caresses.
        content: |
          Séance règles de vie concernant la nourriture et les contacts jeux et caresses.

          Nous avons aussi fait le conditionnement canette, Vaya n'est pas sensible à autre chose que la canette qui fonctionne sur elle.
      - date: 11/02/2026
        theme: Séance règle de vie partie territoire + solutions contre le vol d'objet.
        content: |
          Territoire :
          - interdit de se cacher sous les meubles qui est un point stratégique pour elle.
          - interdit de suivre les humains partout
          - passer la porte en second, attendre avant d'aller voir les invités

          Solutions contre le vol :
          - on fait exprès de mettre les objets partout, des qu'elle y va canette sinon récompense
          - solution de la pierre d'alun dans les mouchoirs

          Je joins la fiche générale des règles de vie
      - date: 17/02/2026
        theme: Travail du rappel et du début de patience avec le "assis".
        content: ''
  - type: 1 balade éducative offerte
    numberOfSessions: 1
    passedSessions: []
'''

add_customer(yaml_dum)