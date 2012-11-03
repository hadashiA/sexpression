var intern = (function() {
  var symbols = {};

  var Symbol = function(name) {
    this.name = name;
  };

  Symbol.prototype.toString = function() {
    if (this.name.length === 0) {
      return '##';
    } else {
      return this.name.replace(/["'`, #]/g, function(escapee) {
        return '\\' + escapee;
      });
    }
  };

  return function(name) {
    if (!symbols[name]) {
      symbols[name] = new Symbol(name);
    }
    return symbols[name];
  };
})();

var parse = (function() {
  var StringBuffer = (function() {
    var StringBuffer = function(string) {
      this.string = string;
      this.at = -1;
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

    StringBuffer.prototype.skipWS = function() {
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
      var name = ''
        , ch = buf.current()
        , firstChar = true
        , escaped = false
        , escapee = {
          '"': true,
          "'": true,
          '`': true,
          ' ': true
        };

      while (ch && (escaped || !escapee[ch])) {
        escaped = (!escaped && ch === '\\');
        if (!escaped) {
          name += ch;
        }
        ch = buf.read();
      }

      if (isNaN(name - 0)) {
        return intern(name);
      } else {
        return (name - 0);
      }
    },

    list: function(buf) {
      var result = []
        , ch = buf.current();

      if (ch !== '(') {
        throw this.error(buf, "Invalid list");
      }

      while (ch && ch !== ')') {
        ch = buf.read();
      }

      if (ch !== ')') {
        throw this.error(buf, "Invalid list");
      }

      return result;
    },

    sExpression: function(buf) {
      var ch = buf.skipWS();

      switch (ch) {
        case '"':
        return this.string(buf);
        case '(':
        return this.list(buf);
        default:
        return this.symbol(buf)
      }
    }
  }

  return function(source) {
    var buf = new StringBuffer(source);
    return parser.sExpression(buf);
  };
})();

var stringify = (function () {
  return function() {
    new Error('no implemented');
  };
});

var Sexpression = {
  intern: intern,
  stringify: stringify,
  parse: parse
};

module.exports = Sexpression;