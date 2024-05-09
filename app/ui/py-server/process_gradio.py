from aiohttp import web
import asyncio
import logging
import asyncio
from eventmanager import EventManager
import gradio as gr

class Processor:
    def __init__(self):
        self.a = None
    async def async_init(self):
        # Start an instance of Socket.IO
        port = 3000
        app = web.Application()
        self.event = EventManager(app)

        # Run the web application and set_image loop concurrently
        web_runner = web.AppRunner(app)
        await web_runner.setup()
        site = web.TCPSite(web_runner, '0.0.0.0', port)
        await site.start()

        # Interface definition.
        demo = gr.Blocks()

        with demo:
            # Create the input components
            delay_input = gr.Number(label="Delay (milliseconds)", minimum=0, maximum=5000, value=1000, show_label=True)
            num_bottles_input = gr.Number(label="Number of Bottles", minimum=1, maximum=10, value=5, show_label=True)
            button = gr.Button()
            button.click(self.start_inspection_handler, inputs=[delay_input, num_bottles_input])
        demo.launch(server_name="0.0.0.0")

    async def start_inspection_handler(self, delay, num_bottles):
        async def inspect_bottles(delay_ms, num_bottles):
            # Simulate inspecting bottles with the given delay
            for i in range(num_bottles):
                print(f"Inspecting bottle {i+1}...")
                # Simulate delay
                import time
                time.sleep(delay_ms / 1000)  # Convert milliseconds to seconds
                print(f"Bottle {i+1} inspected.")
                print(f'{i}.jpg')
                self.event.set_image(f'{i}.jpg', 1)
        await inspect_bottles(delay, num_bottles)


    @classmethod
    async def create(cls):
        instance = cls()
        await instance.async_init()
        return instance

async def main():
    processor = await Processor.create()

        

if __name__ == "__main__":
    asyncio.run(main())