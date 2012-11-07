var Symbol = require('./lib/symbol');

var sexpression = module.exports = {
  Symbol: Symbol
, intern: Symbol.intern
, stringify: require('./lib/stringify')
, parse: require('./lib/parse')
};