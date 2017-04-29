var expect = require('expect.js');
var Cons   = require('../lib/cons');
var list = Cons.list;

describe('Cons', () => {
  describe('.list()', () => {
    it('should to null from empty array', () => {
      expect(list([])).to.be(null);
    });

    it('should to single cons cell', () => {
      expect(list([1])).to.be.a(Cons);
      expect(list([1]).car).to.be(1);
      expect(list([1]).cdr).to.be(null);
    });

    it('should to linked cons cell', () => {
      var subject = list([1, 2]);
      expect(subject).to.be.a(Cons);
      expect(subject.car).to.be(1);
      expect(subject.cdr).to.be.a(Cons);
      expect(subject.cdr.car).to.be(2);
      expect(subject.cdr.cdr).to.be(null);
    });

    it('should parse size', () => {
      var subject = list([1, 2, 3, 4, 5]);
      expect(subject.size()).to.be(5);
    });

    it('should to be loop', () => {
      var subject = ["a", "b", "c"];
      list(subject).forEach((v, i) => {
        expect(v).to.be(subject[i]);
      });
    });
  });
});
