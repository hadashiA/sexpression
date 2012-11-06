var Symbol = require('./lib/symbol');

var sexpression = module.exports = {
  Symbol: Symbol
, intern: Symbol.intern
, generate: require('./lib/generate')
, parse: require('./lib/parse')
};