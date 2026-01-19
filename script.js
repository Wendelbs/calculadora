// script.js
const displayInput = document.getElementById("displayInput");
const displayResult = document.getElementById("displayResult");
const buttons = document.getElementsByClassName("buttonD");
const buttonEqual = document.getElementsByClassName("buttonIgual")[0];

let currentInput = '';
let currentResult = '0';
let operator = '';
let waitingForSecondOperand = false;

displayResult.innerHTML = "0";

// Adiciona um listener de evento para cada botão da calculadora
for (const button of buttons) {
    button.addEventListener('click', handleButtonClick);
}

// Adiciona um listener para o botão de igual
buttonEqual.addEventListener('click', handleEqualClick);

/**
 * Lida com o clique de qualquer botão da calculadora.
 * @param {Event} event - O evento de clique.
 */
function handleButtonClick(event) {
    const value = event.target.innerHTML;

    if (isNumber(value) || value === ',') {
        handleNumber(value);
    } else if (isOperator(value)) {
        handleOperator(value);
    } else {
        handleSpecial(value);
    }
    updateDisplay();
}

/**
 * Lida com o clique do botão de igual.
 */
function handleEqualClick() {
    if (operator && currentInput) {
        const result = calculate(parseFloat(currentResult.replace(',', '.')), parseFloat(currentInput.replace(',', '.')), operator);
        currentResult = formatNumber(result);
        currentInput = '';
        operator = '';
        waitingForSecondOperand = false;
        updateDisplay();
    }
}

/**
 * Lida com a entrada de números e o ponto decimal.
 * @param {string} number - O número ou ponto decimal clicado.
 */
function handleNumber(number) {
    if (number === ',') {
        if (waitingForSecondOperand) {
            currentInput = '0,';
            waitingForSecondOperand = false;
        } else if (!currentInput.includes(',')) {
            currentInput += number;
        }
        return;
    }
    
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        currentInput = (currentInput === '0' && number !== ',') ? number : currentInput + number;
    }
}

/**
 * Lida com a entrada de operadores matemáticos.
 * @param {string} nextOperator - O próximo operador clicado.
 */
function handleOperator(nextOperator) {
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (currentResult === '0' || currentResult === '') {
        currentResult = currentInput || '0';
    } else if (operator) {
        const result = calculate(parseFloat(currentResult.replace(',', '.')), parseFloat(currentInput.replace(',', '.')), operator);
        currentResult = formatNumber(result);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    currentInput = '';
}

/**
 * Lida com as operações especiais da calculadora.
 * @param {string} value - O valor do botão especial clicado.
 */
function handleSpecial(value) {
    const number = parseFloat(currentInput.replace(',', '.')) || parseFloat(currentResult.replace(',', '.'));
    let result = number;

    switch (value) {
        case 'C':
            currentInput = '';
            currentResult = '0';
            operator = '';
            waitingForSecondOperand = false;
            break;
        case 'CE':
            currentInput = '';
            break;
        case '+/-':
            result *= -1;
            currentInput = formatNumber(result);
            break;
        case 'x²':
            result = Math.pow(number, 2);
            currentInput = formatNumber(result);
            break;
        case 'srq(x)': // A raiz quadrada é representada por srq(x)
            if (number >= 0) {
                result = Math.sqrt(number);
                currentInput = formatNumber(result);
            } else {
                currentInput = 'Erro';
            }
            break;
        case '%':
            if (operator) {
                 const firstOperand = parseFloat(currentResult.replace(',', '.'));
                 const percentageValue = firstOperand * (number / 100);
                 const finalResult = calculate(firstOperand, percentageValue, operator);
                 currentResult = formatNumber(finalResult);
                 currentInput = '';
                 operator = '';
            } else {
                result = number / 100;
                currentInput = formatNumber(result);
            }
            break;
    }
}

/**
 * Executa o cálculo com base nos operandos e no operador.
 * @param {number} a - O primeiro operando.
 * @param {number} b - O segundo operando.
 * @param {string} op - O operador.
 * @returns {number} O resultado do cálculo.
 */
function calculate(a, b, op) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case 'x':
            return a * b;
        case '/':
            if (b === 0) return 'Erro';
            return a / b;
        case 'CL': // Limpar último caractere
            currentInput = currentInput.slice(0, -1) || '0';
            return;
    }
}

/**
 * Atualiza os displays da calculadora.
 */
function updateDisplay() {
    displayResult.innerHTML = currentInput || currentResult;
    displayInput.innerHTML = currentResult + (operator ? ' ' + operator : '');
}

/**
 * Verifica se um valor é um número.
 * @param {string} value - O valor a ser verificado.
 * @returns {boolean} True se for um número, false caso contrário.
 */
function isNumber(value) {
    return !isNaN(value) && value !== ' ' && value !== '';
}

/**
 * Verifica se um valor é um operador.
 * @param {string} value - O valor a ser verificado.
 * @returns {boolean} True se for um operador, false caso contrário.
 */
function isOperator(value) {
    return ['+', '-', 'x', '/'].includes(value);
}

/**
 * Formata um número para ser exibido, substituindo o ponto por vírgula.
 * @param {number} num - O número a ser formatado.
 * @returns {string} O número formatado como string.
 */
function formatNumber(num) {
    const s = num.toString().replace('.', ',');
    return s;
}
