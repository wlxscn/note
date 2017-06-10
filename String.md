+ 转义字符
\0 空字符  \\反斜杠 \n换行 \r回车 \v垂直制表符 \t水平制表符 \uXXXX unicode码
\u{x}-\u{xxxxxx}unicode codepoint \xXX Lantin-1字符

+ 长字符串
多行字符串的拼接
  + 使用+将多个字符串连接起来
  ```
  let longString = "This is a very long string which needs " +
                 "to wrap across multiple lines because " +
                 "otherwise my code is unreadable.";
  ```
  + 使用反斜杠"\"，指示字符串在下一行继续。确保反斜杠后面没有空格或任何除换行符之外的字符或缩进，否则反斜杠将不起作用。

  + 基本字符串和字符串对象
  当使用eval时，基本字符串和字符串对象会产生不同的结果
  ```
  s1 = "2 + 2";               // creates a string primitive
  s2 = new String("2 + 2");   // creates a String object
  console.log(eval(s1));      // returns the number 4
  console.log(eval(s2));      // returns the string "2 + 2"
  ```       
  使用valueOf方法可以将字符串对象转为其对应的基本字符串
  ```
  console.log(eval(s2.valueOf())); // returns the number 4
  ```

  + 在String 上添加方法
  ```
  (function(){
    var methodsArray= ['substring','replace','split'];
    var pollyfill= function(methodName){
      var method= String.prototype[methodName];
      String[methodName]= function(context){
        return method.apply(context,[].slice.call(arguments,1))
      }
    }
    methodsArray.forEach(function(methodName){
      pollyfill(methodName);
    })
  }())
  ```
