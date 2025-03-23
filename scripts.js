document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard-section").style.display = "block";
        document.getElementById("user-name").textContent = data.name;
    } else {
        alert("Login failed. Please check your credentials.");
    }
});
