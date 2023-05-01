# chopstick.api

## Initialize

Clone the repository and install dependencies:

```
git clone https://github.com/TheArtemis/chopstick.api
npm install
```

## Start server

To start the server during development run:

```
npm run dev
```

## NOTE

### Opzione A

Quando un client ricerca una partita esso manda una POST request ad api/queue.
Il server riceve la richiesta e manda una risposta di conferma dell'aggiunta alla coda.
Il client a questo punto riceve la conferma e manda la richiesta di giocare.
Il server riceve la richiesta ed elabora una promessa, se non si esaudisce entro 60 secondi.

### Opzione B

Quando un client ricerca una partita esso manda una POST request ad api/queue.
Il server elabora una promessa di restituire un match entro 60 secondi.

### Opzione C (FINALE)

Il client instaura una connessione via socket con il server e viene aggiunto ad una stanza quando viene trovato un match con un altro utente.

`client: {player: {id: idHash, name: string}}`

Viene inizializzata una server sent event che notificherà il client una volta trovato il match

`sse: {roomNumber: string}`

Quando ci sono almeno due giocatori (si dovrebbe implementare un rating affinchè giocatori con con rating vicini siano i favoriti nella creazione di) questi vengono notificati tramite server sent event che sono stati aggiunti ad un match.

I client inizializzano una connessione tramite websocket
