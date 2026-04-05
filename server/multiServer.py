from datetime import datetime
import socketserver

import mysql.connector

DEBUG_MODE = False
HOST = "0.0.0.0"
PORT = 8080

DATABASE_CONFIG = {
    "host": "localhost",
    "user": "root",
    "passwd": "",
    "database": "temperaturalolin",
}


def get_database_connection():
    return mysql.connector.connect(**DATABASE_CONFIG)


def parse_payload(raw_payload):
    payload = raw_payload.decode("utf-8").strip()
    stanza, temperatura = payload.split(" ", 1)
    return stanza, temperatura


def reading_exists(cursor, stanza):
    cursor.execute("SELECT 1 FROM rilevazioni WHERE stanza = %s", (stanza,))
    return cursor.fetchone() is not None


def update_reading(cursor, stanza, temperatura):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        "UPDATE rilevazioni SET temp = %s, time = %s WHERE stanza = %s",
        (temperatura, timestamp, stanza),
    )


def insert_reading(cursor, stanza, temperatura):
    cursor.execute(
        "INSERT INTO rilevazioni (temp, stanza) VALUES (%s, %s)",
        (temperatura, stanza),
    )


class MyTCPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        raw_payload = self.request.recv(1024).strip()
        print(f"{self.client_address[0]} wrote:")

        try:
            stanza, temperatura = parse_payload(raw_payload)
        except ValueError:
            print("Payload non valido:", raw_payload)
            self.request.sendall(b"ERROR")
            return

        if DEBUG_MODE:
            print(stanza, temperatura)

        connection = get_database_connection()
        cursor = connection.cursor()

        try:
            if reading_exists(cursor, stanza):
                update_reading(cursor, stanza, temperatura)
            else:
                insert_reading(cursor, stanza, temperatura)

            connection.commit()
        finally:
            cursor.close()
            connection.close()

        self.request.sendall(b"OK")


if __name__ == "__main__":
    with socketserver.TCPServer((HOST, PORT), MyTCPHandler) as server:
        print("Ctrl-C per interrompere")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("server shutdown")
