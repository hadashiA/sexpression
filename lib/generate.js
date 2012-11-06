var util   = require('util')
  , Symbol = require('./symbol')
  , Cons   = require('./cons');

var generate = function(obj) {
  switch (typeof obj) {
    case 'string':
    return '"' + obj + '"';

    case 'boolean':
    return obj ? 't' : 'nil';

    case 'object':
    if (obj === null) {
      return 'nil';
    } else if (obj instanceof Symbol || obj instanceof Cons) {
      return obj.toString();
    } else if ('car' in obj && 'cdr' in obj) {
      return "(" + obj.car + " . " + obj.cdr + ")";
    } else {
      return undefined;
    }

    case 'function':
    throw new Error('Function object cannt convert sexpression');

    default:
    return obj.toString();
  }
};

module.exports = generate;