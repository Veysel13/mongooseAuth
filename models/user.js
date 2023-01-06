const Product=require('./product')
const mongoose=require('mongoose')
const {isEmail}=require('validator')

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        //validate:[isEmail,'invalid email'],
        validate:{
            validator:(value)=>{
                return isEmail(value)
            },
            message:'invalid email'
        }
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetExpiration:Date,
    isAdmin:{
        type:Boolean,
        default:false
    },
    cart:{
        items:[{
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }]
    }
})

UserSchema.methods.getCart=function(){
  
    const ids=this.cart.items.map(i=>{
        return i.productId;
    })

    return Product
            .find({_id:{$in:ids}})
            .then(products=>{
                return products.map(product=>{
                    return {
                        productId:product._id,
                        name:product.name,
                        price:product.price,
                        image:product.image,
                        quantity:this.cart.items.find(i=>{
                        return i.productId.toString()==product._id.toString()
                        }).quantity
                    }
                });
            })
            .catch(err=>{
                console.log(err)
            })
}


UserSchema.methods.addToCart=function(product){
    const index=this.cart.items.findIndex(cp=>{
        return cp.productId.toString()==product._id.toString()
    })
    const updatedCartItems=[...this.cart.items]

    let itemQuantity=1;
    if(index>=0){
        itemQuantity=this.cart.items[index].quantity+1
        updatedCartItems[index].quantity=itemQuantity
    }else{
        updatedCartItems.push({
            productId:product._id,
            quantity:itemQuantity
        })
    }

    this.cart={
        items:updatedCartItems
    }

    return this.save();
}

UserSchema.methods.deleteCartItem=function(productId){
    const cartItems=this.cart.items.filter(item=>{
        return item.productId.toString()!=productId
    })

    this.cart={
        items:cartItems
    }

    return this.save();
}

UserSchema.methods.clearCart=function(){
    
    this.cart={
        items:[]
    }

    return this.save();
}

module.exports=mongoose.model('User',UserSchema)

