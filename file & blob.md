## File
File 对象是特殊类型的 Blob，且可以用在任意的 Blob 类型的 context 中。比如说， FileReader, URL.createObjectURL(), createImageBitmap(), 及 XMLHttpRequest.send() 都能处理 Blob  和 File。

+ constructor
File()

+ 属性
  lastModified
  lastModifiedDate
  name
  size
  webkitRelativePath
  type

+ 方法继承了Blob 接口的方法

## Blob
 一个 Blob对象表示一个不可变的, 原始数据的类似文件对象。Blob表示的数据不一定是一个JavaScript原生格式。 File 接口基于Blob，继承 blob功能并将其扩展为支持用户系统上的文件。

 + constructor
 Blob(bolbParts[,options])

 + 属性
 isClosed
 size
 type

 + 方法
 close()
 slice([start[, end[, contentType]]])


 // 会产生一个类似blob:d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
 // 你可以像使用一个普通URL那样使用它，比如用在img.src上。

 ```
  var typedArray = GetTheTypedArraySomehow();
  var blob = new Blob([typedArray], {type: "application/octet-binary"});
  var url = URL.createObjectURL(blob);
```

+ 从Blod中提取数据
```
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   // reader.result contains the contents of blob as a typed array
});
reader.readAsArrayBuffer(blob);
```
