var express = require("express");
var router = express.Router();
var sql = require("mssql");
var conn = require("../connectionDB/dbconfig")();
var jwt = require("jsonwebtoken");
var config = require("../config");
var routes = function () {
  /**
   * ! Authenticate user during  login and generate json web token for security
   */

  router.route("/auth").post(function (req, res) {
    conn
      .connect()
      .then(function () {
        var request = new sql.Request(conn);
        request.input("password", sql.VarChar(50), req.body.password);
        request.input("user", sql.VarChar(50), req.body.user);
        request.input("flag", sql.VarChar(50), "L");
        request.execute("auth", function (err, recordSet) {
          conn.close();
          if (err) {
            res.status(400).send({ auth: false, data: err });
          } else {
            var data = recordSet.recordsets[0];
            if (recordSet.recordsets[0].length == 0) {
              res.status(200).send({ auth: false, token: null });
            } else {
              var token = jwt.sign({ id: data[0].empID }, config.secret, {
                expiresIn: 86400   // for expires in 5 hours
              });
              // 86400 miliseconds for  expires in 24 hours
              res.status(200).send({ auth: true, token: token });
            }
          }
        });
      })
      .catch(function (err) {
        conn.close();
        res.status(400).send({ auth: false, data: err });
      });
  });

  /**
   * ! Get User Profile Data
   */

  router.route("/user").get(function (req, res) {
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
          request.input("empid", sql.VarChar(50), decoded.id);
          request.input("flag", sql.VarChar(10), "P");
          request.execute("auth", function (err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
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
   * ! Get Location data 
   * */
  router.route("/getlocation").get(function (req, res) {
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
          request.input("flag", sql.VarChar(10), "st");
          request.execute("sp_location", function (err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
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
   * ! ? Get Site Report data 
   */
  router.route("/getsitereport").get(function (req, res) {
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
          request.input("flag", sql.VarChar(10), "Gsite");
          request.execute("sp_location", function (err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
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
   * ! ? Get Site Module Report data 
   */
  router.route("/getsiteModulereport").get(function (req, res) {
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
          request.input("flag", sql.VarChar(10), "R");
          request.execute("sp_sitepartition", function (err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
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
   * ! ? Get Running Site List by city name 
   */
  router.route("/getsitebycity").post(function (req, res) {
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
          request.input("city", sql.VarChar(50), req.body.city);
          request.input("flag", sql.VarChar(10), "GSite");
          request.execute("sp_sitepartition", function (err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
             // console.log(recordSet)
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
   * ! Add Location 
   */

  router.route("/addlocation").post(function (req, res) {

    var token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, data: "Failed to authenticate token." });
      }
    });
    conn
      .connect()
      .then(function () {
        var request = new sql.Request(conn);
        request.input("state", sql.VarChar(50), req.body.state);
        request.input("city", sql.VarChar(50), req.body.city);
        request.input("flag", sql.VarChar(10), "I");
        request.execute("sp_location", function (err, recordSet) {
          conn.close();

          if (err) {
            res.status(400).send(err);
          } else {
            if (recordSet.rowsAffected.length == 0) {
              res.status(200).send({ sucess: "false", data: [] });
            } else {
              res
                .status(200)
                .send({ sucess: "true", data: recordSet.rowsAffected[0] });
            }
          }
        })
      })
  })

  /**
   *  ! Add Site Master
   */
  router.route("/addsite").post(function (req, res) {

    var token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, data: "Failed to authenticate token." });
      }
    });
    conn
      .connect()
      .then(function () {
        var request = new sql.Request(conn);
        request.input("stid", sql.VarChar(50), req.body.state);
        request.input("cityid", sql.VarChar(50), req.body.city);
        request.input("site", sql.VarChar(50), req.body.site);
        request.input("flag", sql.VarChar(10), "site");
        request.execute("sp_location", function (err, recordSet) {
          conn.close();

          if (err) {
            res.status(400).send(err);
          } else {
            if (recordSet.rowsAffected.length == 0) {
              res.status(200).send({ sucess: "false", data: [] });
            } else {
              res
                .status(200)
                .send({ sucess: "true", data: recordSet.rowsAffected[0] });
            }
          }
        })
      })
  });
  /**
   *  ! Add Site Module
   */
  router.route("/addsiteModule").post(function (req, res) {

    var token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }
    var emp = '';
    jwt.verify(token, config.secret, function (err, decoded) {

      if (err) {
        return res
          .status(500)
          .send({ auth: false, data: "Failed to authenticate token." });
      }
      else {
        emp = decoded.id;
      }
    });
    conn
      .connect()
      .then(function () {
        var request = new sql.Request(conn);
        request.input("sitepart", sql.VarChar(50), req.body.sitepart);
        request.input("emp", sql.VarChar(50), emp);
        request.input("sitecode", sql.VarChar(50), req.body.sitecode);
        request.input("flag", sql.VarChar(10), "I");
        request.execute("sp_sitepartition", function (err, recordSet) {
          conn.close();

          if (err) {
            res.status(400).send(err);
          } else {
            if (recordSet.rowsAffected.length == 0) {
              res.status(200).send({ sucess: "false", data: [] });
            } else {
              res
                .status(200)
                .send({ sucess: "true", data: recordSet.rowsAffected[0] });
            }
          }
        })
      })
  });

  /**
   * ? Add New Department to store 
   * ! For ItemDepartment table
   */
  router.route("/additemdepartment").post(function (req, res) {

    var token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }
    var emp = '';
    jwt.verify(token, config.secret, function (err, decoded) {

      if (err) {
        return res
          .status(500)
          .send({ auth: false, data: "Failed to authenticate token." });
      }
      else {
        emp = decoded.id;
      }
    });
    conn
      .connect()
      .then(function () {
        var request = new sql.Request(conn);
      //request.input("sitepart", sql.VarChar(50), req.body.sitepart);
        request.input("emp", sql.VarChar(50), emp);
        request.input("department", sql.VarChar(50), req.body.department);
        request.input("flag", sql.VarChar(10), "I");
        request.execute("sp_department", function (err, recordSet) {
          conn.close();

          if (err) {
            res.status(400).send(err);
          } else {
            if (recordSet.rowsAffected.length == 0) {
              res.status(200).send({ auth: "false", data: [] });
            } else {
              res
                .status(200)
                .send({ auth: "true", data: recordSet.rowsAffected[0] });
            }
          }
        })
      })
  });

  /**
   * ? Get Data For Item Department
   * ! From ItemDepartment table
   */

  router.route("/getitemdepartment").get(function (req, res) {
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
          request.input("flag", sql.VarChar(10), "G");
          request.execute("sp_department", function (err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
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
   * ? Delete  Data For Item Department
   * ! From ItemDepartment table
   */
  router.route("/deleteitemdepartment").post(function (req, res) {
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
          request.input("id", sql.VarChar(50), req.body.dpcode);
          request.input("flag", sql.VarChar(10), "U");
          request.execute("sp_department", function (err, recordSet) {
            conn.close();
            if (err) {
              res.status(400).send(err);
            } else {
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
};

module.exports = routes;
