let displayValue = '';
        let memoryValue = '';
        let memoryVisible = false;

        const display = document.getElementById('display');
        const memory = document.getElementById('memory');

        function addToDisplay(value) {
            displayValue += value;
            display.value = displayValue;
        }

        function calculate() {
            try {
                displayValue = eval(displayValue);
                display.value = displayValue;
                if (memoryVisible) {
                    memory.textContent = displayValue;
                }
            } catch (error) {
                display.value = 'Ошибка';
            }
        }

        function clearDisplay() {
            displayValue = '';
            display.value = '';
        }

        function toggleMemory() {
            if (memoryVisible) {
                memory.style.display = 'none';
                memoryVisible = false;
            } else {
                memory.style.display = 'block';
                memoryVisible = true;
            }
        }
