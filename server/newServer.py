import socket
import time 
import mysql.connector
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('0.0.0.0', 8080 ))
s.listen(0)  

mydb = mysql.connector.connect(
  	host="localhost",
  	user="root",
    passwd="",
    database="temperaturalolin"
)

mycursor = mydb.cursor()
 
while True:
    client, addr = s.accept()
    client.settimeout(5)
    while True:
        content = client.recv(1024)
        if len(content) ==0:
           break
        if str(content,'utf-8') == '\r\n':
            continue
        else:

            mycursor.execute(f'INSERT INTO rilevazioni')

            print(str(content,'utf-8'))
            client.send(b'OK')
    client.close() 