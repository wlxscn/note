+ \u表示16进制表示法

+ javascript的字符以utf-16的形式存储，每个字符固定为两个字节

+ ES5  String的方法:（不能正确处理四个字节的字符）
   charCodeAt(获取位置上的字符码点),charAt(获取位置上的字符),fromCharCode(用于返回码点对应字符)

+ ES6 String的方法：
   + codePointAt
    ```
      var s = '𠮷a';
      s.codePointAt(0) // 134071
      s.codePointAt(1) // 57271
      s.codePointAt(2) // 97
    ```
    要取到对应位置字符的编码的解决办法
    ```
    for(let ch of s){
      console.log(ch.codePointAt(0).toString(16))
    }
    ```
   + fromCodePoint(跟codePointAt功能相反，有多个参数会被合并成一个字符串返回)
    ```
    String.fromCodePoint(0x20BB7)
    // "𠮷"
    String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
    // true
    ```
   + for....of...(字符串的遍历,可以识别大于0XFFFF码点的字符)

    ```
    var text = String.fromCodePoint(0x20BB7);
    for (let i = 0; i < text.length; i++) {
      console.log(text[i]);
    }
    for (let i of text) {
      console.log(i);
    }

    ```
   + at方法（可以识别返回编码大于0XFFFF的字符）
   ```
   'abc'.at(0) // "a"
   '𠮷'.at(0) // "𠮷"
   ```
   + normalize(Unicode正规化的方法，将字符的不同表示方法统一为同样的形式）
   + includes,startsWith,endsWith,支持两个参数（第一个是搜索的字符，第二个参数n，在endsWith中表示针对前n个字符，在其他两个方法中表示从第n个字符到字符串结束）
