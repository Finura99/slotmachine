window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = false;

const startBtn = document.getElementById('start-btn');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const resultText = document.getElementById('result');

const symbols = ["🍒", "🍋", "🔔", "⭐", "🍀", "💎"];
let lastWin = 0; // stores winnings for double or nothing

// animate reels spinning
async function spinReelsAnimation() {
    const spinTimes = 15;
    for (let i = 0; i < spinTimes; i++) {
        reel1.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        reel2.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        reel3.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        await new Promise(resolve => setTimeout(resolve, 100)); // waits 1 second between spins
    }
}

// spin and decide result
async function spinSlotMachine() {
    await spinReelsAnimation();

    const result1 = symbols[Math.floor(Math.random() * symbols.length)];
    const result2 = symbols[Math.floor(Math.random() * symbols.length)];
    const result3 = symbols[Math.floor(Math.random() * symbols.length)];

    reel1.innerText = result1;
    reel2.innerText = result2;
    reel3.innerText = result3;

    checkResult(result1, result2, result3);
}

// check win or lose
function checkResult(r1, r2, r3) {
    if (r1 === r2 && r2 === r3) {
        lastWin = 100; // Jackpot reward
        resultText.innerText = "🎉 JACKPOT! You won 100 coins! 🎉\nSay 'double' or 'collect'";
        resultText.style.color = "gold";
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        lastWin = 20; // Small win
        resultText.innerText = "😊 You won 20 coins! 😊\nSay 'double' or 'collect'";
        resultText.style.color = "lightgreen";
    } else {
        lastWin = 0;
        resultText.innerText = "😢 No win. Say 'Spin' to try again.";
        resultText.style.color = "red";
    }
}

// handle double or collect logic
function doubleOrNothing() {
    if (Math.random() < 0.5) { // 50% chance
        lastWin *= 2;
        resultText.innerText = `🔥 You doubled it! You now have ${lastWin} coins 🔥\nSay 'double' again or 'collect'`;
        resultText.style.color = "orange";
    } else {
        lastWin = 0;
        resultText.innerText = "💀 You lost it all! Say 'Spin' to try again.";
        resultText.style.color = "red";
    }
}

// Speech recognition commands
recognition.onresult = (event) => {
    const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log("Recognized:", command);

    if (command.includes("spin")) {
        lastWin = 0;
        spinSlotMachine();
    } else if (command.includes("double") && lastWin > 0) {
        doubleOrNothing();
    } else if (command.includes("collect") && lastWin > 0) {
        resultText.innerText = `✅ You collected ${lastWin} coins! Say 'Spin' to play again.`;
        resultText.style.color = "lightblue";
        lastWin = 0;
    }
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
};

// Start voice recognition
startBtn.addEventListener('click', () => {
    recognition.start();
    alert("Voice control started! Say 'Spin' to play.");
});
