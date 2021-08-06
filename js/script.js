'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputArray = [
  inputLoginUsername,
  inputLoginPin,
  inputTransferAmount,
  inputTransferTo,
  inputLoanAmount,
  inputCloseUsername,
  inputClosePin,
];

const reducer = (accumulator, currentValue) => accumulator + currentValue;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Calc and Display Balance
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(reducer, 0);
  labelBalance.innerHTML = `${account.balance}€`;
};

// log deposit of withdraw
const displayMovements = function (movements) {
  containerMovements.innerHTML = ``;
  movements.forEach(function (mov, i) {
    const type = mov < 0 ? `withdrawal` : `deposit`;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__date"></div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// IN / OUT / INTEREST
const calcSummary = function (account) {
  let deposits = account.movements.reduce(
    (acc, mov) => (mov > 0 ? acc + mov : acc),
    0
  );
  let withdrawals = account.movements.reduce(
    (acc, mov) => (mov < 0 ? acc + mov : acc),
    0
  );
  let interest = (deposits * account.interestRate) / 100;
  labelSumIn.innerHTML = `${deposits.toFixed(2)}€`;
  labelSumOut.innerHTML = `${withdrawals.toFixed(2)}€`;
  labelSumInterest.innerHTML = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(` `)
      .map(letter => letter[0])
      .join(``);
  });
};
const findAccountByUsername = function (name) {
  return accounts.find(acc => acc.username === name);
};
const findAccountByOwner = function (name) {
  return accounts.find(acc => acc.owner === name);
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Calc Balance
  calcDisplayBalance(acc);
  // Calc summary
  calcSummary(acc);
  // Display movements
  displayMovements(acc.movements);
};

let currentUser;

// Login form event listener
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = findAccountByUsername(inputLoginUsername.value);
  if (currentUser?.pin === +inputLoginPin.value) {
    // Clear form fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputArray.forEach(function (mov) {
      mov.blur();
    });
    // Display "Hello" message
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    // Update UI
    updateUI(currentUser);
    //Display UI
    containerApp.style.opacity = 1;
  } else {
    // If Login or password is incorrect
    alert(`Login or password is incorrect`);
    return;
  }
});

// Transfer function between 2 accounts
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferToUser = findAccountByOwner(inputTransferTo.value);
  const amount = +inputTransferAmount.value;
  if (transferToUser !== currentUser && transferToUser) {
    if (amount <= 0) {
      alert(`You can't type a negative number or 0`);
      return;
    }
    if (currentUser.balance < amount) {
      alert(`There isn't enough money on your bank account`);
      return;
    }
    currentUser.movements.push(-amount);
    transferToUser.movements.push(amount);
    updateUI(currentUser);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputArray.forEach(function (mov) {
      mov.blur();
    });
  } else {
    alert(`This account is't exist ⛔️ or you try transfer to yourself 😁`);
  }
});

//Request Lone function
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +Math.floor(inputLoanAmount.value);
  if (currentUser.movements.some(mov => mov > 0.1 * amount) && amount > 0) {
    currentUser.movements.push(amount);
    updateUI(currentUser);
  } else {
    alert(
      `Max size of loan can be ${Math.max(...currentUser.movements) * 10 - 1}`
    );
  }
  inputArray.forEach(function (mov) {
    mov.value = '';
    mov.blur();
  });
});

// Function to close the account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.username &&
    +inputClosePin.value === currentUser.pin
  ) {
    accounts.splice(accounts.indexOf(currentUser), 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputArray.forEach(function (mov) {
      mov.value = '';
      mov.blur();
    });
  }
});

// Sorting function
let sortBool = 0;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sortBool++;
  sortBool = sortBool === 3 ? 0 : sortBool;
  if (sortBool === 0) {
    displayMovements(currentUser.movements);
    btnSort.textContent = `↑ SORT`;
  } else if (sortBool === 1) {
    displayMovements([...currentUser.movements].sort((a, b) => a - b));
    btnSort.textContent = '↓ SORT';
  } else {
    displayMovements([...currentUser.movements].sort((a, b) => b - a));
    btnSort.textContent = 'UNSORT';
  }
});
