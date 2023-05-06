const fs = require('fs');
const readline = require('readline');
const path = require('node:path'); 
const process = require('node:process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filename = path.join('02-write-file', 'text.txt');

function writeToFile(text) {
  fs.appendFile(filename, text, function(err) {
    if (err) throw err;
    console.log('Text has been written to file');
  });
}

console.log('Enter text to append to file (press CTRL+C or type \'exit\' to exit)');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    process.exit();
  }
  writeToFile(input + '\n');
});

process.on('exit', () => {
    console.log('Nice to meet you. Bye!');
});