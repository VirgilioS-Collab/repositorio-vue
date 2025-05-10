from flask import Flask

class BackendApp():
    def __init__(self):
        self.app = Flask(__name__)
        self.routes()

    #Ruta de ejemplo
    def hello(self):
        return 'Hello, World!'

    def setup_routes(self):
        self.app.add_url_rule('/', 'hello', self.hello)

if __name__ == '__main__':
    app_instance = BackendApp()
    app_instance.run()