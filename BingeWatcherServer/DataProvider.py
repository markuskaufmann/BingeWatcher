import http.server
import socketserver
import json

PORT = 8000


class Server(http.server.BaseHTTPRequestHandler):

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_GET(self):
        if not self.path == '/favicon.ico':
            date = self.path.split('=')[1]
            with open('data/' + date) as file:
                data = json.load(file)
            self._set_headers()
            self.wfile.write(str(data).encode())


def startWebServer():
    Handler = Server
    httpd = socketserver.TCPServer(("", PORT), Handler)
    print("serving at port", PORT)
    httpd.serve_forever()
    httpd.server_close()


startWebServer()