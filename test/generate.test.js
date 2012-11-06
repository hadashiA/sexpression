var expect = require('expect.js')
  , sexpression = require('../')
  , generate = sexpression.generate;

describe('generate()', function() {
  describe('number', function() {
    it('should stringify number', function() {
      expect(generate(1122)).to.be('1122');
    });

    it('should stringify decimal number', function() {
      expect(generate(12.31)).to.be('12.31');
    });

    it('should stringify minus number', function() {
      expect(generate(-189)).to.be('-189');
    });

    it('should stringify decimal minus number', function() {
      expect(generate(-100.98)).to.be('-100.98');
    });
  });

  describe('string', function() {
    it('should double quoted', function() {
      expect(generate('aiueo')).to.be('"aiueo"');
    });
  });

  describe('boolean', function() {
    it('should to "t" from true', function() {
      expect(generate(true)).to.be('t');
    });

    it('should to "nil" from false', function() {
      expect(generate(false)).to.be('nil');
    });
  });

  describe('object', function() {
    it('should to "nil" from null', function() {
      expect(generate(null)).to.be('nil');
    });

    it('should to be symbol name', function() {
      var intern = sexpression.Symbol.intern;
      expect(generate(intern('a'))).to.be(intern('a').toString());
    });

    it('should to be cons cell', function() {
      expect(generate({ car: 1, cdr: 2 })).to.be('(1 . 2)');
    });
  });
});