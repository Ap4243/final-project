let total = 0;
let baseCurrency = 'USD';

document.getElementById('base-currency').addEventListener('change', function() {
    baseCurrency = this.value;
    updateButtonLabels(baseCurrency);
    updateTotalDisplay();
});

function addToTotal(amount) {
    total += Number(amount);
    logTransaction(`Added ${getCurrencySymbol(baseCurrency)}${amount}`);
    updateTotalDisplay();
    triggerLocalConfetti();
}

function subtractFromTotal(amount) {
    total -= Number(amount);
    logTransaction(`Subtracted ${getCurrencySymbol(baseCurrency)}${amount}`);
    updateTotalDisplay();
    triggerLocalConfetti();
}

function getCustomAmount(inputId) {
    return document.getElementById(inputId).value || 0;
}

function updateTotalDisplay() {
    document.getElementById('total').textContent = `Total: ${total} ${getCurrencySymbol(baseCurrency)}`;
}

function convertCurrency() {
    const targetCurrency = document.getElementById('currency-select').value;
    const apiKey = '1d3cc7cd2293edfb3fd7d0cc';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCurrency}/${targetCurrency}/${total}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const convertedAmount = data.conversion_result;
            logTransaction(`Converted ${total} ${getCurrencySymbol(baseCurrency)} to ${convertedAmount} ${getCurrencySymbol(targetCurrency)}`);
            document.getElementById('conversion-result').textContent = 
                `Converted Total: ${convertedAmount} ${targetCurrency}`;
            triggerLocalConfetti();
        })
        .catch(error => console.error('Error converting currency:', error));
}

function updateButtonLabels(currency) {
    let symbol = getCurrencySymbol(currency);

    const buttons = document.querySelectorAll('.button-grid button');
    buttons.forEach(button => {
        const amount = button.textContent.replace(/[^0-9]/g, '');
        button.textContent = `+${symbol}${amount}`;
    });
}

function getCurrencySymbol(currency) {
    switch (currency) {
        case 'EUR': return '\u20AC';
        case 'JPY': return '\u00A5';
        case 'GBP': return '\u00A3';
        case 'MXN': return '\u0024';
        default: return '\u0024';
    }
}

function triggerLocalConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function showCalculator() {
    document.body.classList.remove('slot-machine-active');
    document.getElementById('calculator-section').style.display = 'block';
    document.getElementById('slot-machine-section').style.display = 'none';
    stopSlotMachineMusic();
}

function logTransaction(description) {
    const transactionList = document.getElementById('transaction-list');
    const transactionItem = document.createElement('li');
    transactionItem.textContent = description;
    transactionList.appendChild(transactionItem);
}

updateButtonLabels(baseCurrency);

let playerMoney = 100;

function showSlotMachine() {
    document.body.classList.add('slot-machine-active');
    document.getElementById('calculator-section').style.display = 'none';
    document.getElementById('slot-machine-section').style.display = 'block';
    updatePlayerMoneyDisplay();
    playSlotMachineMusic();
}

function spin() {
    const betAmount = Number(document.getElementById('bet-amount').value);
    if (betAmount > playerMoney || betAmount <= 0) {
        alert('Invalid bet amount');
        return;
    }

    playerMoney -= betAmount;

    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓'];
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    checkWin(betAmount);
}

function checkWin(betAmount) {
    const reel1 = document.getElementById('reel1').textContent;
    const reel2 = document.getElementById('reel2').textContent;
    const reel3 = document.getElementById('reel3').textContent;
    const result = document.getElementById('slot-result');

    if (reel1 === reel2 && reel2 === reel3) {
        const winnings = betAmount * 10;
        playerMoney += winnings;
        result.textContent = `You win ${winnings}!`;
    } else {
        result.textContent = 'You lose!';
    }

    updatePlayerMoneyDisplay();

    if (playerMoney <= 0) {
        alert('Game over! Resetting money.');
        playerMoney = 100;
        updatePlayerMoneyDisplay();
    }
}

function updatePlayerMoneyDisplay() {
    document.getElementById('player-money').textContent = `Money: $${playerMoney}`;
}

function playSlotMachineMusic() {
    const audio = document.getElementById('slot-machine-music');
    audio.play();
}

function stopSlotMachineMusic() {
    const audio = document.getElementById('slot-machine-music');
    audio.pause();
    audio.currentTime = 0;
}

function setVolume(value) {
    const audio = document.getElementById('slot-machine-music');
    audio.volume = value;
}

function toggleMute() {
    const audio = document.getElementById('slot-machine-music');
    audio.muted = !audio.muted;
}
