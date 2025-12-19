from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)

# Ensure database folder exists
if not os.path.exists("database"):
    os.makedirs("database")

DB = "database/tasks.db"

# Initialize DB
def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            date TEXT,
            time TEXT,
            type TEXT,
            status TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Home route
@app.route("/")
def index():
    return render_template("index.html")

# Get all tasks
@app.route("/tasks")
def get_tasks():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT * FROM tasks")
    tasks = c.fetchall()
    conn.close()
    task_list = [
        {
            "id": t[0],
            "title": t[1],
            "description": t[2],
            "date": t[3],
            "time": t[4],
            "type": t[5],
            "status": t[6]
        } for t in tasks
    ]
    return jsonify(task_list)

# Add task
@app.route("/add_task", methods=["POST"])
def add_task():
    data = request.get_json()
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("INSERT INTO tasks (title, description, date, time, type, status) VALUES (?, ?, ?, ?, ?, ?)",
              (data["title"], data["description"], data["date"], data["time"], data["type"], "pending"))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added successfully"})

# Mark task done
@app.route("/mark_done/<int:task_id>", methods=["POST"])
def mark_done(task_id):
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("UPDATE tasks SET status='done' WHERE id=?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task marked as done"})

if __name__ == "__main__":
    app.run(debug=True)
