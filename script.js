const inputField = document.getElementById("calculator-input");
const calculator = document.getElementById("calculator-container");
const outputField = document.getElementById("calculator-output");

const operators = ['*', '/', '+', '-', '%'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
var isOperatorExits = false;
var currentOperation;
var currentResult = 0;
var previousEntered = 0;

calculator.addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON') return;
    event.preventDefault();

    const symbol = event.target.getAttribute('data-index');
    console.log(symbol)
    checkSymbol(symbol);

})


function checkSymbol(symbol) {



    operatorCheck(symbol);
    numberCheck(symbol);

    switch (symbol) {
        case 'C':
            clearField();
            break;
        case '<':
            removeLastChar();
            break;
        case 'M':
            memory();
            break;
        case '=':
            result();
            break;
    }




}





function operatorCheck(symbol) {

    if (!operators.includes(symbol) || operators.includes(inputField.value[inputField.value.length - 1])) return;

    if (inputField.value.length === 0) return;

    if (!isOperatorExits) {
        currentResult = parseInt(inputField.value);
    }

    if (isOperatorExits) {
        switch (currentOperation) {
            case '+':
                currentResult += parseInt(previousEntered);
                break;
            case '-':
                currentResult -= parseInt(previousEntered);
                break;
            case '*':
                currentResult *= parseInt(previousEntered);
                break;
            case '/':
                if (parseInt(previousEntered) !== 0) {
                    currentResult /= parseInt(previousEntered);
                }
                break;
            case '%':
                currentResult %= parseInt(previousEntered);
                break;
        }
        previousEntered = "";
    }

    currentOperation = symbol;
    isOperatorExits = true;
    inputSymbol(symbol);
}

function calculateTemporaryResult(symbol) {

    if (!isOperatorExits) {
        currentResult = parseInt(inputField.value);
    }

    outputField.innerHTML = currentResult;
}




function numberCheck(symbol) {
    if (!numbers.includes(symbol)) return;

    if (isOperatorExits) {
        previousEntered += symbol;
        let tempResult = 0;
        switch (currentOperation) {
            case '+':
                tempResult = currentResult + parseInt(previousEntered);
                break;
            case '-':
                tempResult = currentResult - parseInt(previousEntered);
                break;
            case '*':
                tempResult = currentResult * parseInt(previousEntered);
                break;
            case '/':
                if (parseInt(previousEntered) !== 0) {
                    tempResult = currentResult / parseInt(previousEntered);
                }
                break;
            case '%':
                tempResult = currentResult % parseInt(previousEntered);
                break;
        }
        outputField.innerHTML = tempResult;
        inputSymbol(symbol);
    } else {
        inputField.value += symbol;
    }
}


function clearField() {

}



function clearLastChar() {

}




function result() {
    if (outputField.innerHTML !== "") {

        inputField.value = outputField.innerHTML
        currentOperation = "";
        isOperatorExits = false;
        currentResult = inputField.value;
        previousEntered = 0;

    }
}



function memory() {
    ///хз что за память
}



function inputSymbol(symbol) {
    inputField.value += symbol;
}


function removeLastChar() {
    var lastChar = inputField.value[inputField.value.length - 1]

    if (operators.includes(lastChar)) {
        isOperatorExits = false;
    }

    var sliced = inputField.value.slice(0, inputField.value.length - 1);

    inputField.value = sliced;
}

function clearField() {
    inputField.value = "";
    outputField.innerHTML = "";
    currentOperation = "";
    currentResult = 0;
    isOperatorExits = false;
    previousEntered = 0;
}