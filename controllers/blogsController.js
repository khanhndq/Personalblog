const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const getBlogModel = require('../model/blog');
const Blog = mongoose.model('Blog');
const multer = require('multer');
var nameImg = "";

//cấu hình lưu trữ file khi upload xong
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
      cb(null, 'public/assets/uploads') 
    },
    filename: function (req, file, cb) {
      // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
      nameImg = filename + '-' + file.originalname 
      cb(null, nameImg )
    }
  })
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage })

router.get('/', (req, res) => {
    Blog.find((err, docs) => {
        if (!err) {
            res.render("blog/home", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
});


router.get('/home/:title', (req, res) => {
    Blog.find({title : req.params.search},(err, docs) => {
        console.log(docs);
    });
});
router.get('/home', (req, res) => {
    Blog.find((err, docs) => {
        if (!err) {
            res.render("blog/home", {
                list : docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
   
});
router.get('/addOrEdit', (req, res) => {
    res.render("blog/addOrEdit", {
        titleBlog : 'Add Blog'
    });
});

router.post('/addOrEdit', upload.single('img'), (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var path = "/uploads/";
    var blog = new Blog();
    blog.title = req.body.title
    blog.author = req.body.author
    blog.content = req.body.content
    blog.imageURL = path
    if(nameImg != ""){
        blog.imageName =  nameImg
        nameImg = ""
    }
    blog.save((err, doc) => {
        if (!err)
            res.redirect('/home');
        else {
            if (err.name == 'ValidationError') {
                res.render("blog/addOrEdit", {
                    blog: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Blog.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { 
            res.redirect('/home'); }
        else {
            var data = doc;
                res.render("blog/addOrEdit", {
                    titleBlog: 'Update Blog',
                    blog: req.body
                });
                console.log('Error during record insertion : ' + err);
            }
    }).lean();
}

router.get('/list', (req, res) => {
    Blog.find((err, docs) => {
        if (!err) {
            res.render("blog/list", {
                docs : docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
   
});

router.get('/:id', (req, res) => {
    Blog.findById(req.params.id,(err,doc)=>{
        res.render("blog/post", {
            blog : doc
        });
    }).lean();
    
});

router.get('/addOrEdit/:id', (req, res) => {
    Blog.findById(req.params.id,(err,doc)=>{
        console.log("Load update "+doc);
        console.log(doc);
        res.render("blog/addOrEdit", {
            titleBlog: "Update Blog",
            blog : doc
        });
    }).lean();
    
});

router.get('/delete/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/home');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});


module.exports = router;