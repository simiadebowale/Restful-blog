var express        = require("express"),
expressSanitizer   = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    app            = express();
    
    //app setup
app.use(express.static("public"));    
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser: true});
app.use(methodOverride("_method"));
mongoose.set("useFindAndModify", false);

// blog schema setup
var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: {type: Date, default: Date.now}
});

// Mongoose/model setup
var Blog = mongoose.model("Blog", blogSchema);

// Index route redirect
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//Index Route

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
               res.render("index", {blogs:blogs}); 

        }
    });
});
        //New Route
app.get("/blogs/new", function(req, res){
        res.render("new");
});

// Create Route

app.post("/blogs",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
});

            //show Route
app.get("/blogs/:id", function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            } else {
                res.render("show", {blog: foundBlog});
            }
        });
});

// edit Route

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, editBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog: editBlog});
        }
    });
});

// Update Route

app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }  else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    }); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("blog server is on!");
    
});