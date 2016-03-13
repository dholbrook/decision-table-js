var VM = require('vm2').VM;


module.exports = function decisionTable(table, facts) {

  //construct new VM use most restive policy
  var vm = new VM({
    timeout: 100,
    sandbox: facts,
    require: false,
    requireExternal: false,
    requireNative: []
  });

  //get column from 2d array
  var getCol = function(arr, index) {
    return arr.map(function(value) {
      return value[index];
    });
  };

  // evaluate condition portion of table
  var evaluatedConditions = table.conditions.map(function(row) {
    // evaluation of the 1st column
    var conditionVal = vm.run(row[0]);

    // evaluate cells and return them
    var cells = row.slice(1);
    return cells.map(function(cell) {
      var cellVal = vm.run(cell);
      return cellVal === conditionVal;
    });
  });

  // evaluate action portion of table
  var resolvedActions = table.actions.reduce(function(result, row) {
    // evaluation of the 1st column
    var actionVal = vm.run(row[0]);

    //evaluate each cell against the matching column in conditions
    var cells = row.slice(1);
    var found = cells.findIndex(function(cell, idx) {
      //evaluate cell
      var cellVal = vm.run(cell);
      var colEval = getCol(evaluatedConditions, idx)
        .reduce(function(a, b) {
          return (a === b) ? a : false;
        }, true);
      // return true if the cell and conditions column are true
      return cellVal && colEval;
    });
    // if there was a match add the actionValue to the accumulator
    if (found > -1) {
      result.push(actionVal);
    }
    return result;
  }, []);

  // return all resolved actions
  return resolvedActions;
}
