let tasks = [];

async function fetchTasks() {
    try {
        const res = await fetch("/tasks");
        tasks = await res.json();
        renderTasks();
    } catch (err) {
        console.error(err);
    }
}

function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter(task => task.date === today);

    todayTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.status === "done" ? "done" : "";

        li.innerHTML = `<span>${formatTask(task)}</span>
                        <div>
                            <button onclick="markDone(${task.id})">Done</button>
                        </div>`;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const type = document.getElementById("type").value;

    if (!title || !date || !time) {
        alert("Please fill all fields");
        return;
    }

    await fetch("/add_task", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, description: desc, date, time, type})
    });

    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("type").value = "daily";

    fetchTasks();
}

async function markDone(id) {
    await fetch(`/mark_done/${id}`, {method: "POST"});
    fetchTasks();
}

fetchTasks();
setInterval(() => checkNotifications(tasks), 60000);
