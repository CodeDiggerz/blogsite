var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var express=require('express');
var app=express();
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
mongoose .connect('mongodb://localhost/restful_blog_app', {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {     
     console.log(`DB Connection Error: ${err.message}`);
    });

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default: Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
/*Blog.create({
    tilte: "test blog",
    image: "https://images.unsplash.com/photo-1579985106844-ca6beda2ceac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body:"This is my first blog",
    
    
})*/
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    
    Blog.find({},function(err,blogs){
        if(err)
        console.log("error in finding blog");
        else
        res.render("index",{blogs:blogs});        
    })
});
//new blog
app.get("/blogs/new",function(req,res){
    res.render("new");
})
//create route
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
         res.render("new");
        else
        res.redirect("/blogs");
    })
})
//show
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.render("show",{blog:foundBlog});
    })
    
})
//edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.rendirect("/blogs");
        else
        res.render("edit",{blog : foundBlog});
    })

})
//update
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
      if(err)
      res.redirect("/blogs");
      else
      res.redirect("/blogs/"+ req.params.id);
    })
})
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs");
    })
});
app.listen(2000,function(){
    console.log("server is working");
});