var expect      = require('expect.js')
  , sexpression = require('../')
  , stringify   = sexpression.stringify
  , intern      = sexpression.Symbol.intern;

describe('stringify()', function() {
  describe('number', function() {
    it('should stringify number', function() {
      expect(stringify(1122)).to.be('1122');
    });

    it('should stringify decimal number', function() {
      expect(stringify(12.31)).to.be('12.31');
    });

    it('should stringify minus number', function() {
      expect(stringify(-189)).to.be('-189');
    });

    it('should stringify decimal minus number', function() {
      expect(stringify(-100.98)).to.be('-100.98');
    });
  });

  describe('string', function() {
    it('should double quoted', function() {
      expect(stringify('aiueo')).to.be('"aiueo"');
    });
  });

  describe('boolean', function() {
    it('should to "t" from true', function() {
      expect(stringify(true)).to.be('t');
    });

    it('should to "nil" from false', function() {
      expect(stringify(false)).to.be('nil');
    });
  });

  describe('object', function() {
    it('should to "nil" from null', function() {
      expect(stringify(null)).to.be('nil');
    });

    it('should to be symbol name', function() {
      expect(stringify(intern('a'))).to.be(intern('a').toString());
    });

    it('should to be cons cell', function() {
      expect(stringify({ car: 1, cdr: 2 })).to.be('(1 . 2)');
    });

    it('should to be null from empty', function() {
      expect(stringify([])).to.be('nil');
    });

    it('should be number list from number array', function() {
      expect(stringify([1, 2, 3])).to.be('(1 2 3)');
    });

    it('should be nested list', function() {
      expect(stringify([1, [2, 3], 4, 5])).to.be('(1 (2 3) 4 5)');
    });

    it('should be string list from string array', function() {
      expect(stringify(["a", "b", "c"])).to.be('("a" "b" "c")');
    });

    it('should be mixed list from mixed array', function() {
      expect(stringify([1, "abcde", intern('hoge')])).to.be('(1 "abcde" hoge)');
    });

    it('should be alist from object', function() {
      expect(stringify({ a: 1, b: 2 })).to.be('(("a" . 1) ("b" . 2))');
    });

    it('should be symbol from object', function() {
      expect(stringify({ name: 'hoge' })).to.be('hoge');
    });

    it('should specify keyword list from object', function() {
      expect(stringify({ a: 1, b: 2 }, 'keylist')).to.be('(:a 1 :b 2)');
    });

    it('should alist from object nested', function() {
      expect(stringify([1, { hoge: 1, fuga: 2 }, "aaa"])).to
      .be('(1 (("hoge" . 1) ("fuga" . 2)) "aaa")');
    });

    it('should specify keyword list from object nested', function() {
      expect(stringify([1, { hoge: 1, fuga: 2 }, "aaa"], 'keylist')).to
      .be('(1 (:hoge 1 :fuga 2) "aaa")');
    });
  });
});