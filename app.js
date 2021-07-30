const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

//Chained Route Handlers Using Express
app.route("/articles")
//chainded methods
.get(function(req,res){
    Article.find({},function(err,foundItem){
        if(!err){
            res.send(foundItem); 
        }else{
            res.send(err);
        }
    });
})

.post(function(req,res){
    console.log(req.body.title);    
    console.log(req.body.content);  
    const articleNew = new Article({
        title: req.body.title,
        content: req.body.content
    });  
    articleNew.save(function(err){
        if(!err){
            res.send("Successfully added an article");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the articles");
        }else{
            res.send(err);
        }
    });
});

//Request for all articles

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundItem){
        if(!err){
            if(foundItem){
                res.send(foundItem); 
            }else{
                res.send("No item found!"); 
            }
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
       if(!err){
            res.send("Article deleted");
       }else{
            res.send(err);
       }
    });
})

//Replaces the whole data entry 
.put(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title,content: req.body.content},{overwrite:true},function(err){
            if(!err){
                res.send("Article updated");
            }else{
                res.send(err);
            }
    });    
})

//Replaces small piece of data
.patch(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},function(err){
            if(!err){
                res.send("Article updated");
            }else{
                res.send(err);
            }
    });  
});

//TheOldWays
// app.get("/articles",function(req,res){
//     Article.find({},function(err,foundItem){
//         if(!err){
//             res.send(foundItem); 
//         }else{
//             res.send(err);
//         }
//     });
// });
// app.post("/articles",function(req,res){
//     console.log(req.body.title);    
//     console.log(req.body.content);  
//     const articleNew = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });  
//     articleNew.save(function(err){
//         if(!err){
//             res.send("Successfully added an article");
//         }else{
//             res.send(err);
//         }
//     });
// });
// app.delete("/articles",function(req,res){
//     Article.deleteMany(function(err){
//         if(!err){
//             res.send("Successfully deleted all the articles");
//         }else{
//             res.send(err);
//         }
//     });
// });

app.listen(3000,function(){
    console.log("Server running on port 3000");
});