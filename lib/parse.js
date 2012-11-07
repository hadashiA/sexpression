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
    var ch = this.current();
    while (ch && ch === ' ') {
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
      , value
      , k;

    if (ch !== '(') {
      throw this.error(buf, "Invalid list");
    }

    buf.skipWS();
    ch = buf.read();
    while (ch && ch !== ')') {
      value = this.sExpression(buf);

      if (value instanceof Symbol) {
        // cons cell
        if (value.name === '.' && buf.current() === ' ') {
          if (buf.skipWS() === ')') {
            throw this.error(buf, 'Invalid list');
          }

          value = new Cons(result.pop(), this.sExpression(buf));
          if (value.car) {
            result.length ? result.push(value) : result = value;
          } else {
            result = value.cdr;
          }
          ch = buf.skipWS();
          break;

        // keylist
        } else if (value.isKeyword()) {
          k = value.keywordName();
          value = {};
          while (true) {
            if (k) {
              ch = buf.skipWS();
              if (ch === ')') {
                value[k] = null;
                break;
              } else {
                value[k] = this.sExpression(buf);
                k = null;
              }
            } else {
              ch = buf.skipWS();
              if (ch === ':') {
                k = this.sExpression(buf);
                if (k instanceof Symbol && k.isKeyword()) {
                  k = k.keywordName();
                }
              } else {
                break;
              }
            }
          }
        }
      }
      result.push(value);
      ch = buf.skipWS();
    }

    if (ch !== ')') {
      throw this.error(buf, "Invalid list");
    }
    buf.read();

    if (result.length == 0) {
      return null;
    } else if (result.length <= 1
             && !(result[0] instanceof Symbol)
             && (typeof result[0] === 'object')) {
      return result[0];
    } else {
      return result;
    }
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