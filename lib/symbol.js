var symbols = {}
  , escapee =  {
    '#': true,
    '"': true,
    "'": true,
    '`': true,
    ' ': true,
    '(': true,
    ')': true
  };

var Symbol = function(name) {
  if (!symbols[name]) {
    this.name = name;

    symbols[name] = this;
  }
  return symbols[name];
};

Symbol.endChar = function(ch) {
  return escapee[ch];
};

Symbol.prototype.toString = function() {
  if (this.name.length === 0) {
    return '##';
  } else {
    return this.name.replace(/[#"'`, \(\)\.]/g, function(escapee) {
      return '\\' + escapee;
    });
  }
};

Symbol.intern = function(name) {
  return new Symbol(name);
};

module.exports = Symbol;
