const calculator = document.querySelector(".calculator");
const display = calculator.querySelector(".calculator__display");
const buttons = calculator.querySelectorAll("button");
const operatorKeys = calculator.querySelectorAll('[data-type="operator"]');

// Utility functions for basic math operations
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0 ? "ERROR" : a / b);

const MAX_DIGITS = 9;

// Declare variables
let firstNumber = null;
let operator = null;
let secondNumber = null;
let resultShown = false;

function operate(a, b, operator) {
  const precision = 1e9; // Define precision to handle floating-point arithmetic.
  a = Math.round(a * precision) / precision;
  b = Math.round(b * precision) / precision;

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

// Function to update the display with valid numbers
function updateDisplay(value) {
  if (value !== null) {
    const strValue = value.toString();
    display.textContent =
      strValue.length > MAX_DIGITS
        ? parseFloat(strValue).toExponential(5)
        : strValue;
  }
}

// Function to display error messages
function displayError(message) {
  display.textContent = message;
}

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

function simulateButtonPress(btn) {
  btn.classList.add("active");
  setTimeout(() => {
    btn.classList.remove("active");
  }, 150);
}

// Button click event handler
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const keyValue = e.target.textContent;
    const displayValue = display.textContent;
    const { type, key } = e.target.dataset;

    if (type === "number") {
      if (resultShown) {
        updateDisplay(keyValue); // Start fresh with the new number
        resultShown = false; // Allow new calculation to begin
      } else if (displayValue === "0") {
        updateDisplay(keyValue); // Replace zero
      } else if (displayValue.length < MAX_DIGITS) {
        updateDisplay(displayValue + keyValue); // Append to current number
      }
    }

    if (type === "operator") {
      operatorKeys.forEach((el) => el.classList.remove("selected"));
      e.target.classList.add("selected");

      if (firstNumber !== null && operator) {
        secondNumber = parseFloat(displayValue);
        if (!isNaN(secondNumber)) {
          const result = operate(firstNumber, secondNumber, operator);
          updateDisplay(result);
          firstNumber = result; // Use result as the first number for the next operation
          secondNumber = null; // Reset the second number
          resultShown = true; // Indicate a result has been shown
        }
      } else {
        firstNumber = parseFloat(displayValue);
      }

      operator = key; 

      if (!resultShown) {
        updateDisplay(""); // Clear display for new input
      }
      return; // Prevent clearing the display again
    }

    if (type === "equal") {
      operatorKeys.forEach((el) => el.classList.remove("selected"));

      secondNumber = parseFloat(displayValue);
      if (isNaN(firstNumber) || isNaN(secondNumber)) {
        displayError("Error");
        return; // Stop further execution
      }

      const result = operate(firstNumber, secondNumber, operator);
      if (result === "ERROR") {
        displayError("Cannot divide by 0");
      } else {
        updateDisplay(result);
        resultShown = true; // Indicate a result has been shown
        firstNumber = result; // Store result as the first number for the next calculation
        operator = null; // Reset operator to allow a fresh start
      }
    }

    if (type === "modifier") {
      if (displayValue !== "0") {
        modifyNumber(parseFloat(displayValue), key); // Ensure value is treated as a number
      }
    }

    if (type === "decimal") {
      if (!displayValue.includes(".")) {
        updateDisplay(displayValue + ".");
      }
      if (displayValue === "0") {
        updateDisplay("0.");
      }
    }

    if (type === "clear") {
      updateDisplay(
        displayValue.length === 1 ? "0" : displayValue.slice(0, -1)
      ); // Reset or remove last character
    }

    if (type === "all-clear") {
      updateDisplay("0");
      operatorKeys.forEach((el) => el.classList.remove("selected"));
      firstNumber = null;
      operator = null;
      secondNumber = null;
      resultShown = false;
    }
  });
});

// Event listener for button clicks on mobile devices
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("touchstart", () => btn.classList.add("active"));
  btn.addEventListener("touchend", () => btn.classList.remove("active"));
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;
  const button = [...buttons].find(
    (btn) => btn.textContent === key || btn.dataset.key === key
  );

  if (button) {
    simulateButtonPress(button);
    button.click();
  }

  if (key === "Backspace") {
    const clearButton = document.querySelector('[data-type="clear"]');
    simulateButtonPress(clearButton);
    clearButton.click();
  }

  if (key === "Escape") {
    const allClearButton = document.querySelector('[data-type="all-clear"]');
    simulateButtonPress(allClearButton);
    allClearButton.click();
  }

  if (key === "Enter") {
    const equalButton = document.querySelector('[data-type="equal"]');
    simulateButtonPress(equalButton);
    equalButton.click();
  }
});
