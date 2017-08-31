### 绘制形状 reset222
+ 渲染上下文（2D渲染上下文）
```
var canvas = document.getElementById('tutorial');
var ctx = canvas.getContext('2d');
```

+ 绘制矩形
fillRect(x,y,width,height)
strokeRect()
clearRect() //清除指定矩形区域，让清除部分完全透明

+ 绘制路径
beginPath
moveto  移动笔触
lineto  绘制直线
closePath
stroke 通过线条来绘制轮廓，描边路径不会自动闭合
fill 通过填充生成实心的图形，填充路径会自动闭合

+ 绘制圆弧
arc(x, y, radius, startAngle, endAngle, anticlockwise) anticlockwise为true表示逆时针，false表示顺时针
arcTo(x1, y1, x2, y2, radius)

+ 贝塞尔和二次贝塞尔
quadraticCurveTo(cp1x, cp1y, x, y)
绘制贝塞尔曲线,cp1x,cp1y为控制点，x,y为结束点

bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
绘制二次贝塞尔，两个控制点，一个结束点

+ Path2D对象
Path2D对象已可以在较新版本的浏览器中使用
```
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');

    var rectangle = new Path2D();
    rectangle.rect(10, 10, 50, 50);

    var circle = new Path2D();
    circle.moveTo(125, 35);
    circle.arc(100, 35, 25, 0, 2 * Math.PI);

    ctx.stroke(rectangle);
    ctx.fill(circle);
  }
}
```

使用SVG paths
```
var p = new Path2D("M10 10 h 80 v 80 h -80 Z");
```

### 添加样式和颜色
+ 颜色
fillStyle
strokeStyle
globalAlpha //设置全局的透明度，0表示完全透明，1表示完全不透明

+ 线型Line style
lineWidth 线条宽度
lineCap 线条末端样式
lineJoin 线条接合处的样式

+ 渐变 Gradients
createLinearGradient(x1, y1, x2, y2) 渐变的起点和终点坐标
createRadialGradient(x1, y1, r1, x2, y2, r2) 起点和终点圆的原点坐标和半径

```
var lineargradient = ctx.createLinearGradient(0,0,150,150);
lineargradient.addColorStop(0,'white');
lineargradient.addColorStop(1,'black')
```

+ 图案样式
createPattern(image, type)
```
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  // 创建新 image 对象，用作图案
  var img = new Image();
  img.src = 'images/wallpaper.png';
  img.onload = function(){

    // 创建图案
    var ptrn = ctx.createPattern(img,'repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(0,0,150,150);

  }
}
```

+ 阴影样式
shadowOffsetX
shadowOffsetY
shadowBlur
shadowColor
```
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

  ctx.font = "20px Times New Roman";
  ctx.fillStyle = "Black";
  ctx.fillText("Sample String", 5, 30);
}
```

+ 填充规则
可能的值 nonzero  evenodd
```
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.beginPath();
  ctx.arc(50, 50, 30, 0, Math.PI*2, true);
  ctx.arc(50, 50, 15, 0, Math.PI*2, true);
  ctx.fill("evenodd");
}
```

### 绘制文本
fillText(text,x,y[,maxWidth])
strokeText(text,x,y[,maxWidth])

+ 文本样式
font
textAlign
textBaseline
direction 文本方向：ltr rtl inherit

+ 文本测量
measureText() 返回一个TextMetrucs对象
```
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  var text = ctx.measureText("foo"); // TextMetrics object
  text.width; // 16;
}
```

### 绘制图片
+ 图片源的类型
HTMLImageElement  通过Image()构造函数 或者 img元素得到
HTMLVideoElement  通过video元素作为图片源，抓取当前帧作为一个图像
HTMLCanvasElement 使用另一个canvas元素作为图片源
ImageBitmap 一种高性能位图，可以低延迟绘制，可以从上面的源中生成

