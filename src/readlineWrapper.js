const readline = require('readline');

class ReadlineWrapper {
  constructor() {
    // read input from STDIN
    this.stdin = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
  }
}

module.exports = ReadlineWrapper;
