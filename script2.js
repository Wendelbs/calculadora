// calculator.js - Versão Completa

/**
 * Calculadora implementada seguindo princípios de Clean Code
 * e programação funcional
 */

// Constantes e configurações
const OPERATORS = ['+', '-', 'x', '/', '%'];
const INITIAL_DISPLAY_VALUE = '0';

// Estado da aplicação
const calculatorState = {
  currentInput: '',
  previousInput: '',
  operator: '',
  shouldResetDisplay: false,
  memory: 0
};

// Seletores DOM
const displayElements = {
  input: document.getElementById('displayInput'),
  result: document.getElementById('displayResult')
};

// Utilitários puros
const isNumber = (value) => !isNaN(value) && value !== '';

const isOperator = (value) => OPERATORS.includes(value);

const isValidNumber = (str) => /^\d+([,.]?\d*)?$/.test(str);

const formatDisplay = (value) => {
  if (value === '' || value === undefined || value === null) return INITIAL_DISPLAY_VALUE;
  
  // Converte vírgula para ponto para cálculos
  const numValue = typeof value === 'string' ? value.replace(',', '.') : value;
  const num = parseFloat(numValue);
  
  if (isNaN(num)) return INITIAL_DISPLAY_VALUE;
  
  // Formata o número com vírgula como separador decimal (padrão brasileiro)
  let formatted = num.toString().replace('.', ',');
  
  // Limita casas decimais se necessário
  if (formatted.includes(',')) {
    const parts = formatted.split(',');
    if (parts[1].length > 8) {
      formatted = num.toFixed(8).replace(/0+$/, '').replace(/[,.]$/, '').replace('.', ',');
    }
  }
  
  return formatted;
};

// Operações matemáticas
const mathOperations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  'x': (a, b) => a * b,
  '/': (a, b) => {
    if (b === 0) throw new Error('Não é possível dividir por zero');
    return a / b;
  },
  '%': (a, b) => (a / 100) * b,
  'sqrt': (a) => Math.sqrt(a),
  'square': (a) => a * a,
  'reciprocal': (a) => {
    if (a === 0) throw new Error('Não é possível calcular 1/0');
    return 1 / a;
  },
  'percent': (a) => a / 100
};

const performCalculation = (firstNumber, operator, secondNumber = null) => {
  try {
    const num1 = parseFloat(firstNumber.toString().replace(',', '.'));
    
    if (isNaN(num1)) {
      throw new Error('Números inválidos');
    }
    
    // Operações unárias
    if (['sqrt', 'square', 'reciprocal', 'percent'].includes(operator)) {
      const operation = mathOperations[operator];
      if (!operation) {
        throw new Error('Operador inválido');
      }
      const result = operation(num1);
      return formatDisplay(result);
    }
    
    // Operações binárias
    if (secondNumber === null) {
      throw new Error('Segundo número necessário');
    }
    
    const num2 = parseFloat(secondNumber.toString().replace(',', '.'));
    if (isNaN(num2)) {
      throw new Error('Números inválidos');
    }
    
    const operation = mathOperations[operator];
    if (!operation) {
      throw new Error('Operador inválido');
    }
    
    const result = operation(num1, num2);
    return formatDisplay(result);
  } catch (error) {
    console.error('Erro no cálculo:', error.message);
    return 'Erro';
  }
};

// Manipulação do display
const updateDisplay = (inputValue, resultValue = null) => {
  displayElements.input.textContent = inputValue || INITIAL_DISPLAY_VALUE;
  displayElements.result.textContent = resultValue !== null ? resultValue : formatDisplay(inputValue);
};

const clearDisplay = () => {
  Object.assign(calculatorState, {
    currentInput: '',
    previousInput: '',
    operator: '',
    shouldResetDisplay: false
  });
  updateDisplay(INITIAL_DISPLAY_VALUE);
};

const clearEntry = () => {
  calculatorState.currentInput = '';
  updateDisplay(calculatorState.previousInput + (calculatorState.operator ? ' ' + calculatorState.operator : ''), INITIAL_DISPLAY_VALUE);
};

const clearAll = () => {
  clearDisplay();
};

const backspace = () => {
  if (calculatorState.shouldResetDisplay) {
    clearDisplay();
    return;
  }
  
  if (calculatorState.currentInput.length > 0) {
    calculatorState.currentInput = calculatorState.currentInput.slice(0, -1);
    updateDisplay(calculatorState.currentInput || INITIAL_DISPLAY_VALUE);
  }
};

