const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost/nodeApp',{
    useNewUrlParser:true,useUnifiedTopology:true
})
.then(()=>{console.log('bağlandı')})
.catch(()=>{console.log('bağlantı hatası')})