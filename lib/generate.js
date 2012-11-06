var util   = require('util')
  , Symbol = require('./symbol')
  , Cons   = require('./cons');

var generate = function(obj, options) {
  var result;

  options = options || { object: 'alist' };

  switch (typeof obj) {
  case 'string':
    result = '"' + obj + '"';
    break;
  case 'boolean':
    result = obj ? 't' : 'nil';
    break;
  case 'object':
    if (obj === null) {
      result = 'nil';
    } else if (util.isArray(obj)) {
      if (obj.length) {
        result = '(' + obj.map(function(v) { return generate(v) }).join(' ') + ')';
      } else {
        result = 'nil';
      }
    } else if (obj instanceof Symbol) {
      result = obj.toString();
    } else if ('name' in obj) {
      result = obj.name;
    } else if ('car' in obj && 'cdr' in obj) {
      result = '(' + generate(obj.car) + ' . ' + generate(obj.cdr) + ')';
    } else {
      result = [];
      for (var key in obj) {
        result.push(generate(new Cons(key, obj[key])));
      }
      result = '(' + result.join(' ') + ')';
    }
    break;
  case 'function':
    throw new Error('Function object cannt convert sexpression');
    break;
  default:
    result = obj.toString();
    break;
  }

  return result;
};

module.exports = generate;