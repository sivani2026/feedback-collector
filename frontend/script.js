const API = "http://localhost:5000";

async function addFeedback() {

    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    await fetch(`${API}/addFeedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, message })
    });

    document.getElementById("name").value = "";
    document.getElementById("message").value = "";

    loadFeedbacks();
}

async function loadFeedbacks() {

    const res = await fetch(`${API}/feedbacks`);
    const data = await res.json();

    const feedbackList = document.getElementById("feedbackList");

    feedbackList.innerHTML = "";

    data.forEach(item => {

        feedbackList.innerHTML += `
            <div class="card">
                <h3>${item.name}</h3>
                <p>${item.message}</p>

                <button onclick="deleteFeedback('${item._id}')">
                    Delete
                </button>
            </div>
        `;
    });
}

async function deleteFeedback(id) {

    await fetch(`${API}/feedback/${id}`, {
        method: "DELETE"
    });

    loadFeedbacks();
}

loadFeedbacks();