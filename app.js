//mongod --dbpath /data/db --repair
var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodoverride = require("method-override")

app.use(methodoverride("_method")); 
app.use(bodyparser.urlencoded({extended:true}))
//mongoose.connect("mongodb://localhost/photos")
mongoose.connect("mongodb://kartik:kartik@ds153521.mlab.com:53521/dragndrop")
app.set("view engine", "ejs"); 
app.use(express.static("public"))
 
var photoSchema = new mongoose.Schema({
    name: String, 
    caption: String,
    url: String,
    number: Number
})


var Photo = mongoose.model("Photo", photoSchema)






app.get("/", function(req,res){
        Photo.find({number: 1},function(err, users){
      if(err){
        console.log(err)
      }else{
        
      
        res.render("home", {users: users})
        
      }
    })
  
})

app.get("/photos/:name", function(req, res) {
    Photo.find({name: req.params.name}, function(err, photos){
        if(err){
        console.log(err)
      }else{
        
     
        res.render("index", {photos: photos})
        
      }
    })
})

app.get("/photos/new/:name", function(req,res){
    res.render("addphoto", {name: req.params.name})
})

app.post("/photos/:url/:name", function(req,res){

    Photo.create({
      number: 2,
      name: req.params.name,
      caption: req.body.caption,
      url: "https://cdn.filestackcontent.com/"+ req.params.url
    } ,function(err,photo){
      if(err){
         console.log(err)
      }else{
          res.redirect("/users/" + req.params.name);
       
      }
      
    })
    
    
})

// SHOWING ALL PHOTOS
app.get("/users/login", function(req, res) {
    res.render("login")
})

// app.post("/users/login", function(req, res) {
//     if(req.body.username == "teacher123" && req.body.password == "teacher123"){
//         res.redirect("/users")
//     }else{
//         res.send("Incorrect login")
//     }
    
// })

//CREATING USERS FORM
app.get("/users/new", function(req, res) {
    res.render("createuser");
})

//CREATING USERS
app.post("/users",  function(req, res){
    Photo.find({name: req.body.name},function(err, users) {
        if(err){
            console.log(err)
        }else{
        
           if(users.length < 1){
        
            Photo.create({
              name: req.body.name,
              number: 1
              
            },function(err,user){
              if(err){
               console.log(err)
              }else{
               res.redirect("/users");
              }
            })
           }else{
             
            Photo.create({
              name: req.body.name,
              number: 2
              
            },function(err,user){
              if(err){
               console.log(err)
              }else{
               res.redirect("/users");
            }
            })
           }
        }
    })
   
})

//SHOWING ALL USERS
app.get("/users", function(req, res) {
       Photo.find({number: 1},function(err, users){
      if(err){
        console.log(err)
      }else{
        
      
        res.render("users", {users: users})
        
      }
    })

})

//SHOWING SPECIFIC USERS
app.get("/users/:name", function(req, res) {
    Photo.find({name: req.params.name}, function(err, user){
        if(err){
        console.log(err)
      }else{
        
     console.log(user);
        res.render("user", {user: user})
        
      }
    })
})



//DELETING PHOTOS
app.delete("/photos/:type/:id", function(req,res){
     Photo.find({ _id: req.params.id}, function(err, user) {
         if(err){
             console.log(err);
             
         }else{
             if(req.params.type == "index"){
                console.log("index")
                 var name = user[0].name;
                 
                Photo.findByIdAndRemove(req.params.id, function(err){
                 if(err){
                     res.redirect("/photos/"+name); 
                 }else{
                     console.log(name)
                     res.redirect("/photos/"+name); 
                     
                 }
               })
             }
             
             else if(req.params.type == "photo"){
                 var username = user[0].name;
                 console.log(username)
                 Photo.findByIdAndRemove(req.params.id, function(err){
                 console.log(user+"user")
                 if(err){
                     res.redirect("/users/"+username); 
                 }else{
                     res.redirect("/users/"+username); 
                 }
                })
             }else{
                   var username = user[0].name;
                 console.log(username)
                 Photo.findByIdAndRemove(req.params.id, function(err){
                 console.log(user+"user")
                 if(err){
                     res.redirect("/users"); 
                 }else{
                     res.redirect("/users"); 
                 }
                })
             }
             
             
         }
     })
     
 
     
    
})



app.listen(process.env.PORT, process.env.IP);