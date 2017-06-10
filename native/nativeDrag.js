// 获取当前浏览器支持的transform兼容写法
function getTransform() {
    var transform = '',
        divStyle = document.createElement('div').style,
        // 可能涉及到的几种兼容性写法，通过循环找出浏览器识别的那一个
        transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],

        i = 0,
        len = transformArr.length;

    for(; i < len; i++)  {
        if(transformArr[i] in divStyle) {//判断tranform属性是否在style对象中
            // 找到之后立即返回，结束函数
            return transform = transformArr[i];
        }
    }

    // 如果没有找到，就直接返回空字符串
    return transform;
}

//处理获取元素属性的兼容性问题
function getEleStyle (ele, prop) {
  return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(ele, false)[prop] : ele.currentStyle[prop];
}

//获取元素的位置
function getPosition (ele) {
  var position = {
    x: 0,
    y: 0
  }
  const transform = getTransform();
  if(transform){
    var transformValue = getEleStyle(ele, transform);
    if (transformValue === 'none'){
      ele.style[transform]= 'translate(0 , 0)';
      return position;
    } else {
      var temp = transformValue.match(/[0-9,\s\.]+/)[0].split(',');
      return {
        x: parseInt(temp[4].trim()),
        y: parseInt(temp[5].trim())
      }
    }
  }else{
    if(getEleStyle (ele, position) === 'static') {
      ele.style.position = 'relative';
      return position;
    } else {
      const x = parseInt( getEleStyle(ele, 'left') ? getEleStyle(ele, 'left') : 0 );
      const y = parseInt( getEleStyle(ele, 'top') ? getEleStyle(ele, 'top') : 0 );
      return {x , y};
    }
  }
}

//给元素设置位置
function setTargetPos(elem, pos) {
    var transform = getTransform();
    if(transform) {
        elem.style[transform] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
    } else {
        elem.style.left = pos.x + 'px';
        elem.style.top = pos.y + 'px';
    }
    return elem;
}

// 添加监听事件
function addEventListen(elem, type, handler){
  elem.addEventListener ? elem.addEventListener(type, handler , false) : elem.attachEvent(`on${type}`,handler);
}

// 去除监听事件
function removeListen(elem, type ,handler) {
  elem.removeEventListener ? elem.removeEventListener(type, handler , false) : elem.detachEvent(`on${type}`,handler);
}
