const express=require('express')
const router=express.Router();
const adminController=require('../controllers/admin')

const authentication=require('../midleware/authentication')
const isAdmin=require('../midleware/isAdmin')
const locals=require('../midleware/locals')

router.get('/products',[locals,authentication,isAdmin],adminController.getProducts)

router.get('/add-product',[locals,authentication,isAdmin],adminController.getAddProduct)

router.post('/add-product',[locals,authentication,isAdmin],authentication,adminController.postAddProduct)

router.get('/products/:productId',[locals,authentication,isAdmin],adminController.getEditProduct)

router.post('/products',[locals,authentication,isAdmin],authentication,adminController.postEditProduct)

router.post('/delete-product',[locals,authentication,isAdmin],authentication,adminController.postDeleteProduct)

//category

router.get('/categories',[locals,authentication,isAdmin],adminController.getCategories)

router.get('/add-category',[locals,authentication,isAdmin],adminController.getAddCategory)

router.post('/add-category',[locals,authentication,isAdmin],authentication,adminController.postAddCategory)

router.get('/categories/:categoryId',[locals,authentication,isAdmin],adminController.getEditCategory)

router.post('/categories',[locals,authentication,isAdmin],authentication,adminController.postEditCategory)

router.post('/delete-category',[locals,authentication,isAdmin],authentication,adminController.postDeleteCategory)

module.exports=router