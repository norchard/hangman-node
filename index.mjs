import chalk from "chalk";
import readline from "readline";
import fetch from "node-fetch";

// For reading from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Define colors for game output
const stayinAlive = chalk.yellow;
const wrong = chalk.bold.red;
const correct = chalk.bold.green.underline;
const lost = chalk.bgRed;
const won = chalk.bgGreen;

// Get word from random word API
let res = await fetch("https://random-word-api.herokuapp.com/word");
let json = await res.json();
const word = json[0].toUpperCase();

const correctGuesses = word.split("").map((x) => [x, false]);
const incorrectGuesses = [];

rl.on("line", (letters) => {
  // check each letter individually
  letters.split("").forEach((letter) => {
    letter = letter.toUpperCase();
    if (letter < "A" || letter > "Z") return;

    // if the letter is in the word mark the correctGuesses as true
    if (word.includes(letter)) {
      correctGuesses.forEach(([l, bool], i) => {
        if (l === letter && !bool) correctGuesses[i][1] = true;
      });
    } else {
      // if the letter is not in the word and not already guessed, add it to the incorrectGuesses
      if (!incorrectGuesses.includes(letter)) incorrectGuesses.push(letter);
    }
  });

  makeOutput();

  // check if the game has been won
  const correctGuessCount = correctGuesses.filter(([l, b]) => b).length;
  if (correctGuessCount === word.length) {
    console.log(won("\nYou Win!\n"));
    rl.close();
    // check if the game has been lost
  } else if (incorrectGuesses.length === 6) {
    revealWord();
    console.log(lost("\nYou Lose!\n"));
    rl.close();
  }
});

const revealWord = () => {
  correctGuesses.forEach(([l, b], i) => (correctGuesses[i] = [l, true]));
  makeOutput();
};

const man = [
  "  |===|\n  |     \n  |    \n _|_     ",
  "  |===|\n  |   O \n  |    \n _|_     ",
  "  |===|\n  |   O \n  |   H\n _|_     ",
  "  |===|\n  |  \\O \n  |   H\n _|_     ",
  "  |===|\n  |  \\O/\n  |   H\n _|_     ",
  "  |===|\n  |  \\O/\n  |   H\n _|_ /   ",
  "  |===|\n  |  \\O/\n  |   H\n _|_ / \\ ",
];

const makeOutput = () => {
  const answer = correctGuesses
    .map(([l, b]) => (b ? correct(l) : correct(" ")))
    .join(" ");

  console.clear();

  console.log(
    stayinAlive(man[incorrectGuesses.length]) +
      "  " +
      answer +
      "  " +
      wrong(incorrectGuesses.join(" "))
  );
};

makeOutput();
