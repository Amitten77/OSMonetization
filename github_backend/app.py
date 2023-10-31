
from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS #comment this on deployment
from api.StatsHandler import StatsHandler


app = Flask(__name__)
CORS(app) #comment this on deployment
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

api.add_resource(StatsHandler, '/flask/hello')

if __name__ == '__main__':
    app.run(port = 8000, debug=True)