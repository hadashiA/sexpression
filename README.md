## Usage

```javascript
var sexpression = require('sexpression');
```

```javascript
sexpression.parse('()')               //=> null
sexpression.parse('(1 -2 3.45)')      //=> [1, -2, 3.45]
sexpression.parse('(a b c)')          //=> [{ name: 'a' }, { name: 'b' }, { name: 'c' }]
sexpression.parse('(a b (1 2) "a")')  //=> [{ name: 'a' }, { name: 'b' }, [1, 2], 'a']

sexpression.parse('(1 . 2)')
//=> { car: 1, cdr: 2 }
sexpression.parse('((hoge . 1) (fuga . 2))')
//=> [{ car: { name: 'hoge'}, cdr: 1}, { car: { name: 'fuga' }, cdr: 2 }]
```

```javascript
sexpression.generate([]);           //=> null
sexpression.generate([1, -2, 3.45]) //=> '(1 -2 3.45)'
sexpression.generate([{ name: 'a' }, { name: 'b' }, [1, 2], 'a']) //=> '(a b (1 2) "a")'

sexpression.generate({ car: 1, cdr: 2})  //=> '(1 . 2)'
sexpression.generate([{ car: { name: 'hoge'}, cdr: 1}, { car: { name: 'fuga' }, cdr: 2 }])
//=> '((hoge . 1) (fuga . 2))'

sexpression.generaet({ a: 1, b: 2})                    //=> '(("a" . 1) ("b" . 2))'
sexpression.generate([1, { hoge: 1, fuga: 2 }, "aaa"]) //=> '(1 (('hoge' . 1) ('fuga' . 2)) 'aaa')'
```

```javascript
sexpression.generaet({ a: 1, b: 2}, 'keylist')                     //=> '(:a 1 :b 2)'
sexpression.generate([1, { hoge: 1, fuga: 2 }, "aaa"], 'keylist')  //=> '(1 (:hoge 1 :fuga 2) "aaa")'
```

