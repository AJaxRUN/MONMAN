const bcrypt = require('bcrypt');
const saltRounds = 10;
var bodyparser = require('body-parser');
var ses;
var urlencodedParser = bodyparser.urlencoded({ extended: false });
function isEmpty(obj) {
    return !Object.keys(obj).length > 0;
}
module.exports.reqManager = function(app, path, models){
    app.get(['/','/login'],function(req,res){
        if(typeof ses == 'undefined' || ses.log==false) {
            ses = req.session;
            ses.log = false;
            res.render('login',{msg:"Log In"});
            var date = new Date();
            console.log("Login page:"+date);
        }
        else if(ses.log==true)
            res.render("folio",{name:ses.name});
    });

    app.get('/folio', function(req,res) {
        if(typeof ses!=='undefined' && ses.log == true) {
            var date = new Date();
            console.log("Folio page:"+date);
            var folioModel = models["folioModel"];
            folioModel.find({username: ses.username}, (err,dat) => {
                if (err)
                    throw err;
                else 
                    res.render('folio', {name: ses.name, data:dat});
            });
        }
        else 
        {
            res.render("login",{msg: "Please log in to continue!"});
        }
    });

    //To go to specific folio
    app.get('/details', function(req,res) {
        console.log("Details page:"+new Date());
        if(typeof ses === 'undefined' || ses.log == false)
        {
            res.render("login",{msg:"Please log in to continue!"});
        }
        else {
            res.render('details', {name: req.query.name});
        }
    });
    app.get("/register", (req,res)=> {
        console.log("Register page:"+new Date());
        res.render('register');
    });
    app.post("/newUser",urlencodedParser,(req,res)=> {
        var name = req.body.name;
        var uname = req.body.username;
        var pass = req.body.password;
        var userModel = models["userModel"];
        userModel.find({username: uname },function(err, data){
            if(err)
                res.send("error");
            else if(!isEmpty(data))
                res.send("failed");
            else {
                bcrypt.hash(pass, saltRounds, function(err, hash) {
                    userModel({"name": name,"username": uname,"password": hash}).save((err,data)=> {
                        if(err) {
                            res.send("error");
                            throw err;
                        }
                        else {
                            res.send("success");
                            console.log("successfully inserted the data!");
                        }
                    });
                });
            }
        });
        
    });

    //To authenticate login
     app.post('/authenticate', urlencodedParser, function(req,res) {
        var userModel = models["userModel"];
        var uname = req.body.username;
        var pass = req.body.password;
        if(typeof ses == 'undefined' || ses.log==false) {
            ses = req.session;
            userModel.find({username : uname},'-_id', (err,data)=>{
                if(err)
                    throw err;
                else if(isEmpty(data))
                    res.send("error1");
                else {
                    bcrypt.compare(pass, data[0]["password"], function(err, peak) {
                        if(err)
                            throw err;
                        else if(peak) {
                            console.log("login success");
                            ses.log = true;
                            ses.name = data[0]["name"];
                            ses.username = uname;
                            res.send("success");
                        }
                        else
                            res.send("error2");
                    });
                }
            }); 
        }
        else {
            console.log("WARNING !! Already logged in user trying to log in!");
        }
    });
    
    // To create a new folio
    app.post("/newFolio", urlencodedParser, (req,res)=> {
        if(typeof ses == "undefined" || ses.log==false)
        {
            res.render("login",{msg: "Please log in to continue!"});
        }
        else {
            var name = req.body.name;
            var rem = req.body.remarks;
            var folioModel = models["folioModel"];
            folioModel({username:ses.username,"name":name,credit:0,debit:0,balance:0,remarks:rem}).save((err,data)=> {
                if (err)
                    throw err;
                else
                    console.log("New folio created:"+new Date());
                    res.send(data["_id"]);
            })
        }
    });

    //To delete a folio 
    app.post("/deleteFolio",urlencodedParser,(req,res)=>{
        var pass = req.body.password;
        var id = req.body.id;
        var uname = ses.username;
        var userModel = models["userModel"];
        var folioModel = models["folioModel"];
        if(typeof ses != 'undefined' && ses.log==true) {
            userModel.find({username : uname},'-_id', (err,data)=>{
                if(err)
                    throw err;
                else if(isEmpty(data))
                    res.send("failed");
                else {
                    bcrypt.compare(pass, data[0]["password"], function(err, peak) {
                        if(err)
                            throw err;
                        else if(peak) {
                            console.log("Folio removed:"+new Date());
                            folioModel.deleteOne({username:uname,_id:id}, (err,data)=> {
                                if(err)
                                    throw err;
                                else
                                    res.send("success");
                            });
                        }
                        else
                            res.send("failed");
                    });
                }
            }); }
            else 
                res.render('login',{msg:"Log in!"});
    });


    app.get('/logout',(req,res) => {
        if(typeof ses!=="undefined")
            ses.log= false;
        res.render('login',{msg:"Log in!"});
    });

    app.use(function(req, res){
        res.send("<h1>Error 404: Oops the page your looking for is not found!!</h1>");
        }
    );
}
