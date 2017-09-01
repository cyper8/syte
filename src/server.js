const uuid = require('uuid/v4');
const appkey = uuid();
const env = process.env.NODE_ENV || 'development';
var express = require("express")
, url = require("url")
, bodyParser = require("body-parser")
, jsonParser = bodyParser.json()
, app = express()
, session = require('express-session');

app.set('trust proxy',1);
app.use(require("helmet")());
app.use(sesion({
  secret: appkey,
  resave: false,
  saveUninitialized: false,
  genid: uuid,
  cookie: (env == "production")?
    {
      secure: true,
      httpOnly: true,
      sameSite: true,
      maxAge: 1234567
    }:
    {}
}));

app.get('/photogallery',function(req,res){

});
app.post('/photogallery',jsonParser,function(req,res){

});

app.use(express.static('../assets',{maxAge:1000}));

app.listen(process.env.PORT||3000, process.env.IP||"127.0.0.1",
  function () { console.log('Listening on '+ process.env.C9_HOSTNAME||'localhost' + ":" + process.env.PORT||3000) });
