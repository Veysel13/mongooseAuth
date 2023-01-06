const connection=require('./database')

connection.execute('select * from products')
    .then((result)=>{
        console.log(result[0]);
    }).catch((err)=>{
        console.log(err);
    })