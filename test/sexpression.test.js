var expect = require('expect.js')
  , Sexpression = require('../')
  , util = require('util');

describe('Sexpression', function() {
  describe('.intern()', function() {
    it('should have name property', function() {
      expect(Sexpression.intern('hoge')).to.have.property('name');
    });

    it('should initialize name property', function() {
      expect(Sexpression.intern('hoge').name).to.equal('hoge');
    });

    it('should equal same name symbol', function() {
      expect(Sexpression.intern('hoge')).to.be(Sexpression.intern('hoge'));
    });

    it('should instanceof Symbol', function() {
      expect(Sexpression.intern('abc')).to.be.a(Sexpression.intern('hoge').constructor);
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
        expect(Sexpression.parse('a')).to.be(Sexpression.intern('a'));
        expect(Sexpression.parse('hoge')).to.be(Sexpression.intern('hoge'));
      });

      it('should end before white space', function() {
        expect(Sexpression.parse('cat dog')).to.be(Sexpression.intern('cat'));
      });

      it('should end before double quote', function() {
        expect(Sexpression.parse('cat"dog')).to.be(Sexpression.intern('cat'));
      });

      it('should end before single quote', function() {
        expect(Sexpression.parse("cat'dog")).to.be(Sexpression.intern('cat'));
      });

      it('should end before back quote', function() {
        expect(Sexpression.parse("cat`dog")).to.be(Sexpression.intern('cat'));
      });

      it('should escpae backslahed white space', function() {
        expect(Sexpression.parse('aaa\\ bbb')).to.be(Sexpression.intern('aaa bbb'));
      });

      it('should escape backslashed double quote', function() {
        expect(Sexpression.parse('aaa\\"bbb')).to.be(Sexpression.intern('aaa"bbb'));
      });

      it('should escape backslashed single quote', function() {
        expect(Sexpression.parse("aaa\\'bbb")).to.be(Sexpression.intern("aaa'bbb"));
      });

      it('should escape backslashed back quote', function() {
        expect(Sexpression.parse("aaa\\`bbb")).to.be(Sexpression.intern("aaa`bbb"));
      });
    });

    describe.only('List literal', function() {
      it('should be empty array', function() {
        expect(Sexpression.parse('()')).to.be.an('array');
        expect(Sexpression.parse('()')).to.be.empty();
      });
    });
  });
});