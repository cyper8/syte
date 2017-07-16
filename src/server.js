var express = require("express")
, url = require("url")
, bodyParser = require("body-parser")
, jsonParser = bodyParser.json()
, app = express();

app.use(require("helmet")());
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',jsonParser,function(req,res){
  // response on home request
});


app.use(express.static('../assets',{maxAge:1000}));

app.listen(process.env.PORT||3000, process.env.IP||"127.0.0.1",
  function () { console.log('Listening on ' + process.env.PORT|3000) });
