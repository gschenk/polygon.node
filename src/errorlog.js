const {inspect} = require('util');
const format = require('./format');
const {DEBUG} = require('./config');

class ErrorLog {
  // #printFun; //not in node 11
  constructor(printFun) {
    this.printFun = printFun;
    this.messages = 'No Errors';
    this.points = [];
    this.nodes = [];
    this.extra = '';
    this.count = 0;
  }

  // stores a new error log, overwrites old, but increments counter
  set(message, points, nodes = [], extra = '') {
    this.message = message;
    this.points = points;
    this.nodes = nodes;
    this.extra = extra;
    this.count += 1;
  }

  pointsJSON(printFun = this.printFun) {
    return printFun(
      JSON.stringify(this.points.map(p => p.json())),
    );
  }

  pointsXY(printFun = this.printFun) {
    return format.xyTable(printFun)(this.points);
  }

  nodesXY(printFun = this.printFun) {
    return format.xyTable(printFun)(this.nodes.map(n => n.point));
  }

  printAll(printFun = this.printFun) {
    if (DEBUG && this.count !== 0) {
      printFun(this.message);
      printFun('Points:');
      this.pointsXY();
      printFun('Nodes:');
      this.nodesXY();
      printFun(inspect(this.extra));
      printFun('Non serious errors:', this.count);
    }
  }
}

module.exports = ErrorLog;
