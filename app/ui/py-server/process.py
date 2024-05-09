from aiohttp import web
import asyncio
import logging
import asyncio
from eventmanager import EventManager
import yaml

def read_yaml(filename):
    with open(filename, 'r') as file:
        data = yaml.safe_load(file)
    return data

async def start_inspection_handler(delay, num_bottles, event):
    async def inspect_bottles(delay_ms, num_bottles, event):
        # Simulate inspecting bottles with the given delay
        for i in range(num_bottles):
            print(f"Inspecting bottle {i+1}...")
            # Simulate delay
            #import time
            #time.sleep(delay_ms / 1000)  # Convert milliseconds to seconds
            await asyncio.sleep(delay_ms / 1000)

            print(f"Bottle {i+1} inspected.")
            print(f'{i}.jpg')
            event.set_image(f'{i}.jpg', 1)
    await inspect_bottles(delay, num_bottles, event)

async def main():
    filename = '/home/gft/Documents/SourceCode/acmarca_leak_inspection/ui/py-server/config.yaml'  # Change this to your YAML file's name
    data = read_yaml(filename)
    delay = data.get('delay', 1000)
    num_bottles = data.get('num_bottles', 1)
    print(delay, num_bottles)
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
        await start_inspection_handler(delay, num_bottles, event)

        

if __name__ == "__main__":
    asyncio.run(main())