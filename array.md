+ 数组去重的方法 reset --amend --111 --hotfix --fix111
```
Array.prototype.unique= function(){
  let uniqueArr=this.filter(function(item,index,arr){
    return item.indexOf(arr) === index;
  })
  return uniqueArr;
}
```

+ 寻找数组中的第一个质数
```
function isPrime(item){
  let start= 2;
  while(start <= Math.sqrt(item)){
    if(item % start++ <1){
      return false;
    }
  }
  return item > 1;
}

[1,3,4,5].find(isPrime);
```

+ 数组的扁平化
```
const flattern= function(arr){
  return arr.reduce(function(acc,value){
    return acc.concat(Array.isArray(value) ?  flattern(value) : value);
  },[])
}
```

+ 方法
Array.from(arrayLike[,mapFn[,thisArg]])  //mapFn是map函数，thisArg指this的指向
```
Array.from([1,2,3],x => x+x)
```
Array.of(ele1[,element2]) //创建一个具有可变数量参数的新数组实例

array.copyWithin(target,statrt,end) 浅复制数组的一部分到同一数组中的另一位置，不改变大小
```
[2,3,4].copyWithin(0,1,2)
```
