
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const getAccountModel = require('../model/account');
const Account = mongoose.model('Account');
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
    res.render("blog/login", {
    });
});

router.post('/', (req, res) => {
    var acc = new Account();
    acc.name = req.body.name;
    acc.email = req.body.email;
    acc.password = req.body.password;
    if(acc.name != ''){
        register(req,res, acc)
    } 
    else{
        login(req,res, acc)
    }
        
    
    
});

function register(req,res, acc) {
    acc.save((err, doc) => {
        if (!err)
            res.redirect('/login');
    else {
        if (err.name == 'ValidationError') {
            res.render("blog/addOrEdit", {
                blog: req.body
            });
        }
        else
            console.log('Error register account : ' + err);
    }
    });
}

function login(req,res){
    Account.findOne({
        email : req.body.email,
        password : req.body.password
    }).then( data =>{
        if(data){
            var token = jwt.sign({
                _id: data._id
            },"mk", {
                expiresIn: 120
            });
            res.cookie("token", token)
            res.redirect('/home')
        }
        else
            return res.json("that bai");
    }).catch(err => {
        return res.json("loi sv");
    });
}

module.exports = router;