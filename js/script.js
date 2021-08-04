'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const reducer = (accumulator, currentValue) => accumulator + currentValue;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Calc and Display Balance
const calcDisplayBalance = function (movements) {
  labelBalance.innerHTML = `${movements.reduce(reducer)}€`;
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
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// IN / OUT / INTEREST
const calcSummary = function (account) {
  const deposits = account.movements.reduce((acc, mov) =>
    mov > 0 ? acc + mov : acc
  );
  const withdrawals = account.movements.reduce((acc, mov) =>
    mov < 0 ? acc + mov : acc
  );
  const interest = (deposits * account.interestRate) / 100;
  labelSumIn.innerHTML = `${deposits}€`;
  labelSumOut.innerHTML = `${withdrawals}€`;
  labelSumInterest.innerHTML = `${interest}€`;
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(` `)
      .map(letter => letter[0])
      .join(``);
  });
};
createUsernames(accounts);

let currentUser;

// Login form event listener
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Clear form fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
    // Display "Hello" message
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    // Calc Balance
    calcDisplayBalance(currentUser.movements);
    // Calc summary
    calcSummary(currentUser);
    // Display movements
    displayMovements(currentUser.movements);
    //Display UI
    containerApp.style.opacity = 1;
  } else {
    // If Login or password is incorrect
    alert(`Login or password is incorrect`);
    return;
  }
});

/////////////////////////////////////////////////

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   dogsJulia = dogsJulia.slice(1, dogsJulia.length - 2);
//   const dogs = [...dogsJulia, ...dogsKate];
//   dogs.forEach(function (dog, i) {
//     console.log(
//       `Dog number ${i + 1} is ${
//         dog < 3 ? `still a puppy 🐶` : `an adult, and is ${dog} years old`
//       }`
//     );
//   });
// };
// checkDogs(dogsJulia, dogsKate);

// const calcAverageHumanAge = function (ages) {
//   // const dogToHuman = ages.map(function (age) {
//   //   if (age <= 2) {
//   //     return 2 * age
//   //   } else return 16 + age * 4
//   // })
//   // const dogToHumanFiltered = dogToHuman.filter(age => age >= 18);
//   // return dogToHumanFiltered.reduce(function (acc, age) {
//   //   return acc + age
//   // }, 0) / dogToHumanFiltered.length;

//   return ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
