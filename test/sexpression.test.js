var util = require('util')
  , expect = require('expect.js')
  , Sexpression = require('../')
  , Symbol = Sexpression.Symbol;

describe('Sexpression', function() {
  describe('.intern()', function() {
    it('should have name property', function() {
      expect(Symbol.intern('hoge')).to.have.property('name');
    });

    it('should initialize name property', function() {
      expect(Symbol.intern('hoge').name).to.equal('hoge');
    });

    it('should equal same name symbol', function() {
      expect(Symbol.intern('hoge')).to.be(Symbol.intern('hoge'));
    });

    it('should instanceof Symbol', function() {
      expect(Symbol.intern('abc')).to.be.a(Symbol.intern('hoge').constructor);
    });
  });

  describe('.parse()', function() {
    describe('Number literal', function() {
      it('should be 1 digit number', function() {
        expect(Sexpression.parse('1')).to.be(1);
      });

      it('should be multiple digit number', function() {
        expect(Sexpression.parse('392038029380')).to.be(392038029380);
      });

      it('should be number of minutes', function() {
        expect(Sexpression.parse('-124')).to.be(-124);
      });

      it('should be decimal number', function() {
        expect(Sexpression.parse('10.309')).to.be(10.309);
      });
    });

    describe('String literal', function() {
      it('should be blank string', function() {
        expect(Sexpression.parse('""')).to.be('');
      });

      it('should be string', function() {
        expect(Sexpression.parse('"hogehoge"')).to.be('hogehoge');
        expect(Sexpression.parse('"aaa bbb cccc ()())) -**x&&789"')).to.be("aaa bbb cccc ()())) -**x&&789");
      });

      it('should be multi byte string', function() {
        expect(Sexpression.parse('"あいうえお熊"')).to.be('あいうえお熊');
      });

      it('should be \\n', function() {
        expect(Sexpression.parse('"\n"')).to.be('\n');
      });

      it('should be \\t', function() {
        expect(Sexpression.parse('"\t"')).to.be('\t');
      });
    });

    describe('Symbol literal', function() {
      it('should allow alphabet', function() {
        expect(Sexpression.parse('a')).to.be(Symbol.intern('a'));
        expect(Sexpression.parse('hoge')).to.be(Symbol.intern('hoge'));
      });

      it('should end before white space', function() {
        expect(Sexpression.parse('cat dog')).to.be(Symbol.intern('cat'));
      });

      it('should end before double quote', function() {
        expect(Sexpression.parse('cat"dog')).to.be(Symbol.intern('cat'));
      });

      it('should end before single quote', function() {
        expect(Sexpression.parse("cat'dog")).to.be(Symbol.intern('cat'));
      });

      it('should end before back quote', function() {
        expect(Sexpression.parse("cat`dog")).to.be(Symbol.intern('cat'));
      });

      it('should escpae backslahed white space', function() {
        expect(Sexpression.parse('aaa\\ bbb')).to.be(Symbol.intern('aaa bbb'));
      });

      it('should escape backslashed double quote', function() {
        expect(Sexpression.parse('aaa\\"bbb')).to.be(Symbol.intern('aaa"bbb'));
      });

      it('should escape backslashed single quote', function() {
        expect(Sexpression.parse("aaa\\'bbb")).to.be(Symbol.intern("aaa'bbb"));
      });

      it('should escape backslashed back quote', function() {
        expect(Sexpression.parse("aaa\\`bbb")).to.be(Symbol.intern("aaa`bbb"));
      });
    });

    describe('List literal', function() {
      it('should be empty array', function() {
        var subject = Sexpression.parse('()');
        expect(subject).to.be.an('array');
        expect(subject).to.be.empty();
      });

      it('should be number array', function() {
        var subject = Sexpression.parse('(1)')
        expect(subject).to.be.an('array');
        expect(subject).to.have.length(1);
        expect(subject[0]).to.be(1);
      });

      it('should be multiple number array', function() {
        var subject = Sexpression.parse('(100 200)');
        expect(subject).to.be.an('array');
        expect(subject).to.have.length(2);
        expect(subject[0]).to.be(100);
        expect(subject[1]).to.be(200);
      });

      it('should be symbol array', function() {
        var subject = Sexpression.parse('(cat dog lemon water sparkling)');
        expect(subject).to.be.an('array');
        expect(subject).to.have.length(5);
      });
    });
  });
});