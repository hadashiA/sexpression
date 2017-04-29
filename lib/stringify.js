var util   = require('util');
var Symbol = require('./symbol');
var Cons   = require('./cons');

var stringify = (obj, type) => {
  var result;

  type = type || 'keylist';

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
        result = '(' + obj.map(v => stringify(v, type)).join(' ') + ')';
      } else {
        result = 'nil';
      }
    } else if (obj instanceof Symbol || 'name' in obj) {
      result = Symbol.prototype.toString.apply(obj);
    } else if ('car' in obj && 'cdr' in obj) {
      result = '(' + stringify(obj.car, type) + ' . ' + stringify(obj.cdr, type) + ')';
    } else {
      result = [];
      for (var key in obj) {
        if (type === 'alist') {
          result.push(stringify(new Cons(key, obj[key]), type));
        } else {
          result.push(':' + key + ' ' + stringify(obj[key], type));
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