var express = require("express");
var router = express.Router();
var sql = require("mssql");
var conn = require("../connectionDB/dbconfig")();
var jwt = require("jsonwebtoken");
var config = require("../config");
var userroutes = function () {
    /**
      * ! ? register user for site 
      */
    router.route("/adduser").post(function (req, res) {
        var token = req.headers["x-access-token"];

        if (!token)
            return res
                .status(401)
                .send({ auth: false, message: "No token provided." });

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return res
                    .status(500)
                    .send({ auth: false, data: "Failed to authenticate token." });

            conn
                .connect()
                .then(function () {
                    var request = new sql.Request(conn);
                    request.input("state", sql.VarChar(50), req.body.state);
                    request.input("site", sql.VarChar(50), req.body.site);
                    request.input("city", sql.VarChar(50), req.body.city);
                    request.input("name", sql.VarChar(50), req.body.name);
                    request.input("password", sql.VarChar(50), req.body.password);
                    request.input("role", sql.VarChar(50), req.body.role);
                    request.input("email", sql.VarChar(50), req.body.email);
                    request.input("contact", sql.VarChar(50), req.body.contact);
                    request.input("flag", sql.VarChar(10), "I");
                    request.execute("sp_register", function (err, recordSet) {
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
                .catch(function (err) {
                    conn.close();
                    res.status(400).send({ auth: "false", data: err });
                });
        });
    });

/**
 * ! ? Get register user data  
 */

    router.route("/getuser").post(function (req, res) {
        var token = req.headers["x-access-token"];

        if (!token)
            return res
                .status(401)
                .send({ auth: false, message: "No token provided." });

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return res
                    .status(500)
                    .send({ auth: false, data: "Failed to authenticate token." });

            conn
                .connect()
                .then(function () {
                    var request = new sql.Request(conn);
                    request.input("PageNumber", sql.VarChar(50), req.body.pagenumber);

                    request.input("flag", sql.VarChar(10), "G");
                    request.execute("sp_register", function (err, recordSet) {
                        conn.close();
                        if (err) {
                            res.status(400).send(err);
                        } else {
                         //   console.log(recordSet)
                            if (recordSet.recordsets[0].length == 0) {
                                res.status(200).send({ auth: "false", data: [] });
                            } else {
                                res
                                    .status(200)
                                    .send({ auth: "true", data: recordSet.recordsets[0] });
                            }
                        }
                    });
                })
                .catch(function (err) {
                    conn.close();
                    res.status(400).send({ auth: "false", data: err });
                });
        });
    });

/**
 * !?  Activate Deactivate register user account
 */
router.route("/deleteuser").post(function (req, res) {
    var token = req.headers["x-access-token"];

    if (!token)
        return res
            .status(401)
            .send({ auth: false, message: "No token provided." });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res
                .status(500)
                .send({ auth: false, data: "Failed to authenticate token." });

        conn
            .connect()
            .then(function () {
                var request = new sql.Request(conn);
                request.input("empID", sql.VarChar(50), req.body.empID);

                request.input("flag", sql.VarChar(10), "D");
                request.execute("sp_register", function (err, recordSet) {
                    conn.close();
                    if (err) {
                        res.status(400).send(err);
                    } else {
                     //   console.log(recordSet)
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
            .catch(function (err) {
                conn.close();
                res.status(400).send({ auth: "false", data: err });
            });
    });
});
    return router;
}
module.exports = userroutes;