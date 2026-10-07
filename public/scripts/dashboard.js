const title = document.querySelector("#title");
const description = document.querySelector("#description");
const message = document.querySelector("#message");
const taskForm = document.querySelector("#taskForm");
const tasks = document.querySelector("#tasksList");
const logoutBtn = document.querySelector("#logoutBtn");
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
} else {
    getTasks();
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createTask();
});

async function createTask() {
    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title.value,
                description: description.value
            })
        });
        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        if (!response.ok) {
            message.textContent = data.message || "Could not create the task.";
            return;
        }

        title.value = "";
        description.value = "";
        message.textContent = data.message;
        await getTasks();
    } catch (error) {
        message.textContent = "Could not connect to the server. Please try again.";
    }
}

async function getTasks() {
    try {
        const response = await fetch("/api/tasks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        if (!response.ok) {
            message.textContent = data.message || "Could not load your tasks.";
            return;
        }

        tasks.replaceChildren();
        if (!data.tasks || data.tasks.length === 0) {
            tasks.textContent = "You have no tasks yet.";
            return;
        }

        data.tasks.forEach((task) => {
            const card = document.createElement("article");
            card.className = "task-card";
            const heading = document.createElement("h3");
            heading.textContent = task.title;
            card.append(heading);
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteTask(task.id));
            card.append(deleteButton);
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editTask(task.id));
            card.append(editButton);

            if (task.description) {
                const details = document.createElement("p");
                details.textContent = task.description;
                card.append(details);
            }

            tasks.append(card);
        });
    } catch (error) {
        message.textContent = "Could not load your tasks. Please try again.";
    }
}

async function editTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });
        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        if (!response.ok) {
            message.textContent = data.message || "Could not update the task.";
            return;
        }

        message.textContent = data.message;
        await getTasks();
    } catch (error) {
        message.textContent = "Could not connect to the server. Please try again.";
    }
}
async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        if (!response.ok) {
            message.textContent = data.message || "Could not delete the task.";
            return;
        }

        message.textContent = data.message;
        await getTasks();
    } catch (error) {
        message.textContent = "Could not connect to the server. Please try again.";
    }
}