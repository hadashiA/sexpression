var Symbol = (function() {
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

  Symbol.mustBeEscapedChar = function(ch) {
    return escapee[ch];
  };

  Symbol.prototype.toString = function() {
    if (this.name.length === 0) {
      return '##';
    } else {
      return this.name.replace(/[#"'`, \(\)]/g, function(escapee) {
      return '\\' + escapee;
      });
    }
  };

  Symbol.intern = function(name) {
    return new Symbol(name);
  };

  return Symbol;
})();

var parse = (function() {
  var StringBuffer = (function() {
    var StringBuffer = function(string) {
      this.string = string;
      this.at = 0;
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
      var ch = this.current();
      while (ch && ch === ' ') {
        ch = this.read();
      }
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
        , escaped = false;

      while (ch && (escaped || !Symbol.mustBeEscapedChar(ch))) {
        escaped = (!escaped && ch === '\\');
        if (!escaped) {
          name += ch;
        }
        ch = buf.read();
      }

      if (isNaN(name - 0)) {
        return Symbol.intern(name);
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
        if (ch === ')') break;
        result.push(this.sExpression(buf));
        ch = buf.current();
      }

      if (ch !== ')') {
        throw this.error(buf, "Invalid list");
      }

      return result;
    },

    sExpression: function(buf) {
      buf.skipWS();
      var ch = buf.current();

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

var sexpression = module.exports = {
  Symbol: Symbol
, stringify: stringify
, parse: parse
};
