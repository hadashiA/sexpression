var expect      = require('expect.js')
  , sexpression = require('../')
  , parse       = sexpression.parse
  , intern      = sexpression.intern;

describe('parse()', function() {
  describe('number literal', function() {
    it('should be 1 digit number', function() {
      expect(parse('1')).to.be(1);
    });

    it('should be multiple digit number', function() {
      expect(parse('392038029380')).to.be(392038029380);
    });

    it('should be number of minutes', function() {
      expect(parse('-124')).to.be(-124);
    });

    it('should be decimal number', function() {
      expect(parse('10.309')).to.be(10.309);
    });

    it('should be decimal number of minutes', function() {
      expect(parse('-900.2456')).to.be(-900.2456);
    });
  });

  describe('string literal', function() {
    it('should be blank string', function() {
      expect(parse('""')).to.be('');
    });

    it('should be string', function() {
      expect(parse('"hogehoge"')).to.be('hogehoge');
      expect(parse('"aaa bbb cccc ()())) -**x&&789"')).to.be("aaa bbb cccc ()())) -**x&&789");
    });

    it('should be multi byte string', function() {
      expect(parse('"あいうえお熊"')).to.be('あいうえお熊');
    });

    it('should be \\n', function() {
      expect(parse('"\n"')).to.be('\n');
    });

    it('should be \\t', function() {
      expect(parse('"\t"')).to.be('\t');
    });
  });

  describe('symbol literal', function() {
    it('should allow alphabet', function() {
      expect(parse('a')).to.be(intern('a'));
      expect(parse('hoge')).to.be(intern('hoge'));
    });

    it('should end before white space', function() {
      expect(parse('cat dog')).to.be(intern('cat'));
    });

    it('should end before double quote', function() {
      expect(parse('cat"dog')).to.be(intern('cat'));
    });

    it('should end before single quote', function() {
      expect(parse("cat'dog")).to.be(intern('cat'));
    });

    it('should end before back quote', function() {
      expect(parse("cat`dog")).to.be(intern('cat'));
    });

    it('should escpae backslahed white space', function() {
      expect(parse('aaa\\ bbb')).to.be(intern('aaa bbb'));
    });

    it('should escape backslashed double quote', function() {
      expect(parse('aaa\\"bbb')).to.be(intern('aaa"bbb'));
    });

    it('should escape backslashed single quote', function() {
      expect(parse("aaa\\'bbb")).to.be(intern("aaa'bbb"));
    });

    it('should escape backslashed back quote', function() {
      expect(parse("aaa\\`bbb")).to.be(intern("aaa`bbb"));
    });

    it('should be "t" to true', function() {
      expect(parse('t')).to.be(true);
    });

    it('should be "nil" to null', function() {
      expect(parse('nil')).to.be(null);
    });
  });

  describe('list literal', function() {
    it('should be empty array', function() {
      expect(parse('()')).to.be(null);
    });

    it('should be number array', function() {
      expect(parse('(1)')).to.eql([1]);
    });

    it('should be multiple number array', function() {
      expect(parse('(100 200)')).to.eql([100, 200]);
    });

    it('should be symbol array', function() {
      expect(parse('(cat dog lemon)')).to
      .eql([intern('cat'), intern('dog'), intern('lemon')]);
    });

    it('should be string array', function() {
      expect(parse('("ヤ" "ヤメ" "ヤメロー")')).to.eql(['ヤ', 'ヤメ', 'ヤメロー']);
    });

    it('should be mixed array', function() {
      expect(parse('("ヤメロー" 1 hogemogu "とりゃー")')).to
      .eql(['ヤメロー', 1, intern('hogemogu'), 'とりゃー']);
    });

    it('should be nested array', function() {
      expect(parse('(1 2 (3 4) 5)')).to.eql([1, 2, [3, 4], 5]);
    });

    it('should be cons cell', function() {
      expect(parse('(hoge . fuga)')).to.eql({ car: intern('hoge'),
                                              cdr: intern('fuga') });
    });

    it('should ignore name "." symbol', function() {
      expect(parse('(. b)')).to.be(intern('b'));
    });

    it('should error if cons after value', function() {
      expect(function() { parse('(a . b c)') }).throwException();
    });

    it('should error if cons cdr not found', function() {
      expect(function() { parse('(a . )') }).throwException();
    });

    it('should parse "." symbol', function() {
      expect(parse('(.)')).to.eql([intern('.')]);
      expect(parse('(a .)')).to.eql([intern('a'), intern('.')]);
    });

    it('should be contains of cons cell list', function() {
      expect(parse('(a b . c)')).to.eql([intern('a'), { car: intern('b'),
                                                        cdr: intern('c') }]);
    });

    it('should be alist', function() {
      expect(parse('((a . b) (c . d))')).to.eql([{ car: intern('a'), cdr: intern('b') },
                                                 { car: intern('c'), cdr: intern('d') }]);
    });

    it('should be object from keylist', function() {
      expect(parse('(:a 1 :b 2)')).to.eql({ a: 1, b: 2 });
    });

    it('should null value object from break keylist', function() {
      expect(parse('(:a)')).to.eql({ a: null });
    });

    it('should be inner object array from keylist contans list', function() {
      expect(parse('(a b :hoge 1 :fuga 2 c)')).to.eql([ intern('a')
                                                      , intern('b')
                                                      , { hoge: 1, fuga: 2 }
                                                      , intern('c')]);
    });

    it('should be separate \\n', function() {
      expect(parse('(1\n2)')).to.eql([1, 2]);
    });

    it('should be separate \\t', function() {
      expect(parse('(1\t2)')).to.eql([1, 2]);
    });

    it('should be nested 1 length list', function() {
      expect(parse('((1))')).to.eql([[1]]);
    });
  });
});