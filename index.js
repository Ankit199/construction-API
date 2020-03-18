var _expressPackage = require("express");
var _bodyParser = require("body-parser");
var _sqlPackage = require("mssql");
var app = _expressPackage();
var port = process.env.port || 1337;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token,Origin,X-Requested-With,contentType,Content-Type,Accept,Authorization"
  );
  next();
});

/** 
 * ! create application/x-www-form-urlencoded parser
 */
app.use(_bodyParser.urlencoded({ extended: true }));
/**
 * ! create application/json parser
*/
 app.use(_bodyParser.json());



/** 
 * TODO: ==================================Server Test API Begin ================================== 
 */
/** 
 * ? Adding Application Routes to controll App
 */
// const controllers = readdirSync(path.join(__dirname, 'controller'))
// controllers.forEach(controller => {
//   app.use(`/${controller}`, require(`./controller/${controller}`))
// })
var accountController = require('./controller/accountController')();
var masterController = require('./controller/userController')();

app.use("/api/account", accountController);
app.use("/api/user", masterController);
// app.use("/api/location", locationController);

app.get("/message", function(request, response) {
  response.json({ Message: "Welcome to Node js" });
});
 
app.listen(port, function() {
  var dd = new Date();
  var msg = "server is  running on port : - " + port + " Started at : - " + dd;
  console.log(msg);
});

/**
 * !==================================Server Test Running Port Close  ================================== 
 */

