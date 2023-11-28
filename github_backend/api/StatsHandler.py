from flask_restful import Api, Resource, request
import random
from urllib.parse import urlparse
import requests 
import math 
import re


class StatsHandler(Resource):
  #gets and returns a list where each element is a json format commit 
  def getData(self, OWNER, REPO, GITHUB_API_TOKEN):
    headers = {'Authorization': f'Bearer {GITHUB_API_TOKEN}'}
    all_commits = []
    response = requests.get(f'https://api.github.com/repos/{OWNER}/{REPO}/branches', headers=headers)
    print(response)
    data = response.json()
    print(len(data))
    branch_names = []
    for branch in data:
        branch_names.append(branch['name'])
    for branch_name in branch_names:
        page = 1
        while True:
            response = requests.get(
                f'https://api.github.com/repos/{OWNER}/{REPO}/commits?sha={branch_name}',
                headers=headers,
                params={"page": page})
            if response.status_code == 200:
                commits_data = response.json()
                if not commits_data:
                    break  # No more commits to fetch
                all_commits.extend(commits_data)
                page += 1
            else:
                print(f"Error: {response.status_code}")
                break
    #at this point, we should have all our commits in the all_commits list
    return all_commits
  
  #checks whether or not our github url is valid or not based on response status code 
  def isvalidgithuburl(self, url):
    github_url_pattern = r'https?://github\.com/[-\w]+/[-\w]+'
    # Use the regular expression to check if the URL matches
    return re.match(github_url_pattern, url) is not None
  
  #returns contirbutor's names as a set 
  def getContributors(self, commits_data):
    contributors = set()
    for commit in commits_data:
        name = commit["commit"]["author"]["name"]
        contributors.add(name)
    return contributors
  
  #creates the map itself, where you have names as keys and a list as the value 
  def parseCommits(self, commits_data, GITHUB_API_TOKEN):
    headers = {'Authorization': f'Bearer {GITHUB_API_TOKEN}'}
    #maps Name of Contributor to the number of commits they've made for the project for one branch(main)
    name_to_numcommits = {}
    #maps users to sets
    name_to_uniquedates = {}
    #maps users to changes
    name_to_changes = {}
    #used to calculate the total span of the project(aka # of days the project has been worked on)
    numdays = set()
    for commit in commits_data:
        name = commit["commit"]["author"]["name"]
        date = commit["commit"]["author"]["date"][:10]
        commitdetails_url = commit["url"]
        commit_details_data = requests.get(commitdetails_url, headers = headers).json()
        files = commit_details_data["stats"]
        additions = files["additions"]
        deletions = files["deletions"]

        changes = additions + math.floor(0.5 * deletions)

        numdays.add(date)
        name_to_numcommits[name] = name_to_numcommits.get(name, 0) + 1

        if name not in name_to_uniquedates:
            name_to_uniquedates[name] = set()
        name_to_uniquedates[name].add(date)

        name_to_changes[name] = name_to_changes.get(name, 0) + changes # can change here if needed 

    final_map = {}
    for name in set(name_to_numcommits.keys()) | set(name_to_uniquedates.keys()) | set(name_to_changes.keys()):
        values = [name_to_numcommits.get(name), len(name_to_uniquedates.get(name)), name_to_changes.get(name)]
        final_map[name] = values


    return len(numdays), final_map #this maps a users name to a list of [number of commits, number of days he/she has worked on the project, total number of changes he/she made to the project]
  
  def combineNameandUsername(self, contributorsmap, username, name):
    if username in contributorsmap and name in contributorsmap:
        usernamearray = contributorsmap[username]
        namearray = contributorsmap[name]

<<<<<<< HEAD
        numcommits = usernamearray[0] + namearray[0]
        daysworked = usernamearray[1] + namearray[1]
        changesmade = usernamearray[2] + namearray[2]

        newlist = [numcommits, daysworked, changesmade]

        del contributorsmap[name]
        contributorsmap[username] = newlist

  def getStats(self, URL, username, name):
=======
  def getStats(self, URL):
    print("HEY")
>>>>>>> 79c80d317bc8e68d34f837b1b98cca3d378453e0
    if not self.isvalidgithuburl(URL):
       print("not a valid githuburl")
       return "URL is not a valid Github Project link"
    parsed_url = urlparse(URL)
    parts = parsed_url.path.split('/')

    owner = parts[1]
    repo = parts[2]
<<<<<<< HEAD
=======
   #githubapitoken = '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'
>>>>>>> 79c80d317bc8e68d34f837b1b98cca3d378453e0
    githubapitoken = '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'
    commitdata = self.getData(owner, repo, githubapitoken)

    if username not in self.getContributors():
       return "You are not a contributor"
    totaldays, finalmap = self.parseCommits(commitdata, githubapitoken)

    #combineUsernameandName should go here 
    combineNameandUsername(finalmap, username, name)

    returnstring = "Total # of Days this project has been worked on for: " + str(totaldays) + "\n"
    returnstring += "Map of Contributors to [# of commits, days worked, changes made]: "
    returnstring += str(finalmap)
    return returnstring

  def getUserData(self, accesstoken):
      url = 'https://api.github.com/user'
      headers = {
          'Authorization': f'Bearer {accesstoken}',
      }
      try:
          response = requests.get(url, headers=headers)

          if response.ok:
              user_data = response.json()
              print('Username:', user_data['login'])
              print('Actual Name:', user_data['name'])
              return user_data['login'], user_data['name']
          else:
              print('Error:', response.status_code, response.text)
      except Exception as e:
          print('Error:', e)
        

  def get(self):
    githubapitoken = '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'
    URL = request.args.get('url')
    username, name = getUserData(githubapitoken)
    val = "Github URL Not Found"
    if URL:
      val = self.getStats(URL, username, name)
    print(val)
    return {
      'resultStatus': 'SUCCESS',
      'message': f"{val}"
      }
  
  