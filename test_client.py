import socket

# Conectar al servidor
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(('127.0.0.1', 8080))

# Enviar comando FLUSH (byte 4)
sock.send(bytes([4]))

# Leer respuesta
response = sock.recv(1024)
print(f"Respuesta: {response}")

sock.close()