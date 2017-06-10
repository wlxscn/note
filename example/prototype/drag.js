function Drag(elem) {
  this.target = elem;
  //鼠标初始位置
  this.startX= 0;
  this.startY= 0;

  // target初始位置
  this.sourceX= 0;
  this.sourceY= 0;

  this.init ();
}

Drag.prototype= {
  constructor: Drag,
  init() {
     this.target.onmousedown= this.start.bind(this);
  },
  start(event) {
    this.startX = event.pageX;
    this.startY = event.pageY;

    // 获取元素的初始位置
    let pos = this.getPosition(this.target);
    this.sourceX = pos.x;
    this.sourceY = pos.y;

    document.onmousemove= this.move.bind(this);
    document.onmouseup= this.end.bind(this);
  },
  move(event) {
    let currentX = event.pageX;
    let currentY = event.pageY;

    let distanceX = currentX - this.startX;
    let distanceY = currentY - this.startY;

    this.setTargetPos(this.target, {
      x: this.sourceX + distanceX,
      y: this.sourceY + distanceY
    })
  },
  end(event) {
    document.onmousemove= null;
    document.onmouseup= null;
  },
  setTargetPos(elem, pos) {
      var transform = this.getTransform();
      if(transform) {
          elem.style[transform] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
      } else {
          elem.style.left = pos.x + 'px';
          elem.style.top = pos.y + 'px';
      }
      return elem;
  },
  getTransform() {
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
  },
  getEleStyle (ele, prop) {
    return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(ele, false)[prop] : ele.currentStyle[prop];
  },
  getPosition () {
    var position= {
      x: 0,
      y: 0
    }
    const transform = this.getTransform();
    if(transform){
      var transformValue = this.getEleStyle(this.target, transform);
      if (transformValue === 'none'){
        this.target.style[transform]= 'translate(0 , 0)';
        return position;
      } else {
        var temp = transformValue.match(/[0-9,\s\.]+/)[0].split(',');
        return {
          x: parseInt(temp[4].trim()),
          y: parseInt(temp[5].trim())
        }
      }
    }else{
      if(getEleStyle (this.target, position) === 'static') {
        this.target.style.position = 'relative';
        return position;
      } else {
        const x = parseInt( getEleStyle(this.target, 'left') ? getEleStyle(this.target, 'left') : 0 );
        const y = parseInt( getEleStyle(this.target, 'top') ? getEleStyle(this.target, 'top') : 0 );
        return {x , y};
      }
    }
  }
}
