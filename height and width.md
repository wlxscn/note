## window相关的height和width

## document相关的height和width

### 与client相关的
clientWidth和clientHeight 指的是元素可视部分的宽度和高度，即padding+content
没有滚动条就是元素设定的宽度和高度，有滚动条滚动条会覆盖元素的宽高，那么该属性等于本来的宽高减去滚动条的宽高。（mac系统默认情况滚动条不显示，不占宽高）

clientLeft和clientTop 指的是元素周围边框的厚度，如果不指定边框或者不定位该元素，值为0

### 与offset相关的
offsetWidth和offsetHeight 指的是元素的border+padding+content的宽度和高度
与其内部的内容是否超过元素大小无关，只和本来设定的border,width,height,padding有关

offsetLeft和offsetTop
offsetParent
1. 如果当前元素的父级元素没有进行css定位（absolute,relative）,offsetParent为body
2. 父级元素中有定位,offsetParent取最近的那个父级元素

IE6/IE7中
offsetLeft= (offsetParent的padding-left)+(当前元素的margin-left)

IE8/9/10以及chrome中
offsetLeft= (offsetParent的padding-left+border-width+margin-left)+当前元素的margin-left

FireFox中
offsetLeft= (offsetParent的margin-left+padding-left)+当前元素的margin-left

### 与scroll相关的
scrollWidth和scrollHeight

document.body的scrollHeight和scrollWidth
给定的高度小于浏览器的窗口，scrollHeight和scrollWidth返回的是浏览器的宽高
给定宽高大于浏览器窗口，并且内容的宽高小于给定宽高，scrollHeight和scrollWidth返回给定宽高+margin+padding+border
给定宽高大于浏览器窗口，并且内容的宽高大于给定宽高，scrollHeight和scrollWidth等于内容的宽高+一边的margin+padding+border

div的scrollWidth和scrollHeight
无滚动条的情况下
scrollWidth==clientWidth

有滚动条情况下：
scrollWidth= 实际内容宽度+ 2*padding

scrollLeft和scrollTop

>documentElement和body的关系说明：
 documentElement是 html，body是它的子元素，
 body= document.documentElement.childNodes[2];

    <div class="footer">
      &copy; 2004 Foo Corporation
    </div>
