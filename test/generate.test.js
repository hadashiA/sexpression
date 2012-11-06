var expect      = require('expect.js')
  , sexpression = require('../')
  , generate    = sexpression.generate
  , intern      = sexpression.Symbol.intern;

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
      expect(generate(intern('a'))).to.be(intern('a').toString());
    });

    it('should to be cons cell', function() {
      expect(generate({ car: 1, cdr: 2 })).to.be('(1 . 2)');
    });

    it('should to be null from empty', function() {
      expect(generate([])).to.be('nil');
    });

    it('should be number list from number array', function() {
      expect(generate([1, 2, 3])).to.be('(1 2 3)');
    });

    it('should be nested list', function() {
      expect(generate([1, [2, 3], 4, 5])).to.be('(1 (2 3) 4 5)');
    });

    it('should be string list from string array', function() {
      expect(generate(["a", "b", "c"])).to.be('("a" "b" "c")');
    });

    it('should be mixed list from mixed array', function() {
      expect(generate([1, "abcde", intern('hoge')])).to.be('(1 "abcde" hoge)');
    });

    it('should be alist from object', function() {
      expect(generate({ a: 1, b: 2 })).to.be('(("a" . 1) ("b" . 2))');
    });

    it('should be symbol from object', function() {
      expect(generate({ name: 'hoge' })).to.be('hoge');
    });
  });
});