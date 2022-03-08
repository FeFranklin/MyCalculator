//---------------------------------------------
// Global Variables
//---------------------------------------------
let toCalculate = [];
let entry = [];
let ans = '';
let operations = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y,
}
//---------------------------------------------

function clicked(keyValue) {
  // Validation First
  if (!isValid(keyValue)) {
    return;
  }

  if (keyValue === 'AC') {
    allClear();
    return;

  }

  if (keyValue === 'CE') {
    clearEntry();
    return;

  }

  if (isAnOperator(keyValue)) {
    // Replace operator if last value is an operator
    if (isAnOperator(toCalculate[toCalculate.length - 1]) && entry.length === 0) {
      toCalculate.pop();
      toCalculate.push(keyValue);
      setMainDisplay(keyValue);
      setSecondaryDisplay(toCalculate.join(''));
      return;
    }

    // Push last entry
    if (entry.length !== 0) {
      toCalculate.push(entry.join(''));
      entry = [];
    }

    toCalculate.push(keyValue);
    setSecondaryDisplay(toCalculate.join(''));
    return;

  }

  if (isAnOperand(keyValue)) {
    if (keyValue === '.' && entry.length === 0) {
      entry.push('0' + keyValue);

    } else {
      entry.push(keyValue);
    }

    setMainDisplay(entry.join(''));
    setSecondaryDisplay(toCalculate.join('') + entry.join(''));
    return;

  }

  if (keyValue === '=') {
    toCalculate.push(entry.join(''));
    ans = '' + calculate(toCalculate);

    if (ans.length >= 13) {
      entry = [];
      toCalculate = [];
      ans = '';
      displayError();
      return;
    }

    setMainDisplay(ans);
    setSecondaryDisplay(toCalculate.join('') + '=' + ans);

    entry = [];
    toCalculate = [];
    // Store Ans for possible future chaining
    toCalculate.push(ans);
    ans = '';
  }

}

//---------------------------------------------
// Display Operations
//---------------------------------------------

function allClear() {

  toCalculate = [];
  entry = [];
  setMainDisplay('0');
  setSecondaryDisplay('0');

}

function clearEntry() {
  // Clear Ans
  if (toCalculate.length === 1 && entry.length === 0) {
    entry = [];
    toCalculate = [];
    setMainDisplay('0');
    setSecondaryDisplay('0');
    return;
  }

  if (entry.length === 0 && toCalculate === 0) {
    setMainDisplay('0');
    setSecondaryDisplay('0');
    return;
  }

  // Clear current entry
  if (entry.length > 0) {
    entry = [];
    setMainDisplay('0');
    setSecondaryDisplay(toCalculate.join(''));
    return;
  }

  // Clear Operator and previous entry
  if (entry.length === 0 && toCalculate.length >= 2) {
    setMainDisplay('0');
    toCalculate.pop(); // Operador
    toCalculate.pop(); // Operando
    setSecondaryDisplay(toCalculate.join(''));
    return;
  }

}

//---------------------------------------------
// Display Operations
//---------------------------------------------

function setMainDisplay(value) {
  if (value === '') {
    $('.mainDisplay').text('0');
    return;
  }

  $('.mainDisplay').text(value);

}

function setSecondaryDisplay(value) {
  if (value === '') {
    $('.secondaryDisplay').text('0');
    return;
  }

  $('.secondaryDisplay').text(value);

}

function displayError() {
  $('.mainDisplay').text('ERR');
}

//---------------------------------------------
// Calculations
//---------------------------------------------

function calculate(array) {

  const arr = checkNumbersType(array);

  return arr.reduce((sum, currVal, index, arr) => {

    if (index % 2 !== 0) { // Check if is an operator
      var operator = currVal;
      return operations[operator](sum, arr[index + 1]);
    }

    return sum;
  }, arr[0]);

}

function checkNumbersType(array) {

  return array.map(value => {
    if (value.match(/[0-9]/) && typeof value === 'string') {
      return parseFloat(value, 10);
    }
    return value;
  });

}


//---------------------------------------------
// Validations
//---------------------------------------------

function isAnOperator(value) {

  if (value !== undefined) {
    return value.match(/[\+||\-||\*||\/]/);
  }

  return false;
}

function isAnOperand(value) {
  return value.match(/[0-9||\.]/);
}

function isValid(keyValue) {

  if (keyValue === '.') {
    if (entry.some((value) => value.includes('.')))
      return false;
  }

  if (keyValue === '=') {
    if (entry.length === 0) {
      return false;
    }

    var lastOp = toCalculate[toCalculate.length - 1];
    if (isAnOperator(lastOp) && entry.length === 0)
      return false;

    if (lastOp === '.')
      return false;
  }

  if (keyValue === '0') {
    if (entry.length === 0)
      return false;

    if (entry.every((value) => value === '0'))
      return false;
  }

  if (isAnOperator(keyValue)) {
    if (toCalculate.length === 0 && entry.length === 0)
      return false;
  }

  if (isAnOperand(keyValue)) {
    if (toCalculate.length > 0) {
      var lastOp = toCalculate[toCalculate.length - 1];

      if (isAnOperand(lastOp))
        return false;
    }

    if(entry.length > 10) {
      return false;
    }
  }

  return true;
}


$('.btn').on('click', function () {
  clicked($(this).text());
});

//----------------------------------------------