import os
import socketio
from aiohttp import web
import asyncio

# Crear una instancia de Socket.IO
sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

heartbeat_started = False
counterList = 0
counterListLocal = 0

# Manejar la conexión de un nuevo usuario
@sio.event
async def connect(sid, environ):
    global heartbeat_started
    print('a user connected', sid)
    if not heartbeat_started:
        sio.start_background_task(heartbeat)
        heartbeat_started = True

# Manejar el evento de la imagen 1
@sio.event
async def message(sid, image1):
    print('image1:', image1)
    await sio.emit('image1', f"{sid[:2]} said {image1}")

# Manejar la desconexión de un usuario
@sio.event
async def disconnect(sid):
    print('a user disconnected!', sid)

# Función para enviar un mensaje de "heartbeat" cada 3 segundos para las imagenes
async def heartbeat():
    global counterList
    global counterListLocal
    directory_path = os.environ.get("DIRECTORY_PATH", "../src/assets/images/capture")

    path_list3 = [
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_70544559405702046.png',
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_80808115436543050.png',
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_77522139778321245.png',
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_73285223256143272.png'
                 ]
    path_list4 = [
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_14617622389043640.png',
                 'https://storage.googleapis.com/test_dpdelete/camara3d.jpg',
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_14617622389043640.png',
                 'https://storage.googleapis.com/test_dpdelete/camara2d.jpg'
                 ]
    path_list5 = [
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_70544559405702046.png',
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_70544559405702046.png',
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_70544559405702046.png',
                 'https://storage.googleapis.com/test_dpdelete/Camera_sample_46817716296280458.png'
                 ]

    cameras_path = 'assets/images/capture'

    while True:
        try:
            image_list_cam1 = [x for x in os.listdir(directory_path + "/camera1") if x.endswith(".jpg")]
            await sio.emit('image1', f'{cameras_path}/camera1/{image_list_cam1[counterListLocal % len(image_list_cam1)]}')
        except:
            print("An exception occurred")
        try:
            image_list_cam2 = [x for x in os.listdir(directory_path + "/camera2") if x.endswith(".jpg")]
            await sio.emit('image2', f'{cameras_path}/camera2/{image_list_cam2[counterListLocal % len(image_list_cam2)]}')
        except:
            print("An exception occurred")
        try:
            await sio.emit('image3', path_list3[counterList])
        except:
            print("An exception occurred")
        try:
            await sio.emit('image4', path_list4[counterList])
        except:
            print("An exception occurred")
        try:
            await sio.emit('image5', path_list5[counterList])
        except:
            print("An exception occurred")        
        
        
        await asyncio.sleep(5)
        counterList += 1
        if counterList >= len(path_list3):
            counterList =0


        counterListLocal += 1

# Iniciar el servidor
if __name__ == '__main__':
    port = 3000
    web.run_app(app, port=port)
