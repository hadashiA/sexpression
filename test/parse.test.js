var util        = require('util')
  , expect      = require('expect.js')
  , sexpression = require('../')
  , Cons        = sexpression.Cons
  , intern      = sexpression.intern;

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

    it('should be "t" to true', function() {
      expect(sexpression.parse('t')).to.be(true);
    });

    it('should be "nil" to null', function() {
      expect(sexpression.parse('nil')).to.be(null);
    });
  });

  describe('List literal', function() {
    it('should be empty array', function() {
      expect(sexpression.parse('()')).to.be(null);
    });

    it('should be number array', function() {
      var subject = sexpression.parse('(1)');
      expect(subject).to.be.a(Cons);
      expect(subject.car).to.be(1);
      expect(subject.cdr).to.be(null);
    });

    it('should be multiple number array', function() {
      var subject = sexpression.parse('(100 200)');
      expect(subject).to.be.a(Cons);
      expect(subject.nth(0)).to.be(100);
      expect(subject.nth(1)).to.be(200);
    });

    it('should be symbol array', function() {
      var subject = sexpression.parse('(cat dog lemon)');
      expect(subject).to.be.a(Cons);
      expect(subject.nth(0)).to.be(intern('cat'));
      expect(subject.nth(1)).to.be(intern('dog'));
      expect(subject.nth(2)).to.be(intern('lemon'));
    });

    it('should be string array', function() {
      var subject = sexpression.parse('("ヤ" "ヤメ" "ヤメロー")');
      expect(subject).to.be.a(Cons);
      expect(subject.nth(0)).to.be("ヤ");
      expect(subject.nth(1)).to.be("ヤメ");
      expect(subject.nth(2)).to.be("ヤメロー");
    });

    it('should be mixed array', function() {
      var subject = sexpression.parse('("ヤメロー" 1 hogemogu "とりゃー")');
      expect(subject).to.be.a(Cons);
      expect(subject.nth(0)).to.be("ヤメロー");
      expect(subject.nth(1)).to.be(1);
      expect(subject.nth(2)).to.be(intern('hogemogu'));
      expect(subject.nth(3)).to.be('とりゃー');
    });

    it('should be nested array', function() {
      var subject = sexpression.parse('(1 2 (3 4) 5)');
      expect(subject).to.be.a(Cons);
      expect(subject.nth(0)).to.be(1);
      expect(subject.nth(1)).to.be(2);
      expect(subject.nth(2)).to.be.a(Cons);
      expect(subject.nth(2).nth(0)).to.be(3);
      expect(subject.nth(2).nth(1)).to.be(4);
      expect(subject.nth(3)).to.be(5);
    });

    // it('should be cons cell', function() {
    //   var subject = sexpression.parse('(hoge . fuga)');
    //   expect(subject).to.be.a(Cons);
    //   expect(subject.car).to.be(intern('hoge'));
    //   expect(subject.cdr).to.be(intern('fuga'));
    // });

    // it('should ignore name "." symbol', function() {
    //   expect(sexpression.parse('(. b)')).to.be(intern('b'));
    // });
  });
});
