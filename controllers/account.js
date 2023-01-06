const User=require('../models/user')
const Login=require('../models/login')
const bcrypt=require('bcrypt')
const sgMail = require('@sendgrid/mail')
const crypto=require('crypto')

sgMail.setApiKey('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')

exports.getLogin=(req,res,next)=>{

    res.render('account/login',{
        path:'/login',
        title:'Login'
    })
}

exports.postLogin=(req,res,next)=>{

    const email=req.body.email
    const password=req.body.password

    const loginModel=new Login({
        email:email,
        password:password
    })

    loginModel
    .validate()
    .then(result=>{
        User.findOne({email:email})
        .then(user=>{

            if(!user){
                req.session.errorMessage='Mail adresi kayıtlı değil'
                req.session.save((err)=>{
                    return res.redirect('/login')
                });
            }

            bcrypt.compare(password,user.password)
            .then(isSuccess=>{ 
                if(isSuccess){

                    req.session.user=user
                    req.session.isAuthenticated=true

                    return req.session.save(function(err){
                        const url=req.session.redirectTo || '/'
                        delete req.session.redirectTo
                        res.redirect(url)
                    })
                }

                req.session.errorMessage='şifre hatalı'
                req.session.save((err)=>{
                    return res.redirect('/login')
                });
            })
            .catch((err)=>{console.log(err)})
        })
        .catch((err)=>{console.log(err)})
    })
    .catch(err=>{
        if(err.name=='ValidationError'){
            let message='';
            console.log(err.errors);
            for(field in err.errors){
              message+=err.errors[field].message+'<br>'
            }
      
            return res.status(500).render('account/login',
              {
                title:'Login',
                path:'/login',
                errorMessage:message,
                inputs:req.body
            })
          }else{
            next(err)
          }
    });

    // if(true){
    //     //cookie
    //     //res.cookie('isAuthenticated',true)

    //     req.session.isAuthenticated=true

    //     res.redirect('/')
    // }else{
    //     res.redirect('/login')
    // }
}


exports.getRegister=(req,res,next)=>{

    res.render('account/register',{
        path:'/register',
        title:'Register'
    })
}

exports.postRegister=async (req,res,next)=>{

    const password=await bcrypt.hash(req.body.password,10)

    User.findOne({email:req.body.email})
    .then(user=>{

        if(user){
            req.session.errorMessage='Mail adresi kayıtlı'
         
            return res.redirect('/register')
        }

        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            password:password,
            cart:{items:[]}
        });

        return newUser.save();
    })
    .then((user)=>{
        
        res.redirect('/login')

         const msg = {
             to: req.body.email, // Change to your recipient
             from: 'veyselakpinar13@gmail.com', // Change to your verified sender
             subject: 'Kullanıcı kayıt maili',
             //text: 'kayıt işlemi başarılı',
             html: '<h1>kayıt işlemi başarılı</h1><br><a href="http://127.0.0.1:3000/"><strong>Devam ediniz</strong></a>',
           }

           sgMail.send(msg);

    })
    .catch((err)=>{
        if(err.name=='ValidationError'){
            let message='';
            console.log(err.errors);
            for(field in err.errors){
              message+=err.errors[field].message+'<br>'
            }
      
            return res.status(500).render('account/register',
              {
                title:'Register',
                path:'/register',
                errorMessage:message,
                inputs:req.body
            })
          }else{
            next(err)
          }
    })

    
}


exports.getReset=(req,res,next)=>{

    res.render('account/reset',{
        path:'/reset-passward',
        title:'Reset Password'
    })
}

exports.postReset=(req,res,next)=>{

    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            res.redirect('/reset-password') 
        }

        const token=buffer.toString('hex')

        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.session.errorMessage='Kullanıcı bulunamadı'
         
                return res.redirect('/reset-password')
            }

            user.resetToken=token;
            user.resetExpiration=Date.now()+3600000
            return user.save();
        })
        .then(result=>{
            res.redirect('/login')

            const msg = {
                to: req.body.email, // Change to your recipient
                from: 'veyselakpinar13@gmail.com', // Change to your verified sender
                subject: 'Şifre Sıfırlama',
                //text: 'kayıt işlemi başarılı',
                html: `
                    <p>linke tıklayınıx</p>
                    <p><a href="http://127.0.0.1:3000/reset-password/${token}">Şifre Sıfırla</a></p>
                `,
              }
   
              sgMail.send(msg);
        })
        .catch(err=>{
            next(err)
        })
    })
    
}

exports.getNewPassword=(req,res,next)=>{

    const token=req.params.token;

    User.findOne({
        resetToken:token,
        resetExpiration:{$gt:Date.now()}
    })
    .then(user=>{
        if(!user){
            req.session.errorMessage='Kullanıcı bulunamadı'
        
            return res.redirect('/reset-password')
        }

        res.render('account/new-password',{
            path:'/new-passward',
            title:'New Password',
            userId:user._id.toString(),
            passwordToken:token
        })
    })
    .catch(err=>{
        next(err)
    })
   
}

exports.postNewPassword=async (req,res,next)=>{

    const password=await bcrypt.hash(req.body.password,10)
    const userId=req.body.userId
    const passwordToken=req.body.passwordToken

   User.findOne({
        _id:userId,
        resetToken:passwordToken,
        resetExpiration:{$gt:Date.now()}
    })
    .then(user=>{
        if(!user){
            req.session.errorMessage='Kullanıcı bulunamadı'
        
            return res.redirect('/new-password')
        }

        user.password=password;
        user.resetToken=null;
        user.resetExpiration=null;

        user.save()
    })
    .then(result=>{
        req.session.successMessage='Şifre Değiştirildi'
        
        return res.redirect('/login')
    })
    .catch(err=>{
        next(err)
    })
   
}

exports.logout=(req,res,next)=>{

    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/login')
    })
   
}