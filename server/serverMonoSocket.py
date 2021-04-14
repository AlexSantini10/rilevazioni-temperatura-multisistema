import socket

HOST = '127.0.0.1' 
PORT = 7777

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.bind((HOST, PORT))
    server.listen()
    conn, addr = server.accept()
    with conn:
        print('Connected by', addr)
        while True:
            try:
                data = conn.recv(1024)
                if not data:
                    break

                data = data.decode('ascii')
                data = data.upper()
                data = data.encode('ascii')

                conn.sendall(data)
                conn.close()
            except TypeError:
                print(TypeError)