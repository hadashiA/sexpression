var expect      = require('expect.js');
var sexpression = require('../');
var parse       = sexpression.parse;
var intern      = sexpression.intern;

describe('parse()', () => {
  describe('number literal', () => {
    it('should be 1 digit number', () => {
      expect(parse('1')).to.be(1);
    });

    it('should be multiple digit number', () => {
      expect(parse('392038029380')).to.be(392038029380);
    });

    it('should be number of minutes', () => {
      expect(parse('-124')).to.be(-124);
    });

    it('should be decimal number', () => {
      expect(parse('10.309')).to.be(10.309);
    });

    it('should be decimal number of minutes', () => {
      expect(parse('-900.2456')).to.be(-900.2456);
    });
  });

  describe('string literal', () => {
    it('should be blank string', () => {
      expect(parse('""')).to.be('');
    });

    it('should be string', () => {
      expect(parse('"hogehoge"')).to.be('hogehoge');
      expect(parse('"aaa bbb cccc ()())) -**x&&789"')).to.be("aaa bbb cccc ()())) -**x&&789");
    });

    it('should be multi byte string', () => {
      expect(parse('"あいうえお熊"')).to.be('あいうえお熊');
    });

    it('should be \\n', () => {
      expect(parse('"\n"')).to.be('\n');
    });

    it('should be \\t', () => {
      expect(parse('"\t"')).to.be('\t');
    });
  });

  describe('symbol literal', () => {
    it('should allow alphabet', () => {
      expect(parse('a')).to.be(intern('a'));
      expect(parse('hoge')).to.be(intern('hoge'));
    });

    it('should end before white space', () => {
      expect(parse('cat dog')).to.be(intern('cat'));
    });

    it('should end before double quote', () => {
      expect(parse('cat"dog')).to.be(intern('cat'));
    });

    it('should end before single quote', () => {
      expect(parse("cat'dog")).to.be(intern('cat'));
    });

    it('should end before back quote', () => {
      expect(parse("cat`dog")).to.be(intern('cat'));
    });

    it('should escpae backslahed white space', () => {
      expect(parse('aaa\\ bbb')).to.be(intern('aaa bbb'));
    });

    it('should escape backslashed double quote', () => {
      expect(parse('aaa\\"bbb')).to.be(intern('aaa"bbb'));
    });

    it('should escape backslashed single quote', () => {
      expect(parse("aaa\\'bbb")).to.be(intern("aaa'bbb"));
    });

    it('should escape backslashed back quote', () => {
      expect(parse("aaa\\`bbb")).to.be(intern("aaa`bbb"));
    });

    it('should be "t" to true', () => {
      expect(parse('t')).to.be(true);
    });

    it('should be "nil" to null', () => {
      expect(parse('nil')).to.be(null);
    });
  });

  describe('list literal', () => {
    it('should be empty array', () => {
      expect(parse('()')).to.be(null);
    });

    it('should be number array', () => {
      expect(parse('(1)')).to.eql([1]);
    });

    it('should be multiple number array', () => {
      expect(parse('(100 200)')).to.eql([100, 200]);
    });

    it('should be symbol array', () => {
      expect(parse('(cat dog lemon)')).to
      .eql([intern('cat'), intern('dog'), intern('lemon')]);
    });

    it('should be string array', () => {
      expect(parse('("ヤ" "ヤメ" "ヤメロー")')).to.eql(['ヤ', 'ヤメ', 'ヤメロー']);
    });

    it('should be mixed array', () => {
      expect(parse('("ヤメロー" 1 hogemogu "とりゃー")')).to
      .eql(['ヤメロー', 1, intern('hogemogu'), 'とりゃー']);
    });

    it('should be nested array', () => {
      expect(parse('(1 2 (3 4) 5)')).to.eql([1, 2, [3, 4], 5]);
    });

    it('should be cons cell', () => {
      expect(parse('(hoge . fuga)')).to.eql({ car: intern('hoge'),
                                              cdr: intern('fuga') });
    });

    it('should ignore name "." symbol', () => {
      expect(parse('(. b)')).to.be(intern('b'));
    });

    it('should error if cons after value', () => {
      expect(() => { parse('(a . b c)') }).throwException();
    });

    it('should error if cons cdr not found', () => {
      expect(() => { parse('(a . )') }).throwException();
    });

    it('should parse "." symbol', () => {
      expect(parse('(.)')).to.eql([intern('.')]);
      expect(parse('(a .)')).to.eql([intern('a'), intern('.')]);
    });

    it('should be contains of cons cell list', () => {
      expect(parse('(a b . c)')).to.eql([intern('a'), { car: intern('b'),
                                                        cdr: intern('c') }]);
    });

    it('should be alist', () => {
      expect(parse('((a . b) (c . d))')).to.eql([{ car: intern('a'), cdr: intern('b') },
                                                 { car: intern('c'), cdr: intern('d') }]);
    });

    it('should be object from keylist', () => {
      expect(parse('(:a 1 :b 2)')).to.eql({ a: 1, b: 2 });
    });

    it('should null value object from break keylist', () => {
      expect(parse('(:a)')).to.eql({ a: null });
    });

    it('should be inner object array from keylist contans list', () => {
      expect(parse('(a b :hoge 1 :fuga 2 c)')).to.eql([ intern('a')
                                                      , intern('b')
                                                      , { hoge: 1, fuga: 2 }
                                                      , intern('c')]);
    });

    it('should be separate \\n', () => {
      expect(parse('(1\n2)')).to.eql([1, 2]);
    });

    it('should be separate \\t', () => {
      expect(parse('(1\t2)')).to.eql([1, 2]);
    });

    it('should be nested 1 length list', () => {
      expect(parse('((1))')).to.eql([[1]]);
      expect(parse('((a))')).to.eql([[{ name: 'a' }]]);

      expect(parse('(((((1)))))')).to.eql([[[[[1]]]]]);
      expect(parse('(((((a)))))')).to.eql([[[[[{ name: 'a' }]]]]]);
    });
  });
});