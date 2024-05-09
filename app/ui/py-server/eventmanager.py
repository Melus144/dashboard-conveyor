import os
import socketio
from aiohttp import web
import asyncio
import logging
import time
import asyncio

class EventManager:
    def __init__(self, app):
        self.app = app
        self.sio = socketio.AsyncServer(cors_allowed_origins='*')
        self.sio.attach(self.app)
        self.sio.on('connect', self.connect)
        self.sio.on('disconnect', self.disconnect)
        
        self.path = None
        self.img_id = None
        self.cameras_path = 'assets/images/capture'

    async def set_image(self, path:str, img:int):
        # TODO: USE MUTEX?
        print(path, img)
        self.path = path
        self.img_id = img
        await self.sio.start_background_task(self.setimage)


    async def setimage(self):
        try:
            print("Sending image")
            await self.sio.emit(f'image{self.img_id}', f'{self.cameras_path}/camera{self.img_id}/{self.path}')
        except Exception as e:
            logging.error(f"An exception occurred in setimage: {e}")

    # Manejar la conexión de un nuevo usuario
    async def connect(self, sid, environ):
        print('a user connected', sid)

    # Manejar el evento de la imagen 1
    # async def message(sid, image):
    #     print('image1:', image1)
    #     await self.sio.emit('image1', f"{sid[:2]} said {image1}")

    # Manejar la desconexión de un usuario
    async def disconnect(self, sid):
        print('a user disconnected!', sid)

async def main():
    # Start an instance of Socket.IO
    port = 3000
    app = web.Application()
    event = EventManager(app)

    # Run the web application and set_image loop concurrently
    web_runner = web.AppRunner(app)
    await web_runner.setup()
    site = web.TCPSite(web_runner, '0.0.0.0', port)
    await site.start()

    while True:
        event.set_image("0.jpg", 1)
        await asyncio.sleep(8)
        event.set_image("1.jpg", 1)
        await asyncio.sleep(8)

if __name__ == "__main__":
    asyncio.run(main())