from flask_restful import Api, Resource, request
import random

class StatsHandler(Resource):
  
  def getStats(self, URL):
    return f"{URL} + {random.randint(0, 10)}"
               

  def get(self):
    URL = request.args.get('url')
    val = "Github URL Not Found"
    if URL:
      val = self.getStats(URL)
    return {
      'resultStatus': 'SUCCESS',
      'message': f"{val}"
      }