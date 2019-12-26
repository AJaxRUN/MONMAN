module.exports.loginPage = function(app, path){

    app.get('/',function(req,res){
        res.render('login');
        var date = new Date();
        console.log("Login page:"+date);
    });
    //app.post();
}

module.exports.folioPage = function(app) {
    app.get('/folio', function(req,res) {
        var date = new Date();
        console.log("Folio page:"+date);
        res.render('folio', {name: "Ramachandran C S"});
        // if(valid == true)
        //     res.render('folio');
        // else
        //     res.render
    });
}

module.exports.detailsPage = function(app) {
    app.get('/details', function(req,res) {
        var date = new Date();
        console.log("Details page:"+date);
        res.render('details', {name: "Arjun C R"});
        // if(valid == true)
        //     res.render('folio');
        // else
        //     res.render
    });
}