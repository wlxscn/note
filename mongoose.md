### mongoose

#### mongoose使用模式
+ Schema

```
var numberSchema = new mongoose.Schema({
    integerOnly: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    }
});
```

+ model

```
var numberModel = mongoose.model('Number', numberSchema);
```

+ Entity

```
var doc = new numberModel();

doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 5.001;
doc.integerOnly; // 3
doc.i; // 3

doc.save(function (err) {
    console.log('save')
})
```
