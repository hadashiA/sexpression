var vows   = require('vows')
  , assert = require('assert')
  , Sexpression = require('../');

vows.describe("Sexpression.stringify").addBatch({
  'String': {
    topic: Sexpression.stringify('hoge'),

    'to double quote string': function(str) {
      assert.equal(str, '"hoge"');
    }
  }
}).export(module);