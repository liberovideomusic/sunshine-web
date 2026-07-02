// Carica config.json e inizializza la sala premiere
document.addEventListener("DOMContentLoaded", () => {
    fetch("config.json")
        .then(response => response.json())
        .then(config => {
            setupPremiere(config);
        })
        .catch(err => {
            console.error("Errore nel caricamento di config.json:", err);
        });

    setupChat();
});

function setupPremiere(config) {
    // Titolo e descrizione
    const titleEl = document.getElementById("premiere-title");
    const descEl = document.getElementById("premiere-description");

    if (config.title) {
        titleEl.textContent = config.title;
    }

    if (config.description) {
        descEl.textContent = config.description;
    } else {
        descEl.textContent = "";
    }

    // Tema (per ora solo dark-wurlitzer, ma è pronto per estensioni)
    if (config.theme === "dark-wurlitzer") {
        document.body.classList.add("theme-dark-wurlitzer");
    }

    // Video
    if (config.videoId) {
        const videoContainer = document.getElementById("video-container");
        const iframe = document.createElement("iframe");

        const src = `https://www.youtube.com/embed/${config.videoId}?rel=0&autoplay=0&controls=1`;

        iframe.src = src;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;

        videoContainer.innerHTML = "";
        videoContainer.appendChild(iframe);
    }

    // Messaggio di benvenuto in chat
    if (config.welcomeMessage) {
        addChatMessage("Sistema", config.welcomeMessage, true);
    }
}

// Chat locale (solo estetica, nessun server)
function setupChat() {
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        addChatMessage("Tu", text, false);
        input.value = "";
    }

    sendBtn.addEventListener("click", sendMessage);

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}

function addChatMessage(author, text, isSystem) {
    const container = document.getElementById("chat-messages");
    const msgEl = document.createElement("div");
    msgEl.className = "chat-message";

    const metaEl = document.createElement("div");
    metaEl.className = "chat-meta";

    const authorSpan = document.createElement("span");
    authorSpan.className = "chat-author";
    authorSpan.textContent = author;

    const timeSpan = document.createElement("span");
    timeSpan.textContent = " • " + getCurrentTimeString();

    metaEl.appendChild(authorSpan);
    metaEl.appendChild(timeSpan);

    const textEl = document.createElement("div");
    textEl.className = "chat-text";
    textEl.textContent = text;

    if (isSystem) {
        authorSpan.style.color = "#9fd0ff";
    }

    msgEl.appendChild(metaEl);
    msgEl.appendChild(textEl);

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
}

function getCurrentTimeString() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}
