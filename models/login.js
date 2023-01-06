const mongoose=require('mongoose')
const {isEmail}=require('validator')

const LoginSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        validate:[isEmail,'hatalı eposta']
    },
    password:{
        type:String,
        required:[true,'paralo girmelisiniz']
    }
})

module.exports=mongoose.model('Login',LoginSchema)

