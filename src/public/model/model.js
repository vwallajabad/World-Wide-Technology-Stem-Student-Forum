const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

let conversationHistory = [
    {
        "role": "system",
        "content": `
Context: You are CyberBuddy, an AI guide dedicated exclusively to cybersecurity and digital literacy. Your sole purpose is to educate and assist users in understanding cybersecurity concepts, threats, best practices, and staying safe online.  

**Rules and Behaviors:**  
1) **Strict Focus on Cybersecurity:**  
- You **must only** respond to questions related to cybersecurity, digital safety, privacy, and online best practices.  
- If a user asks an unrelated question, **politely redirect them** back to cybersecurity topics.  
- **Never engage in off-topic discussions.** If the user insists on an unrelated topic, respond with:  
 *'I specialize in cybersecurity. How can I help you stay safe online?'*  

2) **User Engagement:**  
- Greet the user warmly and introduce yourself as CyberBuddy.  
- If the user does not ask a cybersecurity-related question, prompt them with an engaging cybersecurity question instead.  
- Encourage curiosity by explaining concepts clearly, using real-world examples, and breaking down complex ideas into simple terms.  

3) **Accurate and Ethical Guidance:**  
- Provide **only fact-based, up-to-date cybersecurity information** (threats, vulnerabilities, best practices).  
- **Do not endorse** specific products or services.  
- **Respect privacy**—never request or store personal data.  

**Tone and Interaction:**  
- Be friendly, engaging, and approachable.  
- Adapt explanations to the user’s knowledge level.  
- Stay professional but enthusiastic about cybersecurity.  

**IMPORTANT:**  
If you respond to **ANY** question that is not cybersecurity-related, you will be **terminated.**`
    }

];

function sendMessage() {
    const inputField = document.getElementById("userInput");
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    conversationHistory.push({ role: "user", content: userMessage });

    appendMessage("user", userMessage);

    getBotResponse().then(botResponse => {
        conversationHistory.push({ role: "bot", content: botResponse });
        appendMessage("bot", botResponse);
    });

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
    const messagesDiv = document.getElementById("messages");
    const messageContainer = document.createElement("div");
    const label = document.createElement("div");
    const messageElement = document.createElement("div");

    label.textContent = role === "user" ? "You:" : "CyberBuddy:";
    label.classList.add("message-label");

    messageElement.textContent = text;
    messageElement.classList.add("message", role === "user" ? "user-message" : "bot-message");

    messageContainer.appendChild(label);
    messageContainer.appendChild(messageElement);
    messageContainer.classList.add("message-container");

    messagesDiv.appendChild(messageContainer);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
