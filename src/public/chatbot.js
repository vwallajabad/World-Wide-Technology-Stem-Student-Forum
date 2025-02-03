const API_KEY = "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"; // Replace with your OpenRouter API key
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

function toggleChatbot() {
    const chatbot = document.getElementById("chatbot-container");
    chatbot.style.display = chatbot.style.display === "block" ? "none" : "block";
}

function closeChatbot() {
    document.getElementById("chatbot-container").style.display = "none";
}

document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatWindow = document.getElementById("chat-window");
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    appendMessage("user", userMessage);

    const botResponse = await getBotResponse("Context: I am an AI cyber assistant named CyberBuddy. I am your best friend for all of your cyber questions! (keep it concise and straight to the point) USER:" + userMessage);
    
    appendMessage("bot", botResponse);

    inputField.value = "";
}

async function getBotResponse(message) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.2-3b-instruct:free", // Choose an available model
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't understand that.";
    } catch (error) {
        console.error("API error:", error);
        return "Oops! Something went wrong. Try again later.";
    }
}

function appendMessage(role, text) {
    const chatWindow = document.getElementById("chat-window");
    const messageContainer = document.createElement("div");
    const messageElement = document.createElement("div");
    const label = document.createElement("div");

    // Apply Markdown parsing for bot messages
    if (role === "bot") {
        messageElement.innerHTML = marked.parse(text);
    } else {
        messageElement.textContent = text;
    }

    messageElement.classList.add("message", role === "user" ? "user-message" : "bot-message");
    
    // Append label and message
    messageContainer.appendChild(label);
    messageContainer.appendChild(messageElement);
    messageContainer.classList.add("message-container");

    chatWindow.appendChild(messageContainer);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
