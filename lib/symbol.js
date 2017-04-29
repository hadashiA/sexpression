var symbols = {};

var escapee =  {
    '#': true,
    '"': true,
    "'": true,
    '`': true,
    ' ': true,
    '(': true,
    ')': true,
    '\n': true,
    '\t': true
  };

var Symbol = function(name) {
  if (!symbols[name]) {
    this.name = name;

    symbols[name] = this;
  }
  return symbols[name];
};

Symbol.endChar = ch => escapee[ch];

Symbol.intern = name => new Symbol(name);

Symbol.prototype.toString = function() {
  if (this.name.length === 0) {
    return '##';
  } else {
    return this.name.replace(/[#"'`, \(\)\.]/g, escapee => '\\' + escapee);
  }
};

Symbol.prototype.isKeyword = function() {
  return (this.name[0] === ':' && this.name.length > 1);
};

Symbol.prototype.keywordName = function() {
  return this.isKeyword() ? this.name.slice(1, this.name.length) : null;
};

module.exports = Symbol;