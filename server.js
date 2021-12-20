const express = require('express')
const app = express()
const port = 3000
const hbs = require('express-handlebars');
const path = require('path');
var cookieParser = require('cookie-parser')
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');

const blogController = require('./controllers/blogsController');
const accountController = require('./controllers/accountController');
require('./model/db');
app.use(cookieParser());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(bodyparser.json());

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public/assets'));



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
app.use('/login',accountController);

app.get('/blog', checkLogin, (req,res, next)=>{
    
});

function checkLogin(req,res,next){
  try {
    var token = req.cookies.token;
    var check = jwt.verify(token, "mk");
    if(check){
      next();
    }else{
      res.redirect('/login');
    }
  } catch (error) {
    res.clearCookie("token");
    res.redirect('/login');
  }
  
}

app.use('/', checkLogin, blogController);
