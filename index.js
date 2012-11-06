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

  return Symbol;
})();

var Cons = (function() {
  var Cons = function(car, cdr) {
    this.car = (car == null ? null : car);
    this.cdr = (cdr == null ? null : cdr);
  };

  Cons.prototype.forEach = function(callback) {
    var car = this.car
      , cdr = this.cdr
      , result = true
      , i = 0;

    result = callback(car, i++);
    while (result !== false && cdr) {
      car = cdr.car
      cdr = cdr.cdr;
      result = callback(car, i++);
    }
  };

  Cons.prototype.size = function() {
    var car = this.car
      , cdr = this.cdr
      , i = 1;

    while (cdr) {
      car = cdr.car
      cdr = cdr.cdr;
      i++;
    }
    return i;
  };

  Cons.prototype.nth = Cons.prototype.at =
    function(index) {
    var result;
    this.forEach(function(v, i) {
      if (index === i) {
        result = v;
        return false
      } else {
        return true;
      }
    });
    return result;
  };

  return Cons;
})();

var list = function(array) {
  if (array.length) {
    return new Cons(array[0], list(array.slice(1, array.length)));
  } else {
    return null;
  }
};

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
      var ch     = this.current()
        , skiped = false;
      while (ch && ch === ' ') {
        skiped = true;
        ch = this.read();
      }

      return skiped;
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
      while (ch && ch !== '"') {
        result += ch;
        ch = buf.read();
      }

      if (ch !== '"') {
        throw this.error(buf, 'Bad string');
      }
      buf.read();
      return result;
    },

    symbol: function(buf) {
      var name = ''
        , ch = buf.current()
        , firstChar = true
        , escaped = false;

      while (ch && (escaped || !Symbol.endChar(ch))) {
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
      var ch    = buf.current()
        , first = null
        , cons
        , value;

      if (ch !== '(') {
        throw this.error(buf, "Invalid list");
      }

      buf.skipWS();
      ch = buf.read();
      while (ch && ch !== ')') {
        value = this.sExpression(buf);
        if (!cons) {
          first = cons = new Cons(value, null);
        } else {
          cons.car = value;
        }

        buf.skipWS();
        ch = buf.current();
        if (ch === ')') break;

        cons.cdr = new Cons();
        cons = cons.cdr;
      }

      if (ch !== ')') {
        throw this.error(buf, "Invalid list");
      }
      buf.read();

      return first;
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
, Cons: Cons
, intern: Symbol.intern
, list: list
, stringify: stringify
, parse: parse
};