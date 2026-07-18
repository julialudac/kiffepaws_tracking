# temporary script files used by me to fill data in the ongoing project
# using Yaml format, because more human readable
# I put the argument in the file itself and call the function!

import sys
from pathlib import Path

import yaml
import requests

""" This script will add a new customer to the database.
The information should be in the yaml format like the example below:
firstname: Damien
email: 6yE9o@example.com
dog:
  name: Vaya
  age: 1
  breed: English cocker spaniel
  sex: F
customerForfaits:
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
    isPassed: false
  - type: 1 balade éducative offerte
    numberOfSessions: 1
    passedSessions: []
    isPassed: false
documents:
  - title: Bilan comportemental
    filename: doc117117117-bilan-comportemental.pdf
  - title: Règles de vie
    filename: doc217217217-regles-de-vie.pdf
'''
Note: The documents must be stored in the public/uploads directory to be accessible
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


# Code dégueulasse mais au moins chaque action est séparée, et cela ne vaut pas le coup de refacto 
# pour le moment
# json-server serves and stores every 'id' as a string (even when the source file
# has a JSON number), so existing ids read back from the API are parsed with int()
# before doing arithmetic on them. The ids we generate here are sent as plain ints in
# the POST body; json-server accepts and persists them fine, coercing to its own
# string representation same as it would for any other value.
def __append_ids__(existing_customers : list, new_customer : dict) -> None:
  if existing_customers:
    new_customer_id = int(existing_customers[-1]['id']) + 1
    new_dog_id = int(existing_customers[-1]['dog']['id']) + 1
  else:
    new_customer_id = 1
    new_dog_id = 1

  new_customer['id'] = new_customer_id
  print("new_customer_id", new_customer_id)

  new_customer['dog']['id'] = new_dog_id
  print("new_dog_id", new_dog_id)

  # All forfaits (ongoing and passed) now live in one 'customerForfaits' list per
  # customer, and forfait/session ids must be unique across every customer's list,
  # not just within one customer's, since actions look them up globally by id.
  # Ids aren't guaranteed to increase monotonically within a customer's list (some
  # were renumbered during the ongoingForfaits/passedForfaits merge), so we scan
  # every customer rather than trusting the last one added.
  existing_forfait_ids = [int(f['id']) for c in existing_customers for f in c.get('customerForfaits', [])]
  new_forfait_id = max(existing_forfait_ids, default=0) + 1
  for forfait in new_customer.get('customerForfaits', []):
    forfait['id'] = new_forfait_id
    new_forfait_id += 1
  print("new_forfait_id", new_forfait_id)

  existing_session_ids = [
    int(s['id'])
    for c in existing_customers
    for f in c.get('customerForfaits', [])
    for s in f.get('passedSessions', [])
  ]
  new_session_id = max(existing_session_ids, default=0) + 1
  for forfait in new_customer.get('customerForfaits', []):
    for session in forfait.get('passedSessions', []):
      session['id'] = new_session_id
      new_session_id += 1
  print("new_session_id", new_session_id)

  for d in new_customer.get('documents', []):
    document_id = int(d['filename'].split('-')[0][len("doc"):])
    d['id'] = document_id

  # print("object after append id:", new_customer)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CUSTOMER_IMPORTS_DIR = PROJECT_ROOT / "data" / "customer-imports"


def load_customer_yaml_file(filename: str) -> str:
    yaml_path = CUSTOMER_IMPORTS_DIR / filename
    if not yaml_path.is_file():
        raise FileNotFoundError(f"Customer YAML file not found: {yaml_path}")
    return yaml_path.read_text(encoding="utf-8")


def add_customer_from_file(filename: str) -> None:
    customer_yaml = load_customer_yaml_file(filename)
    add_customer(customer_yaml)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        script_name = Path(sys.argv[0]).name
        print(f"Usage: python {script_name} <customer-yaml-file>")
        print(f"Example: python {script_name} valerie-lafayette.yaml")
        sys.exit(1)

    add_customer_from_file(sys.argv[1])