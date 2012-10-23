var stringify = (function () {
  return function() {
  };
});

var parse = (function() {
  var StringBuffer = (function() {
    var StringBuffer = function(string) {
      this.string = string;
      this.at     = -1;
    };

    StringBuffer.prototype.error = function(msg) {
      throw {
        name: 'ParseError',
        message: msg,
        at: this.at,
        string: this.string
      };
    };

    StringBuffer.prototype.current = function() {
      return this.string.charAt(this.at);
    };

    StringBuffer.prototype.read = function(expectCurrent) {
      if (expectCurrent && expectCurrent !== this.current()) {
        this.error("Expected '" + expectCurrent + "' instead of '" + this.current() + "'");
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

    Parser.prototype.skipWhite = function() {
      var ch = (this.buf.current() || this.buf.read());
      while (ch && ch <= ' ') {
        ch = this.buf.read();
      }
      return ch;
    };

    Parser.prototype.number = function() {
      var result = ''
        , ch = (this.buf.current() || this.buf.read());

      if (ch === '-') {
        result = '-';
        ch = this.buf.read();
      }

      while (ch >= '0' && ch <= '9') {
        result += ch;
        ch = this.buf.read();
      }

      if (ch === '.') {
        result += '.';
        ch = this.buf.read();
        while (ch >= '0' && ch <= '9') {
          result += ch;
          ch = this.buf.read();
        }
      }

      result = result - 0;
      if (isNaN(result)) {
        this.buf.error('Bad number');
      }
      return result;
    };

    Parser.prototype.string = function() {
      var result = ''
        , ch = (this.buf.current() || this.buf.read())
        , quote

      if (ch !== '"') {
        this.buf.error('Bad string');
      }

      ch = this.buf.read();
      while (ch) {
        if (ch === '"') {
          return result;
        } else {
          result += ch;
        }

        ch = this.buf.read();
      }

      this.buf.error('Bad string');
      return null;
    };

    Parser.prototype.word = function() {
      var ch = (this.buf.current() || this.buf.read());

      return null;
    };

    Parser.prototype.value = function() {
      var ch = this.skipWhite();
      switch (ch) {
        case '"':
        return this.string();
        case '-':
        return this.number();
        default:
        return ch >= '0' && ch <= '9' ? this.number() : this.word();
      }
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