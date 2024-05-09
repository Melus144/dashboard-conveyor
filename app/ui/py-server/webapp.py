from aiohttp import web
import asyncio
from eventmanager import EventManager

async def main():
    # Start an instance of Socket.IO
    port = 3000
    app = web.Application()
    event = EventManager(app)
    #event = EventManager(app)
    # Run the web application and set_image loop concurrently
    web_runner = web.AppRunner(app)
    await web_runner.setup()
    site = web.TCPSite(web_runner, '0.0.0.0', port)  # Configure reuse_address
    await site.start()

    # Start listening on port 2999 for link updates
    await start_link_listener(event)

async def start_link_listener(event):
    async def handle_link(reader, writer):
        try:
            while True:
                data = await reader.readuntil(separator=b'.jpg')
                message = data.decode().strip()
                if not message:
                    break  # Exit loop if no more data
                cam_id = message[0]
                image_path = message[2:]
                print("Message received:", message)
                await event.set_image(image_path, int(cam_id))
                print("Image set?")
                # Process the message as needed
                # For now, let's simply echo the message back to the client
                response = "Link received: " + message
                writer.write(response.encode() + b'\n')
                await writer.drain()

        except asyncio.streams.IncompleteReadError:
            # Client disconnected
            print("Incomplete Read Error")
        except Exception as e:
            print(f"Error handling link: {e}")
        finally:
            writer.close()

    print("Starting server at 2999")
    server = await asyncio.start_server(handle_link, '0.0.0.0', 2999)
    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    # Configure asyncio event loop with appropriate settings
    asyncio.run(main())
