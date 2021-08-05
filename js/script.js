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
        <div class="movements__value">${mov}€</div>
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
  deposits = deposits.toFixed(2);
  withdrawals = withdrawals.toFixed(2);
  interest = interest.toFixed(2);
  labelSumIn.innerHTML = `${deposits}€`;
  labelSumOut.innerHTML = `${withdrawals}€`;
  labelSumInterest.innerHTML = `${interest}€`;
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
  if (currentUser?.pin === Number(inputLoginPin.value)) {
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
  const amount = Number(inputTransferAmount.value);
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
  const amount = Number(inputLoanAmount.value);
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
    Number(inputClosePin.value) === currentUser.pin
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

// const arrDiceRolls = Array.from(
//   { length: 100 },
//   () => Math.floor(Math.random() * 6) + 1
// );
// console.log(Math.max(...arrDiceRolls), Math.min(...arrDiceRolls), arrDiceRolls);

// // How many deposits from all accounts
// const bankDepositsSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(el => el > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositsSum);

// // How many deposits more equal than 1000
// const bankDepositsMoreOneThou = accounts
//   .flatMap(acc => acc.movements)
//   .filter(el => el >= 1000).length;
// console.log(bankDepositsMoreOneThou);

// // How many deposits and withdrawals
// const sumDepositsWithdrawals = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sumDepositsWithdrawals);

// Coding challenge #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const eatNormal = function (mustEat, eating) {
  if (eating <= mustEat * 1.1 && eating >= mustEat * 0.9) {
    return true;
  }
  return false;
};

// 1 task
dogs.forEach(function (dog) {
  dog.recFood = Number((dog.weight ** 0.75 * 28).toFixed());
});
console.log(dogs);

// 2 task
const SarahDog = dogs.filter(el => el.owners.includes('Sarah'))[0];
console.log(SarahDog);
console.log(eatNormal(SarahDog.recFood, SarahDog.curFood));

// 3 task
const divideDogs = dogs.reduce(
  (arrays, cur) => {
    if (cur.curFood > cur.recFood) {
      arrays.ownersEatTooMuch.push(...cur.owners);
    } else if (cur.curFood < cur.recFood) {
      arrays.ownersEatTooLittle.push(...cur.owners);
    }
    return arrays;
  },
  {
    ownersEatTooMuch: [],
    ownersEatTooLittle: [],
  }
);
console.log(divideDogs);

// 4 task
console.log(
  `${divideDogs.ownersEatTooMuch.join(' and ')}'s dogs eat too much!`
);
console.log(
  `${divideDogs.ownersEatTooLittle.join(' and ')}'s dogs eat too little!`
);

// 5 task
console.log(
  `Task 5`,
  dogs.some(dog => dog.curFood === dog.recFood)
);

// 6 task
console.log(
  `Task 6`,
  dogs.some(dog => eatNormal(dog.recFood, dog.curFood))
);

// 7 task
const dogsEatingNormal = [];
dogs.forEach(dog => {
  if (eatNormal(dog.recFood, dog.curFood)) {
    dogsEatingNormal.push(dog);
  }
});
console.log(`Task 7`, ...dogsEatingNormal);

// 8 Task
const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(...dogs);
console.log(...dogsCopy);
