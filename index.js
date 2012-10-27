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

    number: function(buf) {
      var result = ''
        , ch = buf.current();

      if (ch === '-') {
        result = '-';
        ch = buf.read();
      }

      while (ch >= '0' && ch <= '9') {
        result += ch;
        ch = buf.read();
      }

      if (ch === '.') {
        result += '.';
        ch = buf.read();
        while (ch >= '0' && ch <= '9') {
          result += ch;
          ch = buf.read();
        }
      }

      result = result - 0;
      if (isNaN(result)) {
        throw this.error(buf, 'Bad number');
      }
      return result;
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

    // symbol: function(buf) {
    //   var ch = (buf.current() || buf.read())
    //     , result = '';

    //   var isSymbolChar = function(first) {
    //     if (first && !()) {
    //       return false;
    //     }

    //     return ((ch >= 'a' && ch <= 'z') ||
    //             (ch >= 'A' && ch <= 'Z') ||
    //             (ch >= '*' && ch <= '/' && ch !== ',') || // * + - . /
    //             (ch >= ':' && ch <= '?' && ch !== ';') || // : < = > ?
    //             ()
    //            );
    //   }

    //   [-+*\/\\=!?$#@%^&|<>:_\[\].a-zA-Z0-9]
    //   if (!) {
    //     this.buf.error('Bad symbol');
    //   }

    //   while (ch) {

    //   }

    //   return null;
    // };

    value: function(buf) {
      switch (buf.readWhileBlank()) {
        case '"':
        return this.string(buf);
        case '-':
        return this.number(buf);
        default:
        // return ch >= '0' && ch <= '9' ? this.number() : this.symbol(buf);
        return this.number(buf);
      }
      return this.number(buf);
    }
  }

  return function(source) {
    var buf = new StringBuffer(source);
    return parser.value(buf);
  };
})();

var Sexpression = {
  stringify: stringify,
  parse: parse
};

module.exports = Sexpression;