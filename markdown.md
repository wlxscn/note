### markdown语法学习

#### 代码区块
建立代码区块需要简单的缩进4个字符或是一个制表符就可以了，代码块前后需要有至少一个空行

这是一个普通段落。

    这是一个代码区块。
      代码区块

#### 区块引用
在区块前面加上>，最好是每行都加上
> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

#### 链接
链接都是用[]来标记
+ 行内式
在[]后面紧接着()，并且插入网址链接即可。如果还想加上链接的title文字，只要在网址后面用双引号把title文字包起来即可。

This is [an example](https://www.baidu.com// "title") inline link.

+ 参考式
在链接文字的[]后面接上另一个[],第二个方括号用来填入识别链接的标记。

This is [an example][baidu] reference-style link.

[baidu]: https://www.baidu.com/  "Optional Title Here"

> 隐式链接标记，可以省略指定链接标记，链接标记等同于链接文字
[Google][]
[Google]: http://google.com/

#### 强调
*em*

**em**

#### 代码
需要引用代码时，如果引用的语句只有一段，不分行，可以用 ` 将语句包起来。
如果引用的语句为多行，可以将```置于这段代码的首行和末行。

Use the `printf()` function.

``There is a literal backtick (`)`here.``

#### 图片
+ 行内式
![Alttext](http://img02.tooopen.com/images/20141231/sy_78327074576.jpg "风景")

+ 参考式
![风景][1]
[1]: http://img02.tooopen.com/images/20141231/sy_78327074576.jpg "风景"

#### 表格
+ 单元格和表头，使用|来分隔不同的单元格，使用-来分隔表头和其他行
name | age
---|---
LearnShare | 12
Mike | 32

+ 对齐 在表头下方的分隔线中加入:,即可标记下方单元格的对齐方式

| left | center | right |
| :--- | :----: | ----: |
| aaaa | bbbbbb | ccccc |
| a    | b      | c     |

#### 其他
+ 删除线

这就是 ~~删除线~~

+ 自动链接
 以比较简短的自动链接形式来处理网址和电子邮件信箱，只要是用尖括号包起来
<http://baidu.com>

+ 反斜杠
利用反斜杠来插入一些在语法中有其它意义的符号

\*literal asterisks\*
