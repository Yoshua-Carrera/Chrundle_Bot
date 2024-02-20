import json
import os

env = {}

sampleVariables = {
    "Token": "Your token here",
    "BotAvatar": "The URL of yout bot's avatar here"
}

def initializeToken():
    if os.path.exists('pythonBot/env/variables.json'):
        print('exists')
        with open('pythonBot/env/variables.json') as variables:
            data = json.load(variables)
            env['Token'] = data['Token']
            env['BotAvatar'] = data['BotAvatar']
            return env
    else: 
        os.mkdir('env')
        with open('pythonBot/env/variables.json', 'w', encoding='utf-8') as f:
            json.dump(sampleVariables, f, ensure_ascii=False, indent=4)