# Rilevazioni Temperatura Multisistema

Progetto scolastico realizzato per i corsi di **Sistemi e Reti** e **TPSIT** (Tecnologie e Progettazione di Sistemi Informatici e di Telecomunicazioni).

Il sistema raccoglie in tempo reale le rilevazioni di temperatura da uno o più sensori hardware, le persiste su database e le visualizza tramite un'interfaccia web.

---

## Architettura

```
[Lolin NodeMCU (ESP8266)]
        |  TCP Socket (porta 8080)
        ▼
[Python Socket Server]  ──► [MySQL Database]
                                    |
                              [Node.js Web Server]  (porta 5000)
                                    |  REST API  /api/data
                                    ▼
                           [React.js Frontend]  (porta 3000)
```

| Componente       | Tecnologia          | Cartella      |
|------------------|---------------------|---------------|
| Sensore / Client | C++ (Arduino / ESP8266) | `lolin/`  |
| Socket Server    | Python              | `server/`     |
| Web Server       | Node.js + Express   | `web/`        |
| Web Client       | React.js            | `react-sus/`  |
| Database         | MySQL / MariaDB     | `temperaturalolin.sql` |

---

## Come funziona

1. Il **Lolin NodeMCU (ESP8266)** legge la temperatura analogica dal sensore collegato al pin A0, calcola il valore in °C e lo invia ogni 5 secondi tramite **socket TCP** al server Python, nel formato `<id_stanza> <temperatura>`.
2. Il **server Python** riceve i dati, li scrive (INSERT o UPDATE) nella tabella `rilevazioni` del database MySQL `temperaturalolin`.
3. Il **web server Node.js** espone due endpoint REST:
   - `GET /api/data` – restituisce tutte le rilevazioni presenti nel database.
   - `GET /api/data/setname/:stanza/:nome` – aggiorna il nome assegnato a una stanza.
4. Il **frontend React.js** interroga continuamente l'API e mostra le temperature correnti in card, una per stanza. Permette inoltre di assegnare un nome a ogni stanza.

---

## Prerequisiti

- [Node.js](https://nodejs.org/) ≥ 14
- [Python](https://www.python.org/) ≥ 3.8
- [MySQL](https://www.mysql.com/) / [MariaDB](https://mariadb.org/)
- Arduino IDE con supporto ESP8266 (per il firmware del NodeMCU)

---

## Installazione e avvio

### 1. Database

Importa lo schema SQL nel tuo server MySQL/MariaDB:

```bash
mysql -u root -p < temperaturalolin.sql
```

### 2. Socket Server (Python)

```bash
cd server
pip install mysql-connector-python
python multiServer.py
```

Il server si mette in ascolto sulla porta **8080**.

### 3. Web Server (Node.js)

```bash
cd web
npm install
npm test        # avvia il server tramite nodemon (script "test" nel package.json)
```

Il server si mette in ascolto sulla porta **5000**.

### 4. Web Client (React.js)

```bash
cd react-sus
npm install
npm start
```

L'applicazione è disponibile su [http://localhost:3000](http://localhost:3000).

### 5. Firmware (Lolin NodeMCU)

Apri `lolin/lolin.ino` con l'Arduino IDE, modifica le seguenti costanti nella parte alta del file e poi carica il firmware sulla scheda:

```cpp
#define ssid     "nome_rete_wifi"
#define password "password_wifi"
#define stanza   1               // ID univoco della stanza/scheda

const uint16_t port = 8080;
const char *host    = "192.168.1.100"; // IP del server Python nella rete locale
```

---

## Struttura del progetto

```
rilevazioni-temperatura-multisistema/
├── lolin/
│   └── lolin.ino           # Firmware ESP8266 (C++ / Arduino)
├── server/
│   ├── multiServer.py      # Server TCP principale (multi-stanza, con DB)
│   ├── serverMonoSocket.py # Variante monosocket
│   ├── newServer.py        # Variante alternativa
│   ├── server.py           # Server echo di test
│   └── client.py           # Client di test
├── web/
│   ├── server.js           # Entry point Node.js / Express
│   └── routes/api/data.js  # Route REST API
├── react-sus/
│   └── src/
│       └── App.js          # Componente principale React
└── temperaturalolin.sql    # Schema del database MySQL
```

---

## Tecnologie utilizzate

- **C++ / Arduino** – firmware per microcontrollore ESP8266 (Lolin NodeMCU)
- **Python 3** – server TCP con `socketserver` e connettore MySQL
- **Node.js / Express** – web server REST
- **React.js / Bootstrap** – interfaccia utente
- **MySQL / MariaDB** – persistenza dei dati
