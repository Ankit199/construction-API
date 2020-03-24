var express = require("express");
var router = express.Router();
var sql = require("mssql");
var conn = require("../connectionDB/dbconfig")();
var jwt = require("jsonwebtoken");
var config = require("../config");

var InOutRoute = function() {
  /**
   * ! ? Method Implemented for Add Item in stock
   */

  router.route("/additem").post(function(req, res) {
    var token = req.headers["x-access-token"];

    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });

    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, data: "Failed to authenticate token." });

      conn
        .connect()
        .then(function() {
          var request = new sql.Request(conn);
          request.input("iniD", sql.VarChar(50), req.body.iniD);
          request.input("sname", sql.VarChar(50), req.body.sname);
          request.input("type", sql.VarChar(50), req.body.type);
          request.input("size", sql.VarChar(50), req.body.size);
          request.input("unit", sql.Int, req.body.unit);
          request.input("siteid", sql.VarChar(50), req.body.siteid);
          request.input("flag", sql.VarChar(10), "IN");
          request.execute("sp_inoutitem", function(err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
              // console.log(recordSet)
              if (recordSet.rowsAffected.length == 0) {
                res.status(200).send({ auth: "false", data: [] });
              } else {
                res
                  .status(200)
                  .send({ auth: "true", data: recordSet.rowsAffected[0] });
              }
            }
          });
        })
        .catch(function(err) {
          conn.close();
          res.status(400).send({ auth: "false", data: err });
        });
    });
  });

  router.route("/outitem").post(function(req, res) {
    var token = req.headers["x-access-token"];

    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });

    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, data: "Failed to authenticate token." });

      conn
        .connect()
        .then(function() {
          var request = new sql.Request(conn);          
          request.input("id", sql.int, req.body.id);
          request.input("runit", sql.Int, req.body.runit);
          request.input("flag", sql.VarChar(10), "OUT");
          request.execute("sp_inoutitem", function(err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
              // console.log(recordSet)
              if (recordSet.rowsAffected.length == 0) {
                res.status(200).send({ auth: "false", data: [] });
              } else {
                res
                  .status(200)
                  .send({ auth: "true", data: recordSet.rowsAffected[0] });
              }
            }
          });
        })
        .catch(function(err) {
          conn.close();
          res.status(400).send({ auth: "false", data: err });
        });
    });
  });

  return router;
};

module.exports = InOutRoute;
