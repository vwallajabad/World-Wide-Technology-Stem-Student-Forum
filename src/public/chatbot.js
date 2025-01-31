function toggleChatbot() {
    const chatbot = document.getElementById("chatbot-container");
    chatbot.style.display = "block";
}
function closeChatbot() {
    const chatbot = document.getElementById("chatbot-container");
    chatbot.style.display = "none";
}
function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatWindow = document.getElementById("chat-window");
    const userMessage = inputField.value.trim();
    if (userMessage) {
        const userMessageElement = document.createElement("div");
        userMessageElement.textContent = userMessage;
        userMessageElement.classList.add("message", "user-message");
        chatWindow.appendChild(userMessageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        inputField.value = "";
        
        setTimeout(() => {
            const botMessageElement = document.createElement("div");
            botMessageElement.textContent = "CyberBuddy: I received your message!";
            botMessageElement.classList.add("message", "bot-message");
            chatWindow.appendChild(botMessageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 1000);
    }
}
