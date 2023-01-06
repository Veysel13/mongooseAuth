const express=require('express')
const app=express()

//formdan gelen bilgileri parse etmeye yarıyor
const bodyParser=require('body-parser')
const librariesMulter=require('./libraries/multer')

const path=require('path')
const cookieParser=require('cookie-parser')
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session)

//csrf protection
const csurf=require('csurf')

const adminRoutes=require('./routes/admin')
const userRoutes=require('./routes/shop')
const accountRoutes=require('./routes/account')
const errorController=require('./controllers/errors')


app.set('view engine','pug')
app.set('views','./views')

//sessionlaron mongo db de saklamak için
var store = new MongoDBStore({
    uri: 'mongodb://localhost/nodeApp',
    collection: 'mySessions'
  });

app.use(bodyParser.urlencoded({extended:false}))
app.use(librariesMulter)

//cookie
app.use(cookieParser())

//session
//*sessionlar memeory üzerinde saklanır  bu bir süre sonra problem yaratabilir.
//db üzerinde saklanabilir alternatif olarak
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    store:store,
    saveUninitialized: false, //her kullanıc için session oluşur.boş sessioon oluşur
    //cookie: { path: '/', httpOnly: true, secure: false, maxAge: 1000*60*60*24*7 }
  }))

//dosyaları dışarı erişke açma
app.use(express.static(path.join(__dirname,'./public')))

//middleware
const User=require('./models/user')
app.use((req,res,next)=>{
    
    if(!req.session.user){
        return next();
    }

    User.findById(req.session.user._id)
    .then(user=>{
        req.user=user
        next()
    })
    .catch(err=>{

    }) 
})

//csrf protection
app.use(csurf())

//routes
app.use('/admin',adminRoutes)
app.use(userRoutes)
app.use(accountRoutes)


//hata yönetimi
app.use('/500',errorController.get500Page)
app.use(errorController.get404Page)
app.use((error,req,res,next)=>{
  res.status(500).render('error/500',{title:'Error'})
})

require('./utility/database')

app.listen(3000);
