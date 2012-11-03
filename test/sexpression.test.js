var expect = require('expect.js')
  , Sexpression = require('../');

describe('Sexpression', function() {
  describe.only('.intern()', function() {
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

    describe('Symbol literal', function() {
      it('should allow alphabet', function() {
        expect(Sexpression.parse('a')).to.be('a');
        expect(Sexpression.parse('abc')).to.be('abc');
        expect(Sexpression.parse('A')).to.be('A');
        expect(Sexpression.parse('DFA')).to.be('DFA');
      });

      it('should invalid for "." only', function() {
        expect(function() { Sexpression.parse('.') }).to.throwError();
      });

      it('should invalid for backquote', function() {
        expect(function() { Sexpression.parse('`') }).to.throwError();
      });

      it('should invalid for backquote included', function() {
        expect(function() { Sexpression.parse('aaa`aaa') }).to.throwError();
      });
    });

    // describe('List literal', function() {
    //   it.only('should be empty array', function() {
    //     expect([]).to.be([]);
    //     // expect(Sexpression.parse('()')).to.be([]);
    //   });
    // });
  });
});