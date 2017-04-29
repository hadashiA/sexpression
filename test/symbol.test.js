var expect = require('expect.js');
var Symbol = require('../lib/symbol');
var intern = Symbol.intern;

describe('Symbol', () => {
  describe('.intern()', () => {
    it('should have name property', () => {
      expect(intern('hoge')).to.have.property('name');
    });

    it('should initialize name property', () => {
      expect(intern('hoge').name).to.be('hoge');
    });

    it('should equal same name symbol', () => {
      expect(intern('hoge')).to.be(intern('hoge'));
    });

    it('should instanceof Symbol', () => {
      expect(intern('abc')).to.be.a(Symbol);
    });
  });
});

describe('symbol', () => {
  describe('.isKeyword()', () => {
    it('should be true for colon start name', () => {
      expect(intern(':abc').isKeyword()).to.be.ok();
    });

    it('should be false for not colon start name', () => {
      expect(intern('abc').isKeyword()).to.not.be.ok();
    });
  });

  describe('.keywordName()', () => {
    it('should be exclude colon name', () => {
      expect(intern(':unko').keywordName()).to.be('unko');
    });
  });
});