const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'ürün ismi zorunludur'],
        minlength:[5,'min 5 karakter'],
        maxlength:[199,'max 199 karakter'],
        lowercase:true,
       // uppercase:true,
        trim:true
    },
    price:{
        type:Number,
        required:function(){
            return this.isActive
        },
        min:0,
        max:10000,
        get:value=>Math.round(value),//10.22 -> 10,
        set:value=>Math.round(value),//10.22 -> 10,
        //enum:['telefon','bilgisayar']
    },
    description:{
        type:String,
        minlength:10,
    },
    image:String,
    date:{
        type:Date,
        default:Date.now
    },
    isActive:Boolean,
    // tags:{
    //     type:Array,
    //     validate:{
    //         validator:(value)=>{
    //             return value && value.length>0
    //         },
    //         message:'Ürün için en az bir etiket giriniz'
    //     }
    // },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    categories:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:false
        }
    ]
})

module.exports=mongoose.model('Product',productSchema)

