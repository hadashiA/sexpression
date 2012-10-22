var expect = require('expect.js')
  , Sexpression = require('../');

describe('Sexpression', function() {
  describe('.parse', function() {
    it('should parse 1 digit number', function() {
      expect(Sexpression.parse('1')).to.be(1);
    });

    it('should parse multiple digit number', function() {
      expect(Sexpression.parse('392038029380')).to.be(392038029380);
    });

    it('should parse number of minutes', function() {
      expect(Sexpression.parse('-124')).to.be(-124);
    });

    it('should parse decimal number', function() {
      expect(Sexpression.parse('10.309')).to.be(10.309);
    });
  });
});
