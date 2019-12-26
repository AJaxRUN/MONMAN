module.exports.myhandle = function(app, path){

    app.get('/',function(req,res){
        res.render('login');
        var date = new Date();
        console.log("Login page:"+date);
    });
    //app.post();
}
module.exports.myhandl = function(app){

    app.get('/w/:gag',function(req,res){
        res.render('welcomepage',{a : req.params.gag});
        console.log("hii");
    });
    //app.post();
}