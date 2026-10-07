const loginForm = document.querySelector("#loginForm");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const message = document.querySelector("#message");


loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        });
        const data = await response.json();
        if (!response.ok) {
            message.textContent = data.message || "Login failed. Please try again.";
            return;
        }

        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } catch (error) {
        message.textContent = "Could not connect to the server. Please try again.";
    }
})