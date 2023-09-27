// �������� ������ �� �������� DOM
const inputField = document.getElementById("calculator-input");
const calculator = document.getElementById("calculator-container");
const memory = document.getElementById("calculator-output");

// ���������� ������� ���������� � ����� ��� �������� �����
const operators = ['*', '/', '+', '-', '%'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];

// ����� ��� �������� ��������� ������������
var isOperatorExits = false; // �������� �� ������� ���������
var isCommaExits = false;   // �������� �� ������� �������

// ���������� ��� �������� �������� ��������� ������������
var currentOperation;
var currentResult = 0;
var previousEntered = 0;

// ���������� ������� ��� ������ ������������
calculator.addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON') return; // ���� ������� �� ������, �������
    event.preventDefault();

    const symbol = event.target.getAttribute('data-index'); // �������� ������ �� �������� ������
    console.log(symbol);
    checkSymbol(symbol); // ��������� ��������� ������
});

// ���������� ������� ��� ����������
document.addEventListener('keydown', function (event) {
    event.preventDefault();
    var buttonSymbol = event.key;

    // ���������� ��������� ��� �������� ���������� ��������
    var regex = /^[0-9+\-*/%=.C<]$/;

    // ������ ��������� ������ �� ��������������� �������
    if (buttonSymbol === 'Enter') buttonSymbol = "=";
    if (buttonSymbol === 'Delete') buttonSymbol = "C";
    if (buttonSymbol === 'Backspace') buttonSymbol = "<";

    // ���� ������ ������������� ����������� ���������, ��������� ���
    if (regex.test(buttonSymbol)) checkSymbol(buttonSymbol);
});

// ������� ��� �������� ���������� ������� � ���������� ���������������� ��������
function checkSymbol(symbol) {
    switch (symbol) {
        case 'C': clearField(); break;
        case '<': removeLastChar(); break;
        case 'M': memory(); break;
        case '=': result(); break;
        case ',': inputSymbol(symbol); break;
    }

    operatorCheck(symbol); // �������� �� ��������
    numberCheck(symbol);   // �������� �� �����
}

// ������� ��� �������� ����������
function operatorCheck(symbol) {
    // ���� ������ �� �������� ��� ��������� ������ � ���� ����� - ��������, �������
    if (!operators.includes(symbol) || operators.includes(inputField.value[inputField.value.length - 1])) return;

    // ���� ���� ����� ������, �������
    if (inputField.value.length === 0) return;

    // ���� ��������� ���, ������������� ������� ���������
    if (!isOperatorExits) {
        currentResult = parseFloat(inputField.value);
    }

    // ���� �������� ����������, ��������� ��������
    if (isOperatorExits) {
        currentResult = checkOperations();
        isCommaExits = false;
    }

    previousEntered = 0; // ����� ����������� ���������� ��������

    currentOperation = symbol; // ������������� ������� ��������
    isOperatorExits = true;   // ������������� ���� ������� ���������
    inputSymbol(symbol);      // ��������� ������ � ���� �����
}

// ������� ��� �������� �����
function numberCheck(symbol) {
    if (!numbers.includes(symbol)) return; // ���� ������ �� �����, �������

    // ���� ���� ����� ������ � ������ - �����, � ���������� ��������� ������ �������� �����, �������
    if (inputField.value === "" && symbol === '.' && previousEntered.toString().includes('.')) return;

    // ���� �������� ����������, ��������� ������ � ����������� ���������� ��������
    if (isOperatorExits) {
        previousEntered += symbol;
        let tempResult = 0;

        tempResult = checkOperations(); // ��������� ��������

        memory.innerHTML = tempResult.toLocaleString('en-US'); // ���������� ��������� � ������

        inputSymbol(symbol); // ��������� ������ � ���� �����
    } else {
        inputField.value += symbol; // ��������� ������ � ���� �����
        previousEntered = 0;       // ����� ����������� ���������� ��������
    }
}

// ������� ��� ���������� �������������� ��������
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

// ������� ��� ����������� ����������
function result() {
    var exp = complexExpresion(inputField.value); // ��������� ���������

    memory.innerHTML = exp; // ���������� ��������� � ������
    inputField.value = exp; // ���������� ��������� � ���� �����

    currentOperation = "";  // ����� ������� ��������
    isOperatorExits = false; // ����� ����� ������� ���������
    currentResult = inputField.value; // ������������� ������� ���������
    previousEntered = 0; // ����� ����������� ���������� ��������
}

// ������� ��� ���������� �������� ���������
function complexExpresion(expresion) {
    return Function('"use strict";return (' + expresion + ')')()
}

// ������� ��� �������� ���������� �������
function removeLastChar() {
    var lastChar = inputField.value[inputField.value.length - 1];

    // ���� ��������� ������ - ��������
    if (operators.includes(lastChar)) {
        isOperatorExits = false; // ����� ����� ������� ���������
        currentOperation = "";   // ����� ������� ��������
    }

    // ���� ��������� ������ - ����� ��� �����
    if (numbers.includes(lastChar)) {
        // ��������� previousEntered, ������ ��������� ������
        previousEntered = previousEntered.toString().slice(0, -1);
    }

    var sliced = inputField.value.slice(0, inputField.value.length - 1); // ������� ��������� ������
    inputField.value = sliced; // ��������� ���� �����
}


// ������� ��� ������� ���� ����� � ������
function clearField() {
    inputField.value = ""; // ������� ���� �����
    memory.innerHTML = ""; // ������� ������
    currentOperation = ""; // ����� ������� ��������
    currentResult = 0;     // ����� �������� ����������
    isOperatorExits = false; // ����� ����� ������� ���������
    previousEntered = 0;   // ����� ����������� ���������� ��������
}

// ������� ��� ���������� ������� � ���� �����
function inputSymbol(symbol) {
    inputField.value += symbol
}
