+ \在字符中会被当成转义符，不会显示出来,单独存在会报错，所以使用new RegExp("pattern")的时候需要对\进行转义。字符中要表示\，必须是'\\'来表示

+ 在换行之前加上反斜线以转义换行，这样反斜线和换行都不会出现在字符串的值中。
  ```
  var str = "this string \
  is broken \
  across multiple\
  lines."
  console.log(str);   // this string is broken across multiplelines.
  ```

+ ?匹配前面的表达式0次或者一次。等价于{0,1}
  如果紧跟在任何量词的后面(+,?,*,{}),会使量词变为非贪婪模式（默认为贪婪模式）
  对于‘123abc’,/\d+/将会匹配123,
  /\d+?/将会匹配1

+ .匹配除换行符之外的任何单个字符

+ （X）匹配X项，并且记住匹配项，称为捕获括号
  /(foo)(bar)\1\2/将会匹配"foobarfoobar",\1,\2,\n用在匹配环节，$1,$2,$n用在替换环节

+ (?:X) 匹配X项，但不记住匹配项，称为非捕获括号

+ X(?=y) 匹配X仅仅当X后面紧跟y，才会匹配，正向肯定查找
  /Jack(?=Spart)/，会匹配到Jack仅仅当它后面跟着Spart

+ X(?!) 匹配X，仅仅当X后面不紧跟y,才会匹配，正向否定查找  

+ [xyz] 一个字符合集，对于(.,*)这样的特殊符号也没有特殊的意义。

+ [^xyz] 一个反向字符集
+ \b单词边界,\B非单词边界（匹配一个前后字符都是相同类型的位置）  
+ 将用户输入转义为正则表达式中的一个字面字符串, 可以通过简单的替换来实现：
  ```
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$&");
    //$&表示整个被匹配的字符串
  }
  ```
+ 使用正则表达式的方法
  + RegExp的方法
    + exec(执行查找匹配)，返回一个数组，未匹配到则返回null
    + 测试是否匹配，返回true或false
  + String的方法
    + match（查找匹配），返回一个数组或null
    + search(返回匹配到的位置索引，失败则会返回-1)
    + replace     
    + split

+ 正则表达式执行返回的信息
```
var myRe = new RegExp("d(b+)d", "g");
var myArray = myRe.exec("cdbbdbsbz");
```
myArray: 匹配到的字符串和所有被记住的子字符串，index属性表示匹配到字符串在输入字符串中的位置，input属性表示初始化字符串
myRe: lastInex属性下一个匹配的索引值，source属性表示正则表达式模式文本

+ 使用括号的子字符串匹配
```
var reg= /(\w+)\s(\w+)/;
var str= "john smith";
str.replace(reg,"$2,$1");
```
