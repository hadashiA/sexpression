var util        = require('util')
  , expect      = require('expect.js')
  , sexpression = require('../')
  , Symbol      = sexpression.Symbol
  , Cons        = sexpression.Cons
  , intern      = Symbol.intern;

describe('sexpression', function() {
  describe('Symbol.intern()', function() {
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

  describe('.parse()', function() {
    describe('Number literal', function() {
      it('should be 1 digit number', function() {
        expect(sexpression.parse('1')).to.be(1);
      });

      it('should be multiple digit number', function() {
        expect(sexpression.parse('392038029380')).to.be(392038029380);
      });

      it('should be number of minutes', function() {
        expect(sexpression.parse('-124')).to.be(-124);
      });

      it('should be decimal number', function() {
        expect(sexpression.parse('10.309')).to.be(10.309);
      });

      it('should be decimal number of minutes', function() {
        expect(sexpression.parse('-900.2456')).to.be(-900.2456);
      });
    });

    describe('String literal', function() {
      it('should be blank string', function() {
        expect(sexpression.parse('""')).to.be('');
      });

      it('should be string', function() {
        expect(sexpression.parse('"hogehoge"')).to.be('hogehoge');
        expect(sexpression.parse('"aaa bbb cccc ()())) -**x&&789"')).to.be("aaa bbb cccc ()())) -**x&&789");
      });

      it('should be multi byte string', function() {
        expect(sexpression.parse('"あいうえお熊"')).to.be('あいうえお熊');
      });

      it('should be \\n', function() {
        expect(sexpression.parse('"\n"')).to.be('\n');
      });

      it('should be \\t', function() {
        expect(sexpression.parse('"\t"')).to.be('\t');
      });
    });

    describe('Symbol literal', function() {
      it('should allow alphabet', function() {
        expect(sexpression.parse('a')).to.be(intern('a'));
        expect(sexpression.parse('hoge')).to.be(intern('hoge'));
      });

      it('should end before white space', function() {
        expect(sexpression.parse('cat dog')).to.be(intern('cat'));
      });

      it('should end before double quote', function() {
        expect(sexpression.parse('cat"dog')).to.be(intern('cat'));
      });

      it('should end before single quote', function() {
        expect(sexpression.parse("cat'dog")).to.be(intern('cat'));
      });

      it('should end before back quote', function() {
        expect(sexpression.parse("cat`dog")).to.be(intern('cat'));
      });

      it('should escpae backslahed white space', function() {
        expect(sexpression.parse('aaa\\ bbb')).to.be(intern('aaa bbb'));
      });

      it('should escape backslashed double quote', function() {
        expect(sexpression.parse('aaa\\"bbb')).to.be(intern('aaa"bbb'));
      });

      it('should escape backslashed single quote', function() {
        expect(sexpression.parse("aaa\\'bbb")).to.be(intern("aaa'bbb"));
      });

      it('should escape backslashed back quote', function() {
        expect(sexpression.parse("aaa\\`bbb")).to.be(intern("aaa`bbb"));
      });
    });

    describe('List literal', function() {
      it('should be empty array', function() {
        expect(sexpression.parse('()')).to.eql([]);
      });

      it('should be number array', function() {
        expect(sexpression.parse('(1)')).to.eql([1]);
      });

      it('should be multiple number array', function() {
        expect(sexpression.parse('(100 200)')).to.eql([100, 200]);
      });

      it('should be symbol array', function() {
        expect(sexpression.parse('(cat dog lemon)')).to.
          eql([ intern('cat'), intern('dog'), intern('lemon')]);
      });

      it('should be string array', function() {
        expect(sexpression.parse('("ヤ" "ヤメ" "ヤメロー")')).to.eql(["ヤ", "ヤメ", "ヤメロー"]);
      });

      it('should be mixed array', function() {
        expect(sexpression.parse('("ヤメロー" 1 hogemogu "とりゃー")')).to
        .eql(["ヤメロー", 1, intern('hogemogu'), "とりゃー"]);
      });

      it('should be nested array', function() {
        expect(sexpression.parse('(1 2 (3 4) 5)')).to.eql([1, 2, [3, 4], 5]);
      });

      // it('should be cons cell', function() {
      //   expect(sexpression.parse('(hoge . fuga)')).to.be.a(Cons);
      // });

      // it('should ignore name "." symbol', function() {
      //   expect(sexpression.parse('(. b)')).to.eql([intern('b')]);
      // });
    });
  });
});