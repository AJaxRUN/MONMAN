var mongoose = require('mongoose');
    mongoose.connect("mongodb+srv://arjun:arjuncr1818@cluster0-vcrk3.gcp.mongodb.net/test?retryWrites=true&w=majority",
    {useNewUrlParser : true,
    useUnifiedTopology : true}).then(()=>console.log("Connected to DB"))
    .catch(err => console.log("Refused to connect...", err));
module.exports.setSchema = function(app) {
     var userSchema = new mongoose.Schema({
        username:String,    
        password:String,
        name:String
    });
    var folioSchema = new mongoose.Schema({
        id:Number,
        name:String,
        credit:Number,
        debit:Number,
        balance:Number,
        remarks:String
    });
    var detailSchema = new mongoose.Schema({
        id:Number,
        date:Date,      
        credit:Number,
        debit:Number,
        balance:Number,
        remarks:String
    });
    var userModel = mongoose.model('userModel', userSchema);
    var folioModel = mongoose.model('folioModel', folioSchema);
    var detailModel = mongoose.model('detailModel', detailSchema); 
    var schemas = {"userModel" : userModel,
     "folioModel": folioModel,
     "detailModel" : detailModel
    };
    return schemas;
}