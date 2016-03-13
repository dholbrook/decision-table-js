var assert = require('chai').assert;
var decisionTable = require(__dirname + '/..');

describe('decision-table-js', function() {

  it('should evaluate a trivial table', function() {

    var table = {
      conditions: [
        ['A',        'true', 'true', 'false','false'],
        ['B',        'true', 'false','true', 'false']
      ],
      actions: [
        ['"Both"',   'true', 'false','false','false'],
        ['"Only A"', 'false','true', 'false','false'],
        ['"Only B"', 'false','false','true', 'false'],
        ['"Neither"','false','false','false','true']
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

  it('should evaluate sparse actions and evaluate multipe actions', function() {

    // from the wikipedia example https://en.wikipedia.org/wiki/Decision_table

    var table = {
      conditions: [
        ['printer.notPrinting',                    'Y','Y','Y','Y','N','N','N','N'],
        ['printer.redLightFlashing',               'Y','Y','N','N','Y','Y','N','N'],
        ['printer.unrecognized',                   'Y','N','Y','N','Y','N','Y','N']
      ],
      actions: [
        ['"Check the power cable"',                   ,   ,'X',   ,   ,   ,   ,   ],
        ['"Check the printer-computer cable"',     'X',   ,'X',   ,   ,   ,   ,   ],
        ['"Ensure printer software is installed"', 'X',   ,'X',   ,'X',   ,'X',   ],
        ['"Check/replace ink"',                    'X','X',   ,   ,'X','X',   ,   ],
        ['"Check for paper jam"',                     ,'X',   ,'X',   ,   ,   ,   ],
      ]
    };

    var printingFlashingUnrecognized = decisionTable(table, {
      Y: true, /* true alias */
      N: false, /* false alias */
      X: true, /* true alias */
      printer: {
        notPrinting: true,
        redLightFlashing: true,
        unrecognized: true
      }
    });
    assert.deepEqual(printingFlashingUnrecognized,
      ['Check the printer-computer cable',
      'Ensure printer software is installed',
      'Check/replace ink']);

    var redLightFlashingUnrecognized = decisionTable(table, {
      Y: true, /* true alias */
      N: false, /* false alias */
      X: true, /* true alias */
      printer: {
        notPrinting: false,
        redLightFlashing: true,
        unrecognized: true
      }
    });
    assert.deepEqual(redLightFlashingUnrecognized,
      ['Ensure printer software is installed',
       'Check/replace ink']);

    var noFlags = decisionTable(table, {
      Y: false, /* true alias */
      N: false, /* false alias */
      X: false, /* true alias */
      printer: {
        notPrinting: false,
        redLightFlashing: true,
        unrecognized: true
      }
    });
    assert.deepEqual(noFlags,
     []);
  });

});
