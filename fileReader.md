### FileReader允许web应用程序异步读取存储在用户计算机上的文件的内容，使用File或Blod对象指定要读取的文件或数据

*其中File对象可以是来自用户在一个input元素上选择文件后返回的FileList对象,也可以来自拖放操作生成的 DataTransfer对象,还可以是来自在一个HTMLCanvasElement上执行mozGetAsFile()方法后返回结果.*

+ 方法
void abort()
void readAsArrayBuffer()
void readAsBinaryString()
void readAsDataURL()

+ 状态常量
EMPTY 0 还没加载任何数据
LOADING 1 数据加载中
DONE 2 已完成全部的读取请求

+ 属性
error 读取文件发生的错误
readyState FileReader对象的当前状态，为状态常量中的一个
result 读取到文件内容，文件格式取决于读取操作的发起方式
