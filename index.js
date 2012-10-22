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

    Parser.prototype.white = function() {
      var ch = (this.buf.current() || this.buf.read());
      while (ch && ch <= ' ') {
        ch = this.buf.read();
      }
    };

    Parser.prototype.number = function() {
      var number
        , string = ''
        , ch = (this.buf.current() || this.buf.read());

      if (ch === '-') {
        string = '-';
        ch = this.buf.read();
      }

      while (ch >= '0' && ch <= '9') {
        string += ch;
        ch = this.buf.read();
      }

      if (ch === '.') {
        string += '.';
        ch = this.buf.read();
        while (ch >= '0' && ch <= '9') {
          string += ch;
          ch = this.buf.read();
        }
      }

      number = string - 0;
      if (isNaN(number)) {
        this.buf.error('Bad number');
      }
      return number;
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