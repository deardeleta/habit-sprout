from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

quotes = [
    "Small steps every day lead to big changes.",
    "You don’t need to be perfect. You just need to start.",
    "Consistency is more important than intensity.",
    "Grow through what you go through.",
    "Success is the sum of small efforts repeated daily.",
    "Progress, not perfection.",
    "One day or day one — you decide.",
    "Discipline is choosing what you want most over what you want now.",
    "Be stronger than your strongest excuse.",
    "What you do every day matters more than what you do once in a while.",
    "Keep showing up. Even on the hard days.",
    "Change happens when the pain of staying the same is greater than the pain of change.",
    "Every action is a vote for the person you wish to become.",
    "The journey is the reward.",
    "Don’t break the chain — build the streak!"
]


@app.route("/quote", methods=["GET"])
def get_quote():
    return jsonify({"quote": random.choice(quotes)})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
