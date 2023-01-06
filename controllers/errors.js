exports.get404Page=(req,res)=>{
    res.status(404)
    //res.send('<h1>Page not found</h1>')
    //res.sendFile(path.join(__dirname,'views','404.html'))
    res.render('error/404',{title:'page not found'})
}

exports.get500Page=(req,res)=>{
    res.status(500)
    res.render('error/500',{title:'Server Error'})
}