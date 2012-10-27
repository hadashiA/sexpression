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

    StringBuffer.prototype.readWhileBlank = function() {
      var ch = this.read();
      while (ch && ch <= ' ') {
        ch = this.read();
      }
      return ch;
    };

    StringBuffer.prototype.eof = function() {
      return (this.at >= this.string.length);
    };

    return StringBuffer;
  })();

  var parser = {
    error: function(buf, msg) {
      return {
        name: 'ParseError',
        message: msg,
        at: buf.at,
        string: buf.string
      };
    },

    string: function(buf) {
      var result = ''
        , ch = buf.current()
        , backSlashed = false;

      if (ch !== '"') {
        throw this.error(buf, 'Bad string');
      }

      ch = buf.read();
      while (ch) {
        if (ch === '"') {
          return result;
        }

        result += ch;
        ch = buf.read();
      }

      throw this.error(buf, 'Bad string');
      return null;
    },

    symbol: function(buf) {
      var result = ''
        , ch = buf.current()
        , firstChar = true
        , backSlashed = false
        , escapee = {
          '"': '"'
        , "'": "'"
        , '\\': '\\'
        , '`': '`'
        , ',': ','
        , ' ': ' '
        // , '#': '#'
        };

      var isSymbolChar = function() {
        if (escapee[ch]) {
          return backSlashed;
        } else {
          return ( ch === '!'
                || ch === '$'
                || ch === '%'
                || ch === '&'
                || ch === '*'
                || ch === '+'
                || ch === '-'
                || ch === '.'
                || ch === '/'
                || (ch >= '0' && ch <= '9')
                || ch === ':'
                || ch === '<'
                || ch === '>'
                || ch === '='
                || ch === '@'
                || (ch >= 'A' && ch <= 'Z')
                || ch === '^'
                || ch === '_'
                || (ch >= 'a' && ch <= 'z')
                || ch === '{'
                || ch === '}'
                || ch === '|'
                || ch === '~');
        }
      };

      while (ch && ch !== ' ') {
        if (!isSymbolChar()) {
          throw this.error(buf, "Invalid symbol");
        }

        result += ch;
        backSlashed = (ch === '\\');
        ch = buf.read();
      }

      if (result === '.' || result.length == 0) {
        throw this.error(buf, "Invalid symbol");
      }

      if (isNaN(result - 0)) {
        return result;
      } else {
        return (result - 0);
      }
    },

    sExpression: function(buf) {
      var ch = buf.readWhileBlank();

      switch (ch) {
        case '"':
        return this.string(buf);
        default:
        return this.symbol(buf)
      }
      return this.number(buf);
    }
  }

  return function(source) {
    var buf = new StringBuffer(source);
    return parser.sExpression(buf);
  };
})();

var Sexpression = {
  stringify: stringify,
  parse: parse
};

module.exports = Sexpression;