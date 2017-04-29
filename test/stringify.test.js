var expect      = require('expect.js');
var sexpression = require('../');
var stringify   = sexpression.stringify;
var intern      = sexpression.Symbol.intern;

describe('stringify()', () => {
  describe('number', () => {
    it('should stringify number', () => {
      expect(stringify(1122)).to.be('1122');
    });

    it('should stringify decimal number', () => {
      expect(stringify(12.31)).to.be('12.31');
    });

    it('should stringify minus number', () => {
      expect(stringify(-189)).to.be('-189');
    });

    it('should stringify decimal minus number', () => {
      expect(stringify(-100.98)).to.be('-100.98');
    });
  });

  describe('string', () => {
    it('should double quoted', () => {
      expect(stringify('aiueo')).to.be('"aiueo"');
    });
  });

  describe('boolean', () => {
    it('should to "t" from true', () => {
      expect(stringify(true)).to.be('t');
    });

    it('should to "nil" from false', () => {
      expect(stringify(false)).to.be('nil');
    });
  });

  describe('object', () => {
    it('should to "nil" from null', () => {
      expect(stringify(null)).to.be('nil');
    });

    it('should to be symbol name', () => {
      expect(stringify(intern('a'))).to.be(intern('a').toString());
    });

    it('should to be cons cell', () => {
      expect(stringify({ car: 1, cdr: 2 })).to.be('(1 . 2)');
    });

    it('should to be null from empty', () => {
      expect(stringify([])).to.be('nil');
    });

    it('should be number list from number array', () => {
      expect(stringify([1, 2, 3])).to.be('(1 2 3)');
    });

    it('should be nested list', () => {
      expect(stringify([1, [2, 3], 4, 5])).to.be('(1 (2 3) 4 5)');
    });

    it('should be string list from string array', () => {
      expect(stringify(["a", "b", "c"])).to.be('("a" "b" "c")');
    });

    it('should be mixed list from mixed array', () => {
      expect(stringify([1, "abcde", intern('hoge')])).to.be('(1 "abcde" hoge)');
    });

    it('should be alist from object', () => {
      expect(stringify({ a: 1, b: 2 }, 'alist')).to.be('(("a" . 1) ("b" . 2))');
    });

    it('should be symbol from object', () => {
      expect(stringify({ name: 'hoge' })).to.be('hoge');
    });

    it('should specify keyword list from object', () => {
      expect(stringify({ a: 1, b: 2 })).to.be('(:a 1 :b 2)');
    });

    it('should alist from object nested', () => {
      expect(stringify([1, { hoge: 1, fuga: 2 }, "aaa"], 'alist')).to
      .be('(1 (("hoge" . 1) ("fuga" . 2)) "aaa")');
    });

    it('should specify keyword list from object nested', () => {
      expect(stringify([1, { hoge: 1, fuga: 2 }, "aaa"])).to
      .be('(1 (:hoge 1 :fuga 2) "aaa")');
    });
  });
});