document
  .getElementById("userInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const spinner = document.getElementById("spinner");
  const textbox = document.querySelector('.textbox');
  const chatBox = document.getElementById("chatBox");

  if (!userInput.value.trim()) return;

  textbox.style.display = 'none';
  spinner.style.display = "flex";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput.value }),
    });

    const data = await response.json();
    saveMessage("user", userInput.value);
    saveMessage("gpt", data.reply);
    updateChatBox();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    spinner.style.display = "none";
    textbox.style.display = 'flex';
    userInput.value = "";
  }
}

function saveMessage(sender, message) {
  let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  messages.push({ sender, message });
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

function updateChatBox() {
  const chatBox = document.getElementById("chatBox");
  let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

  chatBox.innerHTML = "";
  messages.forEach((msg) => {
    let msgHtml = `<div class="${msg.sender}-message">${msg.message}</div>`;
    chatBox.innerHTML += msgHtml;
  });
}

document.addEventListener("DOMContentLoaded", updateChatBox);

$(document).ready(function () {
  $(".scrollToBottomBtn").click(function () {
    const chatboxContainer = $(".scroller");
    const scrollHeight = chatboxContainer.prop("scrollHeight");
    chatboxContainer.animate({ scrollTop: scrollHeight }, 1000);
  });
});

function autoExpandTextarea() {
  const textarea = document.getElementById('userInput');
  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    const newHeight = Math.min(this.scrollHeight, 300);
    this.style.height = `${newHeight}px`;
  });
}

document.addEventListener('DOMContentLoaded', autoExpandTextarea);

