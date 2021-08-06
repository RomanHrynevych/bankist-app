// ///////////////////////////////////////////////

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

// // Coding challenge #4
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// const eatNormal = function (mustEat, eating) {
//   if (eating <= mustEat * 1.1 && eating >= mustEat * 0.9) {
//     return true;
//   }
//   return false;
// };

// // 1 task
// dogs.forEach(function (dog) {
//   dog.recFood = Number((dog.weight ** 0.75 * 28).toFixed());
// });
// console.log(dogs);

// // 2 task
// const SarahDog = dogs.filter(el => el.owners.includes('Sarah'))[0];
// console.log(SarahDog);
// console.log(eatNormal(SarahDog.recFood, SarahDog.curFood));

// // 3 task
// const divideDogs = dogs.reduce(
//   (arrays, cur) => {
//     if (cur.curFood > cur.recFood) {
//       arrays.ownersEatTooMuch.push(...cur.owners);
//     } else if (cur.curFood < cur.recFood) {
//       arrays.ownersEatTooLittle.push(...cur.owners);
//     }
//     return arrays;
//   },
//   {
//     ownersEatTooMuch: [],
//     ownersEatTooLittle: [],
//   }
// );
// console.log(divideDogs);

// // 4 task
// console.log(
//   `${divideDogs.ownersEatTooMuch.join(' and ')}'s dogs eat too much!`
// );
// console.log(
//   `${divideDogs.ownersEatTooLittle.join(' and ')}'s dogs eat too little!`
// );

// // 5 task
// console.log(
//   `Task 5`,
//   dogs.some(dog => dog.curFood === dog.recFood)
// );

// // 6 task
// console.log(
//   `Task 6`,
//   dogs.some(dog => eatNormal(dog.recFood, dog.curFood))
// );

// // 7 task
// const dogsEatingNormal = [];
// dogs.forEach(dog => {
//   if (eatNormal(dog.recFood, dog.curFood)) {
//     dogsEatingNormal.push(dog);
//   }
// });
// console.log(`Task 7`, ...dogsEatingNormal);

// // 8 Task
// const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(...dogs);
// console.log(...dogsCopy);
