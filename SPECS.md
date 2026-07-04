# KiffePaws Tracking - Track customers and their passed sessions with me
Specifications for myself and AI. It is non exhaustive and evolves.

## Main page display (last update 17/06/26)
For now : Display the list of all customers with details.
For each we display :
- name
- their dog's name
- ongoing forfaits (packages) 
- each ongoing forfait has its type, its number of passed sessions '/' its number of total sessions
- each session has a date, theme and content

## Entities (last update 17/06/26)
For now I see those entities :
- Owner : firstname, surname?, email?, dog
- Customer : a subclass of Owner, with property ongoing packages
- Dog : name, age?, breed?, sex?, owner
- Forfait : name (which is the name of the type), number of sessions
- CustomerForfait : type, passed sessions. It reprensents an instance of a 'Forfait'
- Session : date; theùe, content.
### Relationships
- an owner has one dog (for now)
- a dog has one owner
- a customer has one or more ongoing forfaits
- a forfait has one or more passed sessions 
### Example of final list of clients given to the frontend
```[{
    id: 1,
    firstname: 'Damien',
    email: 'X7TtD@example.com',
    dog: {
      id: 1,
      name: 'Vaya',
      age: 1,
      breed: 'English cocker spaniel'
    },
    ongoingForfaits: [
      {
        id: 1,
        type: 'F15',
        numberOfSessions: 15,
        passedSessions: [{
          id: 1,
          date: new Date('2026-02-06'),
          theme: 'Règles de vie concernant la nourriture et les contacts jeux et caresses.',
          content: `Séance règles de vie concernant la nourriture et les contacts jeux et caresses.\n\nNous avons également fait le conditionnement canette, Vaya n'étant pas sensible à autre chose que la canette qui fonctionne sur elle.`
        }
        ]
      }
    ]
  }
]```

## Tasks now (last update 17/06/26)
[X] Create files and eventually a folder at a good place in the repo that define entities (not models for now)
[X] Create mock data in the app code and display it with views (does not have to be pretty at first)
[X] Put the mock data in a file (json-db like?) instead of the code
[X] Create a script to perform an add operation within the file : add a customer with their dog and ongoing forfaits info given a standardized file to define. Cautious of the ids!
[X] Add Customers's field passedForfaits
[X] If time, figure out how to link pdfs to entities!! Otherwise I will have to migrate all to computer's folder for now. -> Cf /docs/document-storage.md
[X] Migrate all customer Daska infos on forfaits and passed sessions
([ ] Implement documents field for customer forfaits too) -> To simplyfy for now I put all the docs attached to the customer.
([ ] Create a script to perform a remove customer operation)
### Prettify the customer view
[X] Justify text and present each view as a block/card
[X] Customer and dog's names on big title
[X] Blockify other components: Forfaits en cours as a block, each forfait also, and each passed session
[X] Allow collapsing forfaits
[X] Add a collapse all button and a expand all button
### CRUD (try Claude to do that??)
[X] R customer : Add a button to consult/view details on one customer -> will redirect to a route like "/customers/{id}" where only the selected customer is displayed. The "page" will also contain a "Retour" button to go back home.
[ ] C document: For a customer, add a button to add a document, either an existing one or a new one
[ ] D document: For a customer, add a button to delete a document. If there is no reference left on the document, this one is removed from the cloud storage
[ ] C customer forfait
[ ] C session
[ ] etc