// Manipuladores de entrada
const handleNumberInput = (number) => {
  if (calculatorState.shouldResetDisplay) {
    calculatorState.currentInput = number;
    calculatorState.shouldResetDisplay = false;
  } else {
    if (calculatorState.currentInput === '0' && number !== ',') {
      calculatorState.currentInput = number;
    } else {
      calculatorState.currentInput = (calculatorState.currentInput || '') + number;
    }
  }
  
  updateDisplay(calculatorState.currentInput);
};

const handleOperatorInput = (operator) => {
  if (calculatorState.currentInput === '' && calculatorState.previousInput === '') {
    return; // Ignora operador se não há números
  }
  
  // Se já existe um cálculo pendente, executa primeiro
  if (calculatorState.previousInput !== '' && 
      calculatorState.operator !== '' && 
      calculatorState.currentInput !== '' &&
      !calculatorState.shouldResetDisplay) {
    
    const result = performCalculation(
      calculatorState.previousInput, 
      calculatorState.operator, 
      calculatorState.currentInput
    );
    
    calculatorState.previousInput = result;
    calculatorState.currentInput = '';
    updateDisplay(result + ' ' + operator, result);
  } else if (calculatorState.currentInput !== '') {
    calculatorState.previousInput = calculatorState.currentInput;
    calculatorState.currentInput = '';
    updateDisplay(calculatorState.previousInput + ' ' + operator, calculatorState.previousInput);
  }
  
  calculatorState.operator = operator;
  calculatorState.shouldResetDisplay = false;
};

const handleEqualsInput = () => {
  if (calculatorState.previousInput === '' || 
      calculatorState.operator === '' || 
      calculatorState.currentInput === '') {
    return;
  }
  
  const result = performCalculation(
    calculatorState.previousInput,
    calculatorState.operator,
    calculatorState.currentInput
  );
  
  const calculation = `${calculatorState.previousInput} ${calculatorState.operator} ${calculatorState.currentInput} =`;
  
  // Reset state
  calculatorState.currentInput = result;
  calculatorState.previousInput = '';
  calculatorState.operator = '';
  calculatorState.shouldResetDisplay = true;
  
  updateDisplay(calculation, result);
};

const handleDecimalInput = () => {
  if (calculatorState.shouldResetDisplay) {
    calculatorState.currentInput = '0,';
    calculatorState.shouldResetDisplay = false;
  } else if (calculatorState.currentInput === '' || calculatorState.currentInput === '0') {
    calculatorState.currentInput = '0,';
  } else if (!calculatorState.currentInput.includes(',')) {
    calculatorState.currentInput += ',';
  }
  
  updateDisplay(calculatorState.currentInput);
};

const handleSignChange = () => {
  if (calculatorState.currentInput === '' || calculatorState.currentInput === '0') {
    return;
  }
  
  if (calculatorState.currentInput.startsWith('-')) {
    calculatorState.currentInput = calculatorState.currentInput.substring(1);
  } else {
    calculatorState.currentInput = '-' + calculatorState.currentInput;
  }
  
  updateDisplay(calculatorState.currentInput);
};

// Funções de memória
const memoryFunctions = {
  'MC': () => {
    calculatorState.memory = 0;
    console.log('Memória limpa');
  },
  'MR': () => {
    calculatorState.currentInput = formatDisplay(calculatorState.memory);
    updateDisplay(calculatorState.currentInput);
    calculatorState.shouldResetDisplay = true;
  },
  'M+': () => {
    const current = parseFloat((calculatorState.currentInput || '0').replace(',', '.'));
    calculatorState.memory += current;
    console.log('Adicionado à memória:', current);
  },
  'M-': () => {
    const current = parseFloat((calculatorState.currentInput || '0').replace(',', '.'));
    calculatorState.memory -= current;
    console.log('Subtraído da memória:', current);
  },
  'MS': () => {
    calculatorState.memory = parseFloat((calculatorState.currentInput || '0').replace(',', '.'));
    console.log('Valor salvo na memória:', calculatorState.memory);
  },
  'M': () => {
    // Mostra o valor da memória no console (ou pode ser implementado de outra forma)
    console.log('Valor na memória:', calculatorState.memory);
  }
};

