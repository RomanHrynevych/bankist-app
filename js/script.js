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
    '2021-08-04T17:01:17.194Z',
    '2021-08-07T23:36:17.929Z',
    '2021-08-08T10:51:36.790Z',
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

const makeMap = function (keys, values) {
  if (keys.length !== values.length) return;
  const map = new Map();
  for (let i = 0; i < keys.length; i++) {
    map.set(keys[i], values[i]);
  }
  return map;
};

const sortMap = function (map, ascending) {
  let sorted;
  if (ascending) {
    sorted = [...map.entries()].sort((a, b) => a[1] - b[1]);
  } else {
    sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
  }
  const resultMap = new Map();
  for (let i = 0; i < sorted.length; i++) {
    resultMap.set(sorted[i][0], sorted[i][1]);
  }
  return resultMap;
};
// let timerInterval = null;
const startTimeOut = function () {
  let time = 10 * 60;
  let min = String(Math.floor(time / 60)).padStart(2, 0);
  let sec = String(time % 60).padStart(2, 0);
  labelTimer.textContent = `${min}:${sec}`;
  time--;
  let timerInterval = setInterval(function () {
    let min = String(Math.floor(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if (time === -1) {
      clearInterval(timerInterval);
      containerApp.style.opacity = 0;
    }
  }, 1000);
  return timerInterval;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// show values with true currency
const numberFormatterCurrency = function (acc, num) {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(num.toFixed(2));
};

// Calc and Display Balance
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(reducer, 0);
  labelBalance.innerHTML = `${numberFormatterCurrency(
    account,
    account.balance
  )}`;
};

const differenceBetween2Dates = (date1, date2) =>
  Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

const FormatDateFun = function (input) {
  const normalFormatDate = new Date(Date.parse(input));
  const date = String(normalFormatDate.getDate()).padStart(2, 0);
  const month = String(normalFormatDate.getMonth() + 1).padStart(2, 0);
  const year = normalFormatDate.getFullYear();
  const hour = String(normalFormatDate.getHours()).padStart(2, 0);
  const minutes = String(normalFormatDate.getMinutes()).padStart(2, 0);

  const difference = differenceBetween2Dates(new Date(), normalFormatDate);

  if (difference === 0) {
    return `Today ${hour}:${minutes}`;
  } else if (difference === 1) {
    return `Yesterday ${hour}:${minutes}`;
  } else if (difference < 7) {
    return `${difference} days ago ${hour}:${minutes}`;
  } else {
    return `${date}/${month}/${year} ${hour}:${minutes}`;
  }
};

// log deposit of withdraw
const displayMovements = function (acc, sort) {
  // Sorting type
  let map = makeMap(acc.movementsDates, acc.movements);

  if (sort === 0) {
    btnSort.textContent = `↑ SORT`;
  } else if (sort === 1) {
    map = sortMap(map, true);
    btnSort.textContent = '↓ SORT';
  } else {
    map = sortMap(map, false);
    btnSort.textContent = 'UNSORT';
  }

  // Generate DOM and show
  containerMovements.innerHTML = ``;

  const movements = [...map.values()];
  const dates = [...map.keys()];

  movements.forEach(function (mov, i) {
    const type = mov < 0 ? `withdrawal` : `deposit`;
    const DateFormat = FormatDateFun(dates[i]);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__date">${DateFormat}</div>
        <div class="movements__value">${numberFormatterCurrency(
          acc,
          acc.movements[i]
        )}</div>
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

  labelSumIn.innerHTML = `${numberFormatterCurrency(account, deposits)}`;
  labelSumOut.innerHTML = `${numberFormatterCurrency(account, withdrawals)}`;
  labelSumInterest.innerHTML = `${numberFormatterCurrency(account, interest)}`;
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

const addCurrentTime = function () {
  const now = new Date(Date.now()).toLocaleString();
  const currTime = now.split(', ');
  const day = currTime[0].split('.').join('/');
  const time = currTime[1].split(':').slice(0, 2).join(':');
  labelDate.textContent = `${day}, ${time}`;
};
setInterval(addCurrentTime, 1000);

createUsernames(accounts);

const updateUI = function (acc) {
  // Calc Balance
  calcDisplayBalance(acc);
  // Calc summary
  calcSummary(acc);
  // Display movements
  displayMovements(acc, 0);
  // Display current date
  addCurrentTime();
};

let currentUser, timer;

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
    // Start Time out timer
    if (timer) clearInterval(timer);
    timer = startTimeOut();

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
    currentUser.movementsDates.push(new Date().toISOString());
    transferToUser.movementsDates.push(new Date().toISOString());
    updateUI(currentUser);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputArray.forEach(function (mov) {
      mov.blur();
    });
  } else {
    alert(`This account is't exist ⛔️ or you try transfer to yourself 😁`);
  }
  // Reload Time out timer
  if (timer) clearInterval(timer);
  timer = startTimeOut();
});

//Request Lone function
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +Math.floor(inputLoanAmount.value);
  if (currentUser.movements.some(mov => mov > 0.1 * amount) && amount > 0) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
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
  // Reload Time out timer
  if (timer) clearInterval(timer);
  timer = startTimeOut();
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
  displayMovements(currentUser, sortBool);
});
