// Core Variables
let display = document.getElementById('display');
let currentInput = '';
let memoryValue = 0;

function appendNumber(number) {
  if (currentInput === '0') currentInput = '';
  currentInput += number;
  updateDisplay();
}

function appendOperator(operator) {
  if (currentInput === '') return;
  const lastChar = currentInput.slice(-1);
  if (["+", "-", "*", "/", "%"].includes(lastChar)) return;
  currentInput += operator;
  updateDisplay();
}

function appendScientific(func) {
  currentInput += func;
  updateDisplay();
}

function closeParenthesis() {
  currentInput += ')';
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculateResult() {
  try {
    let result = eval(currentInput);
    if (result > 1000) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    addToHistory(currentInput + ' = ' + result);
    currentInput = result.toString();
  } catch {
    currentInput = 'Error';
  }
  updateDisplay();
}

function calculateFactorial() {
  try {
    let num = parseInt(currentInput);
    if (isNaN(num) || num < 0) {
      currentInput = 'Error';
    } else {
      let fact = 1;
      for (let i = 1; i <= num; i++) fact *= i;
      addToHistory(num + '! = ' + fact);
      currentInput = fact.toString();
    }
  } catch {
    currentInput = 'Error';
  }
  updateDisplay();
}

function updateDisplay() {
  display.textContent = currentInput || '0';
}

// Keyboard Input
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key) || ["+", "-", "*", "/", ".", "%", "(", ")"].includes(key)) {
    appendNumber(key);
  } else if (key === 'Enter') {
    calculateResult();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'c') {
    clearDisplay();
  }
});

// AI Assistant
function askAI() {
  const question = document.getElementById('aiInput').value.toLowerCase();
  let answer = '';
  try {
    const value = parseFloat(question.match(/\d+/)?.[0]);
    if (question.includes('sin')) answer = `sin(${value}) = ${Math.sin(toRadians(value)).toFixed(4)}`;
    else if (question.includes('cos')) answer = `cos(${value}) = ${Math.cos(toRadians(value)).toFixed(4)}`;
    else if (question.includes('tan')) answer = `tan(${value}) = ${Math.tan(toRadians(value)).toFixed(4)}`;
    else if (question.includes('log')) answer = `log(${value}) = ${Math.log(value).toFixed(4)}`;
    else if (question.includes('sqrt')) answer = `√${value} = ${Math.sqrt(value).toFixed(4)}`;
    else answer = "Sorry, I couldn't understand.";
  } catch {
    answer = "Error processing the question.";
  }
  document.getElementById('aiOutput').innerText = answer;
}
function toRadians(deg) {
  return deg * (Math.PI / 180);
}

// Theme Toggle & Auto
function toggleTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
}

function switchTheme(value) {
  if (value === 'auto') {
    const hour = new Date().getHours();
    value = hour >= 6 && hour <= 18 ? 'light' : 'dark';
  }
  document.documentElement.setAttribute("data-theme", value);
}

document.getElementById("themeSelector").addEventListener("change", function () {
  switchTheme(this.value);
});

// History with localStorage
function addToHistory(entry) {
  let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  history.unshift(entry);
  if (history.length > 10) history.pop();
  localStorage.setItem('calcHistory', JSON.stringify(history));
  showHistory();
}

function showHistory() {
  const container = document.getElementById('historyList');
  const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  container.innerHTML = history.map(item => `<li>${item}</li>`).join('');
}

function clearHistory() {
  localStorage.removeItem('calcHistory');
  showHistory();
}

document.addEventListener('DOMContentLoaded', showHistory);

// Memory Buttons
function memoryAdd() {
  memoryValue += parseFloat(currentInput) || 0;
  alert("M+ " + memoryValue);
}
function memorySubtract() {
  memoryValue -= parseFloat(currentInput) || 0;
  alert("M- " + memoryValue);
}
function memoryRecall() {
  currentInput = memoryValue.toString();
  updateDisplay();
}
function memoryClear() {
  memoryValue = 0;
  alert("Memory Cleared");
}

// Programmer Mode
function convertToBinary() {
  const val = document.getElementById('progInput').value;
  document.getElementById('progResult').innerText = parseInt(val).toString(2);
}
function convertToHex() {
  const val = document.getElementById('progInput').value;
  document.getElementById('progResult').innerText = parseInt(val).toString(16).toUpperCase();
}

// Health Mode
function calculateBMI() {
  const w = parseFloat(document.getElementById('weight').value);
  const h = parseFloat(document.getElementById('height').value);
  const bmi = w / ((h / 100) ** 2);
  document.getElementById('bmiResult').innerText = `Your BMI is ${bmi.toFixed(2)}`;
}

function calculateAge() {
  const birth = new Date(document.getElementById('birthDate').value);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  document.getElementById('ageResult').innerText = `You are ${age} years old.`;
}

// Currency Mode (basic static)
function convertCurrency() {
  const amount = parseFloat(document.getElementById('currencyAmount').value);
  const from = document.getElementById('fromCurrency').value;
  const to = document.getElementById('toCurrency').value;
  let rate = 1;
  if (from === 'INR' && to === 'USD') rate = 0.012;
  else if (from === 'USD' && to === 'INR') rate = 83.2;
  else if (from === 'INR' && to === 'EUR') rate = 0.011;
  else if (from === 'EUR' && to === 'INR') rate = 90;
  else if (from === 'USD' && to === 'EUR') rate = 0.9;
  else if (from === 'EUR' && to === 'USD') rate = 1.1;
  const result = (amount * rate).toFixed(2);
  document.getElementById('currencyResult').innerText = `${amount} ${from} = ${result} ${to}`;
}
