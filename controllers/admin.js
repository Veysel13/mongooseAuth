const Product=require('../models/product')
const Category=require('../models/category')
const fs=require('fs')

exports.getProducts=(req,res,next)=>{
    
    Product.find({userId:req.user._id})
    .select({name:1,price:1,description:1,image:1})
    .populate('userId','name email -_id')
    .sort({name:1})
    .then((products)=>{
      res.render('admin/products',
      {
        title:'Admin Products',
        'path':'/admin/products',
        products:products,
        action:req.query.action??''
      })
    }).catch((err)=>{
        console.log(err);
    });
}

exports.getAddProduct=async (req,res,next)=>{
  console.log(2222);
  return res.render('admin/add-product',{title:'New Product',categories:[]})
}

exports.postAddProduct=(req,res,next)=>{

  if(!req.file){
   return res.render('admin/add-product',
      {
        title:'New Product',
      categories:[],
      errorMessage:'Resim zorunludur'
    })
  }
   
   const product= new Product({
    name:req.body.name,
    price:req.body.price,
    description:req.body.description,
    image:req.file.filename,
    userId:req.user,
    isActive:true
   })
  
  product.save()
  .then(()=>{
    res.redirect('/')
   })
   .catch(err=>{
   
    /*
    if(err.name=='ValidationError'){
      let message='';
      console.log(err.errors);
      for(field in err.errors){
        message+=err.errors[field].message+'<br>'
      }

      return res.status(500).render('admin/add-product',
        {
          title:'New Product',
        categories:[],
        errorMessage:message,
        inputs:req.body
      })
    }else{
       next(err)
    }*/

    next(err) //hata yönlendirme
   
   })
}

exports.getEditProduct=async (req,res,next)=>{

  Product.findById(req.params.productId)
 //.populate(categories)
 .then(product=>{

    if(!product){
      res.redirect('/admin/products?actionfindFalse')
    }

 Category.find()
 .then(categories=>{
   return categories=categories.map(category=>{

    if(product.categories){
      product.categories.find(item=>{
        if(item.toString()==category._id.toString()){
          category.selected=true
        }
      })
    }
      
      return category;
    })
  }).then(categories=>{
    res.render('admin/edit-product',
    {
      title:'Edit Product',
      'path':'/admin/products',
      product:product,
      categories:categories
    })
  }).catch(err=>{
    next(err)
  })

    
  }).catch(err=>{
    next(err)
  })
 

}

exports.postEditProduct=async (req,res,next)=>{

  Product.findOne({_id: req.body.id})
  .then(product=>{
    if(!product){
      return res.redirect('/admin/products')
    }

    product.name=req.body.name,
    product.price=req.body.price,
    product.description=req.body.description,
    product.categories=req.body.categoryIds

    if(req.file){
      fs.unlink('public/img/'+product.image,err=>{
        if(err){
          console.log(err);
        }
      })
      product.image=req.file.filename
    }

    return product.save();
  })
  .then(result=>{
    res.redirect('/admin/products?action=edit')
  })
  .catch(err=>{
    next(err)
  })

  /*
  const product={
    name:req.body.name,
    price:req.body.price,
    description:req.body.description,
    categories:req.body.categoryIds
  }

  if(req.file){
    product.image=req.file.filename
  }
  // req.body.categoryIds
  Product.update({_id: req.body.id,},{
    $set:product
  }).then(result=>{
    res.redirect('/admin/products?action=edit')
  }).catch(err=>{
    next(err)
  })

  */
    
}

exports.postDeleteProduct=async (req,res,next) => {
  
  Product.findOne({_id: req.body.id})
  .then(product=>{
    if(!product){
      return next(new Error('silinmek istenen ürün bulunaamadı'))
    }

    fs.unlink('public/img/'+product.image,err=>{
      if(err){
        console.log(err);
      }
    })

    return Product.deleteOne({_id: req.body.id});
  })
  .then(result=>{
    if(result.deletedCount===0){
      return next(new Error('silinmek istenen ürün bulunaamadı'))
    }
    res.redirect('/admin/products?action=delete')
  })
  .catch(err=>{
    next(err)
  })


  //yontem 2
   Product.deleteOne({_id:req.body.id})
   .then(()=>{
    res.redirect('/admin/products?action=delete')
   })
   .catch(err=>{
    next(err)
   });
}


//category

exports.getCategories=(req,res,next)=>{
    
  Category.find()
  .then((categories)=>{
    res.render('admin/categories',
    {
      title:'Admin Categories',
      'path':'/admin/categories',
      categories:categories,
      action:req.query.action??''
    })
  }).catch((err)=>{
    next(err)
  });
}

exports.getAddCategory=async (req,res,next)=>{

res.render('admin/add-category',{title:'New Product'})
  
}

exports.postAddCategory=async (req,res,next)=>{

 
 const category=new Category({name:req.body.name,description:req.body.description})

 await category.save()
.then((result)=>{
  res.redirect('/admin/categories')
 })
 .catch(err=>{
  next(err)
 })
}

exports.getEditCategory=async (req,res,next)=>{

  Category.findById(req.params.categoryId ).then(category=>{

    if(!category){
      res.redirect('/admin/categories?actionfindFalse')
    }

     res.render('admin/edit-category',
     {
       title:'Edit Category',
       'path':'/admin/categories',
       category:category
     })
    
  }).catch(err=>{
    next(err)
  })
 

}

exports.postEditCategory=async (req,res,next)=>{

  Category.updateOne({_id: req.body.id},{
    $set:{
      name:req.body.name,
      description:req.body.description
    }
  })
  .then(result=>{
      res.redirect('/admin/categories?action=edit')
    }).catch(err=>{
      next(err)
    })
}

exports.postDeleteCategory=async (req,res,next) => {
  
  Category.deleteOne({_id:req.body.id})
  .then(()=>{
   res.redirect('/admin/categories?action=delete')
  })
  .catch(err=>{
    next(err)
  });
}

