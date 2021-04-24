from os import times
import socketserver
import mysql.connector
from datetime import datetime

debugMode = False

mydb = mysql.connector.connect(
  	host="localhost",
  	user="root",
    passwd="",
    database="temperaturalolin"
)

mycursor = mydb.cursor()

class MyTCPHandler(socketserver.BaseRequestHandler):

    def handle(self):
        self.data = self.request.recv(1024).strip()
        print(f"{self.client_address[0]} wrote:")
        
        data = self.data.decode('utf-8')
        data = data.split(' ')

        stanza = data[0]
        temp = data[1]

        if debugMode:
            print(stanza, temp)
        

        mycursor.execute(f"SELECT * FROM rilevazioni WHERE stanza='{stanza}'")
        res = mycursor.fetchall()

        if len(res)>=1:

            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            if debugMode:
                print(f"UPDATE rilevazioni SET temp='{temp}', time='{timestamp} WHERE stanza='{stanza}'")

            mycursor.execute(f"UPDATE rilevazioni SET temp='{temp}', time='{timestamp}' WHERE stanza='{stanza}'")
            mydb.commit()
        else:

            if debugMode:
                print(f"INSERT INTO rilevazioni (temp, stanza) VALUES ('{temp}', '{stanza}')")

            mycursor.execute(f"INSERT INTO rilevazioni (temp, stanza) VALUES ('{temp}', '{stanza}')")
            mydb.commit()

        print(res)
        
        #mycursor.execute(f"INSERT INTO rilevazioni (temp, stanza) VALUES ('{temp}', '{stanza}')")
        #mydb.commit()

        self.request.sendall(b'OK')

if __name__ == "__main__":
    HOST, PORT = "localhost", 8080

    with socketserver.TCPServer((HOST, PORT), MyTCPHandler) as server:
        print("Ctrl-C per interrompere")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("server shutdown")
            exit()