var Cons = function(car, cdr) {
  this.car = (car == null ? null : car);
  this.cdr = (cdr == null ? null : cdr);
};

Cons.list = array => {
  if (array.length) {
    return new Cons(array[0], Cons.list(array.slice(1, array.length)));
  } else {
    return null;
  }
};

Cons.prototype.toString = function() {
  return "(" + this.car + " . " + this.cdr + ")";
};

Cons.prototype.forEach = function(callback) {
  var car = this.car;
  var cdr = this.cdr;
  var result = true;
  var i = 0;

  result = callback(car, i++);
  while (result !== false && cdr) {
    car = cdr.car
    cdr = cdr.cdr;
    result = callback(car, i++);
  }
};

Cons.prototype.size = function() {
  var car = this.car;
  var cdr = this.cdr;
  var i = 1;

  while (cdr) {
    car = cdr.car
    cdr = cdr.cdr;
    i++;
  }
  return i;
};

Cons.prototype.nth = Cons.prototype.at = function(index) {
  var result;
  this.forEach((v, i) => {
    if (index === i) {
      result = v;
      return false
    } else {
      return true;
    }
  });
  return result;
};

module.exports = Cons;
