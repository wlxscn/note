+ mocha (自动化测试库)
+ chai (断言库)

### 测试的书写:

```
var assert = require('chai').assert;
describe("string#split", function () {
  it("should return an array", function () {
    assert(Array.isArray('a,b,c'.split(',')));
  });
  it('should return the same array', function () {
    assert.equal(['a', 'b', 'c'].length, 'a,b,c'.split(',').length, 'arrays have equal lenght');
    for (var i = 0; i < ['a', 'b', 'c'].length; i++) {
      assert.equal(['a', 'b', 'c'][i], 'a,b,c'.split(',')[i], i + 'element is equal');
    }
  })
});
```
测试用例由describe组成,describe由it组成。

```
mocha --compilers js:babel-core/register  --recursive
// mocha有很多配置参数，这里的compilers表示测试前用babel对其进行编译，因为我的reducer用了ES6语法。
// --recursive表示级联测试，会搜索并执行本目录下所有的测试
```
