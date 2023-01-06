module.exports=(req,res,next)=>{

    res.locals.csrfToken=req.csrfToken()
    res.locals.isAuthenticated=req.session.isAuthenticated
    res.locals.isAdmin=req.user ? req.user.isAdmin:false

    res.locals.errorMessage=req.session.errorMessage || false
    delete req.session.errorMessage

    res.locals.successMessage=req.session.successMessage || false
    delete req.session.successMessage

    next()
}