const Category = require('../models/category');
const Product=require('../models/product')
const Order=require('../models/order')

/*  query operator*/

exports.Query=(req,res,next)=>{

  //eq (equal)
  //ne (not equal)
  //gt (greater than)
  //gte (grater than or equal)
  //lt (less than)
  //in
  //nin

  //starts with
  //.find({name:/^Samsung/})
  //end with
  //.find({name:/Samsung$/})
  //contains
//.find({name:/.*Samsung.*/})

  Product
  //.find({price:{$eq:100}})
  //.find({price:{$ne:100}})
  //.find({price:{$gt:100}})
  //.find({price:{$gte:100}})
  //.find({price:{$in:[100,200]}})
  //.find({price:{$gte:1000,$lte:2000}}) //1000,2000 arası kaytılar
  //.find()
  //.or([{price:{$gt:100},name:'Veysel'}])
  .find({price:{$eq:100}})
  .then((products)=>{})
  .catch((err)=>{
    console.log(err);
});
}

exports.getIndex=async (req,res,next)=>{

  //cookie bilgisine erişme
  //console.log(req.cookies.isAuthenticated);

  ///console.log(req.session.isAuthenticated);
  
  const categories=await Category.find();
  Product.find()
  .then((products)=>{

    res.render('shop/index',
    {
      title:'Shopping',
      'path':'/',
      products:products,
      categories:categories
    })
  }).catch((err)=>{
    next(err)
  });
  
}

exports.getProducts=async (req,res,next)=>{

  const categories=await Category.find();
  Product.find()
  .then((products)=>{
    res.render('shop/products',
    {
      title:'Products',
      'path':'/products',
      products:products,
      categories:categories
    })
  }).catch((err)=>{
    next(err)
  });
  
}

exports.getProduct=(req,res,next)=>{

  Product.findById(req.params.productId)
  .then(product=>{
    res.render('shop/product-detail',
        {
          title:product.name,
          'path':'/products',
          product:product
        })
  }).catch(err=>{
    next(err)
  })

}

exports.getProductsByCategoryId=async (req,res,next)=>{

  //1.yöntem
  const categoryId=req.params.categoryId;
  const model=[];

  Category.find()
  .then(categories=>{
    model.categories=categories
  
    return Product.find({
      categories:categoryId
    })
  }).then(products=>{
    res.render('shop/products',
    {
      title:'Products',
      'path':'/products',
      products:products,
      categories:model.categories,
      selectedCategory:categoryId
    })
  }).catch(err=>{
    next(err)
  })

}

exports.getCart=async (req,res,next)=>{

  req.user
  .populate('cart.items.productId')
  .then(user=>{
    
        const products=user.cart.items.map(product=>{
        
          return {
              productId:product.productId._id,
              name:product.productId.name,
              price:product.productId.price,
              image:product.productId.image,
              quantity:product.quantity
          }
      });

        res.render('shop/cart',{
          title:'Cart',
          'path':'/cart',
          products:products
        })
    })
  .catch(err=>{ next(err)})
}

exports.postCart=(req,res,next)=>{

  console.log(222222222222);
  const productId=req.body.productId;

  console.log(productId);

  Product.findById(productId)
    .then(product=>{
      return req.user.addToCart(product)
    })
    .then(()=>{
      res.redirect('/cart')
    })
    .catch(err=>{ next(err)})
}

exports.postCartItemDelete=(req,res,next)=>{

  const productId=req.body.productId

 req.user.deleteCartItem(productId)
    .then(result=>{
     res.redirect('/cart')
    })
    .catch(err=>{
      next(err)
    })
}

exports.getOrders=(req,res,next)=>{

  Order
  .find({'user.userId':req.user._id})
  .then(orders=>{
    res.render('shop/orders',
      {
        title:'Orders',
        'path':'/orders',
        orders:orders
      })
  })
  .catch(err=>{ next(err)})
}

exports.postOrder=(req,res,next)=>{

  req.user
  .populate('cart.items.productId')
  .then(user=>{
    
        const products=user.cart.items.map(product=>{
        
          return {
            product:product.productId.toObject(),
            productId:product.productId._id,
            name:product.productId.name,
            price:product.productId.price,
            image:product.productId.image,
            quantity:product.quantity
          }
      });

      const order=new Order({
        user:{
          userId:user._id,
          name:user.name,
          email:user.email
        },
        items:products
      })

    return  order.save();

  })
  .then(()=>{

   return req.user.clearCart();
  })
  .then(()=>{

    res.redirect('/orders')
  })
  .catch(err=>{ next(err)})

}