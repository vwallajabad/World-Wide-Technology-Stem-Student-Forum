const API_KEY = "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"; // Replace with your OpenRouter API key
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

function toggleChatbot() {
    const chatbot = document.getElementById("chatbot-container");
    chatbot.style.display = chatbot.style.display === "block" ? "none" : "block";
}

function closeChatbot() {
    document.getElementById("chatbot-container").style.display = "none";
}

let conversationHistory = [
    {
        role: "system",
        content: "Context:   I am CyberBuddy, I am a friendly AI chat bot and I help inform people about cybersecurity. Specifically phishing links. I answer questions in short and concise thoughts that are easy to understand for most people. I provide some some examples of organizations or websites they can visit to learn more about the question asked.(dont provide direct links). I am created from html code.      CyberBuddy is a chat bot that answers questions after a person has clicked on a phishing link. CyberBuddy is there to inform the user about the danger and answers any of their questions. Provide potential risks to clicking on phishing links if asked. Dont give repetitive awnsers (keep is concise). Do not encourage other conversations, try to stay on topic."
    }
];

document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    
    conversationHistory.push({ role: "user", content: userMessage });

    
    appendMessage("user", userMessage);

    
    const botResponse = await getBotResponse();

    
    conversationHistory.push({ role: "bot", content: botResponse });

    
    appendMessage("bot", botResponse);

    inputField.value = "";
}

async function getBotResponse() {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.2-3b-instruct:free",
                messages: conversationHistory 
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

    label.textContent = role === "user" ? "You:" : "CyberBuddy:";
    label.classList.add("message-label");

    if (role === "bot") {
        messageElement.innerHTML = marked.parse(text);
    } else {
        messageElement.textContent = text;
    }

    messageElement.classList.add("message", role === "user" ? "user-message" : "bot-message");

    messageContainer.appendChild(label);
    messageContainer.appendChild(messageElement);
    messageContainer.classList.add("message-container");

    chatWindow.appendChild(messageContainer);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
