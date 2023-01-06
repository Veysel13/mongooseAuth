const express=require('express')
const router=express.Router();
const shopController=require('../controllers/shop')

const authentication=require('../midleware/authentication')
const locals=require('../midleware/locals')

router.get('/',[locals],shopController.getIndex)

router.get('/products',[locals],shopController.getProducts)

router.get('/products/:productId',[locals],shopController.getProduct)

router.get('/categories/:categoryId',[locals],shopController.getProductsByCategoryId)

router.get('/cart',[locals,authentication],shopController.getCart)

router.post('/cart',[locals,authentication],shopController.postCart)

router.post('/delete-cartItem',[locals,authentication],shopController.postCartItemDelete)

router.get('/orders',[locals,authentication],shopController.getOrders)

router.post('/create-order',[locals,authentication],shopController.postOrder)

module.exports=router;
