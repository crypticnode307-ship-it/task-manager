const taskList = document.querySelector("#tasksList");
async function checkServer() {
try {
    const response = await fetch("/api/health");

    const data = await response.json();

    document.getElementById("status").textContent =
        data.message;

} catch (error) {
    document.getElementById("status").textContent =
        "Could not connect to the server.";
}
}

checkServer();

async function getTasks() {
    if (!taskList) return;

    const token = localStorage.getItem("token");
    if (!token) {
        taskList.textContent = "Log in to view your tasks.";
        return;
    }

    try{
        const response = await fetch("/api/tasks", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("token");
            taskList.textContent = "Your session expired. Please log in again.";
            return;
        }
        if (!response.ok) {
            taskList.textContent = data.message || "Could not load your tasks.";
            return;
        }

        const tasks = data.tasks || [];
        taskList.replaceChildren();
        tasks.forEach((task) => {
            const taskItem = document.createElement("div");
            taskItem.textContent = `${task.title}: ${task.description || ""}`;
            taskList.append(taskItem);
        });
        if (tasks.length === 0) {
            taskList.textContent = "You have no tasks yet.";
        }
    }
    catch(error) {
        taskList.textContent = "Could not load your tasks.";
    }
}
getTasks();