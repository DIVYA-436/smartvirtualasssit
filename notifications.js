function checkNotifications(tasks) {
    const now = new Date();
    const nowTime = now.toTimeString().slice(0,5);
    const today = now.toISOString().split("T")[0];

    tasks.forEach(task => {
        if (task.date === today && task.status === "pending") {
            const [hour, min] = task.time.split(":");
            let notifyDate = new Date(today);
            notifyDate.setHours(hour);
            notifyDate.setMinutes(min - 10);

            if (now.getHours() === notifyDate.getHours() && now.getMinutes() === notifyDate.getMinutes()) {
                notify(`Upcoming Task: ${task.title} in 10 minutes`);
            }

            if (nowTime === task.time) {
                notify(`Time to do: ${task.title}`);
            }
        }
    });
}

function notify(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    }
}

if (Notification.permission !== "granted") {
    Notification.requestPermission();
}
