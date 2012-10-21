var stringify = (function () {
  return function() {
  };
});

var parse = (function() {
  var ParseError = function(message, at, data) {
    this.name    = 'ParseError';
    this.message = message;
    this.at      = at;
    this.data    = data;
  };

  var StringBuffer = (function() {
    var StringBuffer = function(string) {
      this.string = string;
      this.at     = -1;
    };

    StringBuffer.prototype.current = function() {
      return this.string.charAt(this.at);
    };

    StringBuffer.prototype.read = function(expectCurrent) {
      if (expectCurrent && expectCurrent !== this.current()) {
        throw new ParseError("Expected '" + expectCurrent + "' instead of '" + this.current() + "'",
                             this.at, this.source);
      }
      return this.string.charAt(++this.at);
    };

    StringBuffer.prototype.append = function(appended) {
      this.string += appended;
    };

    return StringBuffer;
  })();

  var Parser = (function() {
    var Parser = function(source) {
      this.buf = new StringBuffer(source);
    };

    Parser.prototype.white = function() {
      var ch = this.buf.current();
      while (ch && ch <= ' ') {
        ch = this.buf.read();
      }
    };

    Parser.prototype.number = function() {
      
    }

    Parser.prototype.value = function() {
      return this.number();
    };

    return Parser;
  })();

  return function(source) {
    var parser = new Parser(source);
    return parser.value();
  };
})();

var Sexpression = {
  stringify: stringify,
  parse: parse
};

module.exports = Sexpression;