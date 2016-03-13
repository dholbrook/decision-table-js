var assert = require('chai').assert;
var decisionTable = require(__dirname + '/..');

describe('decision-table-js', function() {

  it('should evaluate a trivial table', function() {

    var table = {
      conditions: [
        [['A'],        ['true'], ['true'], ['false'],['false']],
        [['B'],        ['true'], ['false'],['true'], ['false']]
      ],
      actions: [
        [['"Both"'],   ['true'], ['false'],['false'],['false']],
        [['"Only A"'], ['false'],['true'], ['false'],['false']],
        [['"Only B"'], ['false'],['false'],['true'], ['false']],
        [['"Neither"'],['false'],['false'],['false'],['true']]
      ]
    };

    var both = decisionTable(table, {
      A: true,
      B: true
    });
    assert.deepEqual(both, ['Both']);

    var onlyA = decisionTable(table, {
      A: true,
      B: false
    });
    assert.deepEqual(onlyA, ['Only A']);

    var onlyB = decisionTable(table, {
      A: false,
      B: true
    });
    assert.deepEqual(onlyB, ['Only B']);

    var neither = decisionTable(table, {
      A: false,
      B: false
    });
    assert.deepEqual(neither, ['Neither']);

  });

});