+  方法
drawImage(img,x,y,width,height)
```
function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    var img = new Image();
    img.onload = function(){
      ctx.drawImage(img,0,0);
      ctx.beginPath();
      ctx.moveTo(30,96);
      ctx.lineTo(70,66);
      ctx.lineTo(103,76);
      ctx.lineTo(170,15);
      ctx.stroke();
    }
    img.src = 'images/backdrop.png';
  }
```  
+ 切片slicing
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
第一个参数和其它的是相同的，都是一个图像或者另一个 canvas 的引用。其它8个参数最好是参照右边的图解，前4个是定义图像源的切片位置和大小，后4个则是定义切片的目标显示位置和大小。可以用来做图像合成。
```
function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  // Draw slice
  ctx.drawImage(document.getElementById('source'),
                33,71,104,124,21,20,87,104);

  // Draw frame
  ctx.drawImage(document.getElementById('frame'),0,0);
}
```

### 变形
+ save() restore() 方法
执行save 方法将当前的状态推送到到栈中保存。一个绘画状态包括：
 + 当前应用的变形（即移动，旋转和缩放，见下）
 + strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation 的值
 + 当前的裁切路径（clipping path），会在下一节介绍
调用restore方法将上一个保存的状态从栈中弹出来
```
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.fillRect(0,0,150,150);   // 使用默认设置绘制一个矩形
  ctx.save();                  // 保存默认状态

  ctx.fillStyle = '#09F'       // 在原有配置基础上对颜色做改变
  ctx.fillRect(15,15,120,120); // 使用新的设置绘制一个矩形

  ctx.save();                  // 保存当前状态
  ctx.fillStyle = '#FFF'       // 再次改变颜色配置
  ctx.globalAlpha = 0.5;    
  ctx.fillRect(30,30,90,90);   // 使用新的配置绘制一个矩形

  ctx.restore();               // 重新加载之前的颜色状态
  ctx.fillRect(45,45,60,60);   // 使用上一次的配置绘制一个矩形

  ctx.restore();               // 加载默认颜色配置
  ctx.fillRect(60,60,30,30);   // 使用加载的配置绘制一个矩形
}
```

+ translate方法
translate(x,y) x表示左右偏移量，y表示上下偏移量

+ rotate(angle)
顺时针旋转的角度
```
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.translate(75,75);

  for (var i=1;i<6;i++){ // Loop through rings (from inside to out)
    ctx.save();
    ctx.fillStyle = 'rgb('+(51*i)+','+(255-51*i)+',255)';

    for (var j=0;j<i*6;j++){ // draw individual dots
      ctx.rotate(Math.PI*2/(i*6));
      ctx.beginPath();
      ctx.arc(0,i*12.5,5,0,Math.PI*2,true);
      ctx.fill();
    }

    ctx.restore();
  }
}
```
+ 缩放scale
scale(x,y)
x,y分别为横轴和纵轴的缩放因子

+ 变形transforms
transform(m11, m12, m21, m22, dx, dy) 将当前的变形矩阵乘上一个基于自身参数的矩阵
m11：水平方向的缩放

m12：水平方向的偏移

m21：竖直方向的偏移

m22：竖直方向的缩放

dx：水平方向的移动

dy：竖直方向的移动
setTransform(m11, m12, m21, m22, dx, dy)取消当前的变形，设置为指定的变形
resetTransform()相当于调用ctx.setTransform(1, 0, 0, 1, 0, 0);

### 合成与裁剪
globalCompositeOperation 用来指定合成的类型

clip() 裁剪方法
```
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillRect(0,0,150,150);
  ctx.translate(75,75);

  // Create a circular clipping path
  ctx.beginPath();
  ctx.arc(0,0,60,0,Math.PI*2,true);
  ctx.clip();

  // draw background
  var lingrad = ctx.createLinearGradient(0,-75,0,75);
  lingrad.addColorStop(0, '#232256');
  lingrad.addColorStop(1, '#143778');

  ctx.fillStyle = lingrad;
  ctx.fillRect(-75,-75,150,150);

  // draw stars
  for (var j=1;j<50;j++){
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.translate(75-Math.floor(Math.random()*150),
                  75-Math.floor(Math.random()*150));
    drawStar(ctx,Math.floor(Math.random()*4)+2);
    ctx.restore();
  }

}
function drawStar(ctx,r){
  ctx.save();
  ctx.beginPath()
  ctx.moveTo(r,0);
  for (var i=0;i<9;i++){
    ctx.rotate(Math.PI/5);
    if(i%2 == 0) {
      ctx.lineTo((r/0.525731)*0.200811,0);
    } else {
      ctx.lineTo(r,0);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
```
