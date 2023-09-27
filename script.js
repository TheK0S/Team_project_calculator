// Получаем ссылки на элементы DOM
const inputField = document.getElementById("calculator-input");
const calculator = document.getElementById("calculator-container");
const memory = document.getElementById("calculator-output");

// Определяем массивы операторов и чисел для проверки ввода
const operators = ['*', '/', '+', '-', '%'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];

// Флаги для проверки состояния калькулятора
var isOperatorExits = false; // Проверка на наличие оператора
var isCommaExits = false;   // Проверка на наличие запятой

// Переменные для хранения текущего состояния калькулятора
var currentOperation;
var currentResult = 0;
var previousEntered = 0;

// Обработчик событий для кнопок калькулятора
calculator.addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON') return; // Если элемент не кнопка, выходим
    event.preventDefault();

    const symbol = event.target.getAttribute('data-index'); // Получаем символ из атрибута кнопки
    console.log(symbol);
    checkSymbol(symbol); // Проверяем введенный символ
});

// Обработчик событий для клавиатуры
document.addEventListener('keydown', function (event) {
    event.preventDefault();
    var buttonSymbol = event.key;

    // Регулярное выражение для проверки допустимых символов
    var regex = /^[0-9+\-*/%=.C<]$/;

    // Замена некоторых клавиш на соответствующие символы
    if (buttonSymbol === 'Enter') buttonSymbol = "=";
    if (buttonSymbol === 'Delete') buttonSymbol = "C";
    if (buttonSymbol === 'Backspace') buttonSymbol = "<";

    // Если символ соответствует регулярному выражению, проверяем его
    if (regex.test(buttonSymbol)) checkSymbol(buttonSymbol);
});

// Функция для проверки введенного символа и выполнения соответствующего действия
function checkSymbol(symbol) {
    switch (symbol) {
        case 'C': clearField(); break;
        case '<': removeLastChar(); break;
        case 'M': memory(); break;
        case '=': result(); break;
        case ',': inputSymbol(symbol); break;
    }

    operatorCheck(symbol); // Проверка на оператор
    numberCheck(symbol);   // Проверка на число
}

// Функция для проверки операторов
function operatorCheck(symbol) {
    // Если символ не оператор или последний символ в поле ввода - оператор, выходим
    if (!operators.includes(symbol) || operators.includes(inputField.value[inputField.value.length - 1])) return;

    // Если поле ввода пустое, выходим
    if (inputField.value.length === 0) return;

    // Если оператора нет, устанавливаем текущий результат
    if (!isOperatorExits) {
        currentResult = parseFloat(inputField.value);
    }

    // Если оператор существует, выполняем операцию
    if (isOperatorExits) {
        currentResult = checkOperations();
        isCommaExits = false;
    }

    previousEntered = 0; // Сброс предыдущего введенного значения

    currentOperation = symbol; // Устанавливаем текущую операцию
    isOperatorExits = true;   // Устанавливаем флаг наличия оператора
    inputSymbol(symbol);      // Добавляем символ в поле ввода
}

// Функция для проверки чисел
function numberCheck(symbol) {
    if (!numbers.includes(symbol)) return; // Если символ не число, выходим

    // Если поле ввода пустое и символ - точка, и предыдущий введенный символ содержит точку, выходим
    if (inputField.value === "" && symbol === '.' && previousEntered.toString().includes('.')) return;

    // Если оператор существует, добавляем символ к предыдущему введенному значению
    if (isOperatorExits) {
        previousEntered += symbol;
        let tempResult = 0;

        tempResult = checkOperations(); // Выполняем операцию

        memory.innerHTML = tempResult.toLocaleString('en-US'); // Отображаем результат в памяти

        inputSymbol(symbol); // Добавляем символ в поле ввода
    } else {
        inputField.value += symbol; // Добавляем символ в поле ввода
        previousEntered = 0;       // Сброс предыдущего введенного значения
    }
}

// Функция для выполнения математических операций
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

// Функция для отображения результата
function result() {
    var exp = complexExpresion(inputField.value); // Вычисляем выражение

    memory.innerHTML = exp; // Отображаем результат в памяти
    inputField.value = exp; // Отображаем результат в поле ввода

    currentOperation = "";  // Сброс текущей операции
    isOperatorExits = false; // Сброс флага наличия оператора
    currentResult = inputField.value; // Устанавливаем текущий результат
    previousEntered = 0; // Сброс предыдущего введенного значения
}

// Функция для вычисления сложного выражения
function complexExpresion(expresion) {
    return Function('"use strict";return (' + expresion + ')')()
}

// Функция для удаления последнего символа
function removeLastChar() {
    var lastChar = inputField.value[inputField.value.length - 1];

    // Если последний символ - оператор
    if (operators.includes(lastChar)) {
        isOperatorExits = false; // Сброс флага наличия оператора
        currentOperation = "";   // Сброс текущей операции
    }

    // Если последний символ - число или точка
    if (numbers.includes(lastChar)) {
        // Обновляем previousEntered, удаляя последний символ
        previousEntered = previousEntered.toString().slice(0, -1);
    }

    var sliced = inputField.value.slice(0, inputField.value.length - 1); // Удаляем последний символ
    inputField.value = sliced; // Обновляем поле ввода
}


// Функция для очистки поля ввода и памяти
function clearField() {
    inputField.value = ""; // Очищаем поле ввода
    memory.innerHTML = ""; // Очищаем память
    currentOperation = ""; // Сброс текущей операции
    currentResult = 0;     // Сброс текущего результата
    isOperatorExits = false; // Сброс флага наличия оператора
    previousEntered = 0;   // Сброс предыдущего введенного значения
}

// Функция для добавления символа в поле ввода
function inputSymbol(symbol) {
    inputField.value += symbol
}
