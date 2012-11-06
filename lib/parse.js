var Symbol = require('./symbol')
  , Cons   = require('./cons');

var StringBuffer = (function() {
  var StringBuffer = function(string) {
    this.string = string;
    this.at = 0;
  };

  StringBuffer.prototype.current = function() {
    return this.string.charAt(this.at);
  };

  StringBuffer.prototype.read = function() {
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

     if (!isNaN(name - 0)) {
       return (name - 0);
     } else if (name === 't') {
       return true;
     } else if (name === 'nil') {
       return null;
     } else {
      return Symbol.intern(name);
    }
  },

  list: function(buf) {
    var result = []
      , ch = buf.current()
      , value;

    if (ch !== '(') {
      throw this.error(buf, "Invalid list");
    }

    buf.skipWS();
    ch = buf.read();
    while (ch && ch !== ')') {
      value = this.sExpression(buf);

      // cons cell
      if (value instanceof Symbol && value.name === '.' && buf.skipWS()) {
        if (buf.current() === ')') {
          throw this.error(buf, 'Invalid list');
        }

        value = new Cons(result.pop(), this.sExpression(buf));
        if (value.car) {
          if (result.length) {
            result.push(value);
          } else {
            result = value;
          }
        } else {
          result = value.cdr;
        }
        buf.skipWS();
        ch = buf.current();
        break;
      }

      result.push(value);

      buf.skipWS();
      ch = buf.current();
    }

    if (ch !== ')') {
      throw this.error(buf, "Invalid list");
    }
    buf.read();

    return (result.length === 0 ? null : result);
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

module.exports = function(source) {
  var buf = new StringBuffer(source);
  return parser.sExpression(buf);
};