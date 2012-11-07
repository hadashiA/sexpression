var util   = require('util')
  , Symbol = require('./symbol')
  , Cons   = require('./cons');

var stringify = function(obj, type) {
  var result;

  type = type || 'alist';

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
        result = '(' + obj.map(function(v) { return stringify(v, type) }).join(' ') + ')';
      } else {
        result = 'nil';
      }
    } else if (obj instanceof Symbol) {
      result = obj.toString();
    } else if ('name' in obj) {
      result = obj.name;
    } else if ('car' in obj && 'cdr' in obj) {
      result = '(' + stringify(obj.car, type) + ' . ' + stringify(obj.cdr, type) + ')';
    } else {
      result = [];
      for (var key in obj) {
        if (type === 'keylist') {
          result.push(':' + key + ' ' + stringify(obj[key], type));
        } else {
          result.push(stringify(new Cons(key, obj[key]), type));
        }
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

module.exports = stringify;