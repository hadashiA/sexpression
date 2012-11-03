var expect = require('expect.js')
  , Sexpression = require('../');

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

    describe.only('Symbol literal', function() {
      it('should allow alphabet', function() {
        expect(Sexpression.parse('a')).to.be(Sexpression.intern('a'));
        expect(Sexpression.parse('hoge')).to.be(Sexpression.intern('hoge'));
      });

      it('should split white space', function() {
        expect(Sexpression.parse('cat dog')).to.be(Sexpression.intern('cat'));
      });
    });
  });
});