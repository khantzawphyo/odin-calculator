const calculator = document.querySelector('.calculator');
const display = calculator.querySelector('.calculator__display');
const buttons = calculator.querySelectorAll('button');

// Utility functions for basic math operations
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0) ? 'Error' : a / b;

// declare variables
let firstNumber;
let operator;
let secondNumber;

/**
 * Perform arithmetic operations on two numbers based on the specified operator.
 * 
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @param {string} operator - The operation to be performed (e.g., "plus", "minus", "times", "divide").
 * @returns {number|string} The result of the operation. If division by zero is attempted, returns "Can't divide by 0".
 */
function operate(a, b, operator) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            return null;
    }
}

function updateDisplay(value) {
    if (value !== null) {
        display.textContent = value.toString();
    }
}

/**
 * Modifies a number based on a given modifier.
 * 
 * @param {string} number - The number to be modified (as a string).
 * @param {string} modifier - The type of modification to be applied ('+/-' for negation, '%' for percentage).
 * @returns {void}
 */
function modifyNumber(number, modifier) {
    switch (modifier) {
        case "+/-":
            updateDisplay(multiply(number, -1));
            break;
        case "%":
            updateDisplay(divide(number, 100));
            break;
    }
}

buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const btn = e.target;
        const keyValue = btn.textContent;
        const displayValue = display.textContent;
        const { type, key } = btn.dataset;

        if (type === 'number') {
            if (displayValue === '0') {
                updateDisplay(keyValue);
            } else {
                updateDisplay(displayValue + keyValue);
            }
        }

        if (type === 'operator') {
            const operatorKeys = calculator.querySelectorAll('[data-type="operator"]');
            operatorKeys.forEach(el => { el.classList.remove('selected') });
            btn.classList.add('selected');
            
        }

        if (type === 'equal') {

        }

        if (type === 'modifier') {
            if (displayValue === '0') return;
            modifyNumber(displayValue, key);
        }

        if (type === 'decimal') {
            if (!displayValue.includes('.')) {
                updateDisplay(displayValue + '.');
            }

            if (displayValue === '0') {
                updateDisplay('0.');
            }
        }

        if (type === 'clear') {
            if (displayValue.length === 1) {
                updateDisplay('0');
            } else {
                updateDisplay(displayValue.slice(0, -1));
            }
        }

        if (type === 'all-clear') {
            updateDisplay('0');
            firstNumber = null;
            operator = null;
            secondNumber = null;
        }
    });
});


// Event listener for button clicks on mobile devices
document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('touchstart', function (e) {
        btn.classList.add('active');
    });
    btn.addEventListener('touchend', function () {
        btn.classList.remove('active');
    });
});

// keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const button = [...buttons].find(btn => btn.textContent === key || btn.dataset.key === key);
    if (button) button.click();

    if (key === 'Backspace') {
        document.querySelector('[data-type="clear"]').click();
    }

    if (key === 'Escape') {
        document.querySelector('[data-type="all-clear"]').click();
    }

    if (key === 'Enter') {
        document.querySelector('[data-type="equal"]').click();
    }
});

