// Get references to DOM elements
const inputField = document.getElementById("calculator-input");
const calculator = document.getElementById("calculator-container");
const memory = document.getElementById("calculator-output");

// Define arrays of operators and numbers for input validation
const operators = ['*', '/', '+', '-', '%'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];

// Flags to check the state of the calculator
var isOperatorExits = false; // Check for the presence of an operator
var isCommaExits = false;    // Check for the presence of a comma

// Variables to store the current state of the calculator
var currentOperation;
var currentResult = 0;
var previousEntered = 0;

// Event handler for calculator buttons
calculator.addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON') return; // Exit if the element is not a button
    event.preventDefault();

    const symbol = event.target.getAttribute('data-index'); // Get the symbol from the button's attribute
    console.log(symbol);
    checkSymbol(symbol); // Validate the entered symbol
});

// Event handler for keyboard input
document.addEventListener('keydown', function (event) {
    event.preventDefault();
    var buttonSymbol = event.key;

    // Regular expression to validate allowable characters
    var regex = /^[0-9+\-*/%=.C<]$/;

    // Replace some keys with corresponding symbols
    if (buttonSymbol === 'Enter') buttonSymbol = "=";
    if (buttonSymbol === 'Delete') buttonSymbol = "C";
    if (buttonSymbol === 'Backspace') buttonSymbol = "<";

    // If the symbol matches the regular expression, validate it
    if (regex.test(buttonSymbol)) checkSymbol(buttonSymbol);
});

// Function to validate the entered symbol and perform the corresponding action
function checkSymbol(symbol) {
    switch (symbol) {
        case 'C': clearField(); break;
        case '<': removeLastChar(); break;
        case 'M': memory(); break;
        case '=': result(); break;
        case ',': inputSymbol(symbol); break;
    }

    operatorCheck(symbol); // Check for operator
    numberCheck(symbol);   // Check for number
}

// Function to validate operators
function operatorCheck(symbol) {
    // Exit if the symbol is not an operator or the last character in the input field is an operator
    if (!operators.includes(symbol) || operators.includes(inputField.value[inputField.value.length - 1])) return;

    // Exit if the input field is empty
    if (inputField.value.length === 0) return;

    // If there is no operator, set the current result
    if (!isOperatorExits) {
        currentResult = parseFloat(inputField.value);
    }

    // If an operator exists, perform the operation
    if (isOperatorExits) {
        currentResult = checkOperations();
        isCommaExits = false;
    }

    previousEntered = 0; // Reset the previously entered value

    currentOperation = symbol; // Set the current operation
    isOperatorExits = true;    // Set the flag for the presence of an operator
    inputSymbol(symbol);       // Add the symbol to the input field
}

// Function to validate numbers
function numberCheck(symbol) {
    if (!numbers.includes(symbol)) return; // If the symbol is not a number, exit

    if (symbol === '.' && inputField.value.length === 0) inputField.value += 0;
    // If the input field is empty and the symbol is a dot, or the previous symbol contains a dot, exit
    if (symbol === '.' && (operators.includes(inputField.value[inputField.value.length - 1]) || inputField.value[inputField.value.length - 1] === ".")) return;

    // If an operator exists, add the symbol to the previous entered value
    if (isOperatorExits) {
        previousEntered += symbol;
        let tempResult = 0;

        tempResult = checkOperations(); // Perform the operation

        memory.innerHTML = tempResult.toLocaleString('en-US'); // Display the result in memory

        inputSymbol(symbol); // Add the symbol to the input field
    } else {
        inputField.value += symbol; // Add the symbol to the input field
        previousEntered = 0;        // Reset the previously entered value
    }
}

// Function to perform mathematical operations
function checkOperations() {
    switch (currentOperation) {
        case '+': return currentResult + parseFloat(previousEntered);
        case '-': return currentResult - parseFloat(previousEntered);
        case '*': return currentResult * parseFloat(previousEntered);
        case '/':
            if (parseFloat(previousEntered) !== 0) {
                return currentResult / parseFloat(previousEntered);
            }
            break;
        case '%': return currentResult % parseFloat(previousEntered);
    }
}

// Function to display the result
function result() {
    var exp = complexExpression(inputField.value); // Evaluate the expression

    memory.innerHTML = exp; // Display the result in memory
    inputField.value = exp; // Display the result in the input field

    currentOperation = "";  // Reset the current operation
    isOperatorExits = false; // Reset the operator presence flag
    currentResult = inputField.value; // Set the current result
    previousEntered = 0; // Reset the previously entered value
}

// Function to evaluate a complex expression
function complexExpression(expression) {
    return Function('"use strict";return (' + expression + ')')()
}

// Function to remove the last character
function removeLastChar() {
    var lastChar = inputField.value[inputField.value.length - 1];

    // If the last character is an operator
    if (operators.includes(lastChar)) {
        isOperatorExits = false; // Reset the operator presence flag
        currentOperation = "";   // Reset the current operation
    }

    // If the last character is a number or a dot
    if (numbers.includes(lastChar)) {
        // Update previousEntered by removing the last character
        previousEntered = previousEntered.toString().slice(0, -1);
    }

    var sliced = inputField.value.slice(0, inputField.value.length - 1); // Remove the last character
    inputField.value = sliced; // Update the input field
}

// Function to clear the input field and memory
function clearField() {
    inputField.value = ""; // Clear the input field
    memory.innerHTML = ""; // Clear the memory
    currentOperation = ""; // Reset the current operation
    currentResult = 0;     // Reset the current result
    isOperatorExits = false; // Reset the operator presence flag
    previousEntered = 0;   // Reset the previously entered value
}

// Function to add a symbol to the input field
function inputSymbol(symbol) {
    inputField.value += symbol;
}
