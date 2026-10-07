const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const message = document.querySelector("#message");
const registerForm = document.querySelector("#registerForm");



registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value
            })
        });
        const data = await response.json();
        if(!response.ok) {
            message.innerHTML = `<p>${data.message}</p>`;
            return;
        }
        username.value = "";
        email.value = "";
        password.value = "";
        message.innerHTML = `<p>${data.message}</p><p>Your id is ${data.id}</p>`;
    } catch (error) {
        console.error("Error:", error.message);
        message.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
});