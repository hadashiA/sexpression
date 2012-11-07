var expect = require('expect.js')
  , Symbol = require('../lib/symbol')
  , intern = Symbol.intern;

describe('Symbol', function() {
  describe('.intern()', function() {
    it('should have name property', function() {
      expect(intern('hoge')).to.have.property('name');
    });

    it('should initialize name property', function() {
      expect(intern('hoge').name).to.be('hoge');
    });

    it('should equal same name symbol', function() {
      expect(intern('hoge')).to.be(intern('hoge'));
    });

    it('should instanceof Symbol', function() {
      expect(intern('abc')).to.be.a(Symbol);
    });
  });
});

describe('symbol', function() {
  describe('.isKeyword()', function() {
    it('should be true for colon start name', function() {
      expect(intern(':abc').isKeyword()).to.be.ok();
    });

    it('should be false for not colon start name', function() {
      expect(intern('abc').isKeyword()).to.not.be.ok();
    });
  });

  describe('.keywordName()', function() {
    it('should be exclude colon name', function() {
      expect(intern(':unko').keywordName()).to.be('unko');
    });
  });
});