// Funções especiais
const specialFunctions = {
  'sqrt(x)': () => {
    if (calculatorState.currentInput === '') return;
    const result = performCalculation(calculatorState.currentInput, 'sqrt');
    calculatorState.currentInput = result;
    calculatorState.shouldResetDisplay = true;
    updateDisplay(`√(${calculatorState.currentInput})`, result);
  },
  'x²': () => {
    if (calculatorState.currentInput === '') return;
    const result = performCalculation(calculatorState.currentInput, 'square');
    calculatorState.currentInput = result;
    calculatorState.shouldResetDisplay = true;
    updateDisplay(`(${calculatorState.currentInput})²`, result);
  },
  '1/x': () => {
    if (calculatorState.currentInput === '') return;
    const result = performCalculation(calculatorState.currentInput, 'reciprocal');
    calculatorState.currentInput = result;
    calculatorState.shouldResetDisplay = true;
    updateDisplay(`1/(${calculatorState.currentInput})`, result);
  },
  '%': () => {
    if (calculatorState.currentInput === '') return;
    const result = performCalculation(calculatorState.currentInput, 'percent');
    calculatorState.currentInput = result;
    updateDisplay(calculatorState.currentInput);
  }
};

// Mapeamento de ações
const buttonActions = {
  // Limpeza
  'C': clearAll,
  'CE': clearEntry,
  'CL': backspace,
  
  // Operações básicas
  '=': handleEqualsInput,
  ',': handleDecimalInput,
  '+': () => handleOperatorInput('+'),
  '-': () => handleOperatorInput('-'),
  'x': () => handleOperatorInput('x'),
  '/': () => handleOperatorInput('/'),
  
  // Funções especiais
  '%': () => specialFunctions['%'](),
  '1/x': () => specialFunctions['1/x'](),
  'x²': () => specialFunctions['x²'](),
  'sqrt(x)': () => specialFunctions['sqrt(x)'](),
  '+/-': handleSignChange,
  
  // Números
  '0': () => handleNumberInput('0'),
  '1': () => handleNumberInput('1'),
  '2': () => handleNumberInput('2'),
  '3': () => handleNumberInput('3'),
  '4': () => handleNumberInput('4'),
  '5': () => handleNumberInput('5'),
  '6': () => handleNumberInput('6'),
  '7': () => handleNumberInput('7'),
  '8': () => handleNumberInput('8'), //
  '9': () => handleNumberInput('9'),
  
  // Funções de memória
  'MC': () => memoryFunctions['MC'](),
  'MR': () => memoryFunctions['MR'](),
  'M+': () => memoryFunctions['M+'](),
  'M-': () => memoryFunctions['M-'](),
  'MS': () => memoryFunctions['MS'](),
  'M': () => memoryFunctions['M']()
};

// Event handler principal
const handleButtonClick = (event) => {
  const buttonValue = event.target.textContent.trim();
  const action = buttonActions[buttonValue];
  
  if (action) {
    action();
  } else {
    console.warn(`Ação não definida para o botão: ${buttonValue}`);
  }
};

// Inicialização
const initializeCalculator = () => {
  // Configura display inicial
  updateDisplay(INITIAL_DISPLAY_VALUE);
  
  // Adiciona event listeners para botões da calculadora
  const buttons = document.querySelectorAll('.buttonD, .buttonIgual');
  buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
  });
  
  // Adiciona event listeners para botões de memória
  const memoryButtons = document.querySelectorAll('.buttonM');
  memoryButtons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
  });
  
  // Adiciona suporte para teclado
  document.addEventListener('keydown', handleKeyboardInput);
};

// Suporte para teclado
const handleKeyboardInput = (event) => {
  const keyMappings = {
    'Enter': '=',
    'Escape': 'C',
    'Delete': 'CE',
    'Backspace': 'CL',
    '+': '+',
    '-': '-',
    '*': 'x',
    '/': '/',
    '.': ',',
    ',': ',',
  };
  
  const key = event.key;
  let mappedKey = keyMappings[key] || key;
  
  // Verifica se é um número
  if (/^\d$/.test(key)) {
    mappedKey = key;
  }
  
  const action = buttonActions[mappedKey];
  if (action) {
    event.preventDefault();
    action();
  }
};

// Inicializa quando o DOM estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCalculator);
} else {
  initializeCalculator();
}

// Exporta para testes (se necessário)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    performCalculation,
    mathOperations,
    isNumber,
    isOperator,
    calculatorState,
    memoryFunctions,
    specialFunctions
  };
}