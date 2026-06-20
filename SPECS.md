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
