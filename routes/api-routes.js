const db = require("../models");
const moment = require("moment");
const Sequelize = require("sequelize");
const sequelize = require("sequelize");
const Op = Sequelize.Op;
const { authenticate, grantAccess } = require("../services/security/security.js");
const { getCompanyNamebyUID, getLocationNamebyUID, getCompanyLocations } = require("../services/common/common.js");
//const { grantAccess } = require("../services/security/security.js");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const { query } = require("express");

module.exports = (app) => {
  app.get("/api/getTransactions", (req, res) => {
    db.Transaction.findAll({
      attributes: { exclude: ["transactionId", "createdAt", "updatedAt"] },
    }).then((dbTransaction) => {
      res.json(dbTransaction);
    });
  });

  app.get(
    "/api/getTransactionById/:transactionId",
    authenticate,
    (req, res) => {
      const permission = grantAccess("basic", "readOwn", "transaction");

      db.Transaction.findByPk(req.params.transactionId).then(
        (dbTransaction) => {
          const data = permission.filter(dbTransaction.dataValues);
          console.log(data);
          return res.json(dbTransaction);
        }
      );
    }
  );

  app.get(
    "/api/getTransactionByUID/:transactionUID",
    authenticate,
    (req, res) => {
      db.Transaction.findOne({
        where: {
          transactionUID: req.params.transactionUID,
        },
      }).then((dbTransaction) => {
        res.json(dbTransaction);
      });
    }
  );

  app.get(
    "/api/getTransactionsByPreparer/:preparedBy",
    authenticate,
    (req, res) => {
      db.Transaction.findAll({
        where: {
          preparedBy: req.params.preparedBy,
        },
      }).then((dbTransaction) => {
        res.json(dbTransaction);
      });
    }
  );

  app.get(
    "/api/getTransactionsByType/:transactionType",
    authenticate,
    (req, res) => {
      db.Transaction.findAll({
        where: {
          transactionType: req.params.transactionType,
        },
      }).then((dbTransaction) => {
        res.json(dbTransaction);
      });
    }
  );

  app.get(
    "/api/getTransactionsByTerminal/:transactionTerminal",
    authenticate,
    (req, res) => {
      db.Transaction.findAll({
        where: {
          transactionTerminal: req.params.transactionTerminal,
        },
      }).then((dbTransaction) => {
        res.json(dbTransaction);
      });
    }
  );

  app.get(
    "/api/getTransactionsByDateRange/:startDate/:endDate",
    authenticate,
    (req, res) => {
      // Date Format 2020-08-30T15:10:36.000Z
      const ACCEPT_FORMAT = "YYYY-MM-DD hh:mm:ss";
      const start_date = req.params.startDate;
      const end_date = req.params.endDate;
      const start = moment.utc(start_date, ACCEPT_FORMAT);
      const end = moment.utc(end_date, ACCEPT_FORMAT);

      db.Transaction.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      })
        .then((dbTransaction) => {
          res.json(dbTransaction);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );

  app.get(
    "/api/transaction/delete/:transactionId",
    authenticate,
    (req, res) => {
      if (res.locals.role == "basic") {
        return res.json({
          message: "You are not authorized to perform this operation",
        });
      } else {
        db.Transaction.findByPk(req.params.transactionId).then(
          (dbTransaction) => {
            if (dbTransaction !== null) {
              db.Transaction.update(
                { deleted: true },
                {
                  where: {
                    transactionId: req.params.transactionId,
                  },
                }
              ).then((dbTransaction) => {
                console.log(dbTransaction);
                res.json(dbTransaction);
              });
            }
          }
        );
      }
    }
  );

  app.get(
    "/api/getTransactionsByLocation/:locationUID",
    authenticate,
    (req, res) => {
      var queryParams = {
        locationUID: res.locals.locationUID,
      };

      if (res.locals.role == "basic") {
        queryParams.UserUserId = res.locals.userId;
      }
      db.Transaction.findAll({
        where: queryParams,
      }).then((dbTransaction) => {
        res.json(dbTransaction);
      });
    }
  );

  app.get("/api/getDistinct/:columnName", authenticate, (req, res) => {
    var queryParams = {
      companyUID: res.locals.companyUID,
    };

    if (res.locals.role == "basic") {
      queryParams.UserUserId = res.locals.userId;
    }

    db.Transaction.findAll({
      where: queryParams,
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col(req.params.columnName)),
          "value",
        ],
      ],
    })
      .then((dbData) => {
        return res.json(dbData);
      })
      .catch((err) => {
        return res.json(err.message);
      });
  });

  app.get("/api/getUsers", (req, res) => {
    db.User.findAll({
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
    })
      .then((dbUser) => {
        res.json(dbUser);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get("/api/getUser/:userId", authenticate, (req, res) => {
    db.User.findByPk(req.params.userId)
      .then((dbUser) => {
        res.json(dbUser);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get(
    "/api/getTransactions/:searchBy/:searchQuery",
    authenticate,
    (req, res) => {
      var searchObject = {};
      searchObject[req.params.searchBy] = req.params.searchQuery;
      searchObject["companyUID"] = res.locals.companyUID;
      db.Transaction.findAll({
        where: searchObject,
        attributes: [
          "transactionUID",
          "locationUID",
          "companyUID",
          "transactionTerminal",
          "transactionType",
          "amountReceived",
          "amountPaid",
          "posCharge",
          "customerName",
          "customerPhone",
          "customerEmail",
          "preparedBy",
          "createdAt",
        ],
      })
        .then((dbTransaction) => {
          return res.json(dbTransaction);
        })
        .catch((err) => {
          res.json(err);
        });
    }
  );

  app.get("/api/search/:searchBy/:searchQuery", authenticate, (req, res) => {
    const searchQuery = req.params.searchQuery;
    const searchBy = req.params.searchBy;
    let queryObj = {};
    const requestStart = Date.now();

    if (searchBy !== "All") {
      queryObj[searchBy] = { [Op.like]: "%" + searchQuery + "%" };
    } else {
      queryObj = {
        transactionUID: { [Op.like]: "%" + searchQuery + "%" },
        locatioUID: { [Op.like]: "%" + searchQuery + "%" },
        transactionTerminal: { [Op.like]: "%" + searchQuery + "%" },
        transactionType: { [Op.like]: "%" + searchQuery + "%" },
        customerName: { [Op.like]: "%" + searchQuery + "%" },
        customerEmail: { [Op.like]: "%" + searchQuery + "%" },
        customerPhone: { [Op.like]: "%" + searchQuery + "%" },
        preparedBy: { [Op.like]: "%" + searchQuery + "%" },
      };
    }

    db.Transaction.findAll({
      where: { companyUID: res.locals.companyUID, [Op.or]: queryObj },
    })
      .then((dbTransaction) => {
        if (dbTransaction.length > 0) {
          const processingTime = Date.now() - requestStart;
          var data = {
            processingTime: processingTime / 1000 + " seconds",
            count: dbTransaction.length,
            results: [],
          };
          for (var i = 0; i < dbTransaction.length; i++) {
            var temp = {
              transactionUID: dbTransaction[i].transactionUID,
              locationUID: dbTransaction[i].locationUID,
              transactionTerminal: dbTransaction[i].transactionTerminal,
              transactionType: dbTransaction[i].transactionType,
              amountReceived: dbTransaction[i].amountReceived,
              amountPaid: dbTransaction[i].amountPaid,
              posCharge: dbTransaction[i].posCharge,
              customerName: dbTransaction[i].customerName,
              customerEmail: dbTransaction[i].customerEmail,
              customerPhone: dbTransaction[i].customerPhone,
              preparedBy: dbTransaction[i].preparedBy,
              transactionDate: dbTransaction[i].createdAt,
            };
            data.results.push(temp);
          }

          res.json(data);
        }
      })
      .catch(function (err) {
        res.status(500).send({ message: err.message });
      });
  });

  app.post("/api/saveTransactions", (req, res) => {
    db.Transaction.bulkCreate(req.body)
      .then((dbTransaction) => {
        res.json(dbTransaction);
      })
      .catch((error) => {
        res.json(error.message);
      });
  });

  app.get("/api/makeAdmin/:userId", (req, res) => {
    db.User.update(
      {
        role: "admin",
      },
      {
        where: {
          userId: req.params.userId,
        },
      }
    )
      .then((dbUser) => {
        res.json(dbUser);
      })
      .catch((err) => {
        res.json(err.message);
      });
  });

  app.get("/api/makeBasic/:userId", (req, res) => {
    db.User.update(
      {
        role: "basic",
      },
      {
        where: {
          userId: req.params.userId,
        },
      }
    )
      .then((dbUser) => {
        res.json(dbUser);
      })
      .catch((err) => {
        res.json(err.message);
      });
  });

  app.get("/api/getLocations", authenticate, (req, res) => {
    db.Location.findAll({
      where: {
        companyUID: res.locals.companyUID,
      },
    })
      .then((dbLocation) => {
        res.json(dbLocation);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get("/api/getLocationsByCompany/:companyUID", (req, res) => {
    db.Company.findOne({
      where: {
        companyUID: req.params.companyUID,
      },
    }).then((dbCompany) => {
      if (dbCompany !== null) {
        db.Location.findAll({
          where: {
            companyUID: req.params.companyUID,
          },
        })
          .then((dbLocation) => {
            res.json(dbLocation);
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        res.json({ message: "Company Id is invalid." });
      }
    });
  });

  app.get("/api/getLocationById/:locationUID", authenticate, (req, res) => {
    db.Location.findOne({
      where: {
        locationUID: req.params.locationUID,
      },
    })
      .then((dbLocation) => {
        res.json(dbLocation);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.post(
    "/api/newAgent",
    authenticate,
    [
      check("name").not().isEmpty().escape().withMessage("Name is required"),
      check("emailAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Email is required"),
      check("phoneNumber")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Phone number is required"),
      check("locationUID")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Location is required"),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.name = req.body.name;
        errors.emailAddress = req.body.emailAddress;
        errors.phoneNumber = req.body.phoneNumber;
        errors.locationUID = req.body.locationUID;
        var data = { errors: errors.errors };
        return res.json(data);
      } else {
        if (res.locals.role == "admin") {
          db.User.create({
            name: req.body.name,
            emailAddress: req.body.emailAddress,
            phoneNumber: req.body.phoneNumber,
            locationUID: req.body.locationUID,
            companyUID: res.locals.companyUID,
            role: req.body.role == "on" ? "admin" : "basic",
            password: 1234,
          })
            .then((dbUser) => {
              delete dbUser.password;
              delete dbUser.active;

              var data = {
                errors: [],
                response: dbUser,
              };
              return res.json(data);
            })
            .catch((err) => {
              res.json(err.errors);
            });
        } else {
          return res.json({
            errors: [
              {
                message:
                  "Error: You are not authorized to perform this action.",
              },
            ],
          });
        }
      }
    }
  );

  app.post(
    "/api/updateUser/:userId",
    authenticate,
    [
      check("name").not().isEmpty().escape().withMessage("Name is required"),
      check("emailAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Email is required"),
      check("phoneNumber")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Phone number is required"),
      check("locationUID")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Location is required"),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.name = req.body.name;
        errors.emailAddress = req.body.emailAddress;
        errors.phoneNumber = req.body.phoneNumber;
        errors.locationUID = req.body.locationUID;
        var data = { errors: errors.errors };
        return res.json(data);
      } else {
        if (res.locals.role == "admin") {
          res.locals.locatioUID = req.body.locationUID;
          db.User.update(
            {
              name: req.body.name,
              emailAddress: req.body.emailAddress,
              phoneNumber: req.body.phoneNumber,
              locationUID: req.body.locationUID,
              companyUID: res.locals.companyUID,
              role: req.body.role,
              active: req.body.active,
            },
            {
              where: {
                userId: req.params.userId,
              },
            }
          )
            .then((dbUser) => {
              var data = {
                errors: [],
                response: dbUser,
              };
              return res.json(data);
            })
            .catch((err) => {
              res.json(err.errors);
            });
        } else {
          return res.json({
            errors: [
              {
                message:
                  "Error: You are not authorized to perform this action.",
              },
            ],
          });
        }
      }
    }
  );

  app.post(
    "/api/newLocation",
    authenticate,
    [
      check("locationName")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Location name is required"),
      check("locationAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Address is required"),
      check("locationCity")
        .not()
        .isEmpty()
        .escape()
        .withMessage("City is required"),
      check("locationState")
        .not()
        .isEmpty()
        .escape()
        .withMessage("State is required"),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.locationName = req.body.locationName;
        errors.locationAddress = req.body.locationAddress;
        errors.locationCity = req.body.locationCity;
        errors.locationState = req.body.locationState;
        var data = { errors: errors.errors };
        return res.json(data);
      } else {
        db.Location.create({
          locationUID: Math.floor(Math.random() * 90000) + 10000,
          locationName: req.body.locationName,
          companyUID: res.locals.companyUID,
          locationEmail: req.body.locationEmail,
          locationAddress: req.body.locationAddress,
          locationCity: req.body.locationCity,
          locationState: req.body.locationState,
          locationPhone: req.body.locationPhone,
          locationContactName: req.body.locationContactName,
          locationContactEmail: req.body.locationContactEmail,
          locationContactPhone: req.body.locationContactPhone,
        })
          .then((dbLocation) => {
            var data = {
              errors: [],
              response: dbLocation,
            };
            return res.json(data);
          })
          .catch((err) => {
            res.json(err.errors);
          });
      }
    }
  );

  app.post(
    "/api/updateLocation/:locationId",
    authenticate,
    [
      check("locationName")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Location name is required"),
      check("locationAddress")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Location Address is required"),
      check("locationCity")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Location City is required"),
      check("locationState")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Location State is required"),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.locationName = req.body.locationName;
        errors.locationAddress = req.body.locationAddress;
        errors.locationCity = req.body.locationCity;
        errors.locationState = req.body.locationState;
        var data = { errors: errors.errors };
        return res.json(data);
      } else {
        if (res.locals.role == "admin") {
          db.Location.update(
            {
              locationUID: req.body.locationUID,
              locationName: req.body.locationName,
              companyUID: res.locals.companyUID,
              locationEmail: req.body.locationEmail,
              locationAddress: req.body.locationAddress,
              locationCity: req.body.locationCity,
              locationState: req.body.locationState,
              locationPhone: req.body.locationPhone,
              locationContactName: req.body.locationContactName,
              locationContactEmail: req.body.locationContactEmail,
              locationContactPhone: req.body.locationContactPhone,
            },
            {
              where: {
                locationId: req.params.locationId,
              },
            }
          )
            .then((dbLocation) => {
              var data = {
                errors: [],
                response: dbLocation,
              };
              return res.json(data);
            })
            .catch((err) => {
              res.json(err.errors);
            });
        } else {
          return res.json({
            errors: [
              {
                message:
                  "Error: You are not authorized to perform this action.",
              },
            ],
          });
        }
      }
    }
  );

  app.get("/api/deactivateUser/:userId", authenticate, (req, res) => {
    if (res.locals.role == "admin") {
      db.User.findOne({
        where: {
          userId: req.params.userId,
          companyUID: res.locals.companyUID,
        },
      }).then((dbUser) => {
        if (dbUser != null) {
          db.User.update(
            {
              active: false,
            },
            {
              where: {
                userId: req.params.userId,
              },
            }
          ).then((dbUser) => {
            res.json(dbUser);
          });
        }
      });
    } else {
      return res.json({
        errors: [
          { message: "Error: You are not authorized to perform action." },
        ],
      });
    }
  });

  app.get("/api/activateUser/:userId", authenticate, (req, res) => {
    if (res.locals.role == "admin") {
      db.User.findOne({
        where: {
          userId: req.params.userId,
          companyUID: res.locals.companyUID,
        },
      }).then((dbUser) => {
        if (dbUser != null) {
          db.User.update(
            {
              active: true,
            },
            {
              where: {
                userId: req.params.userId,
              },
            }
          ).then((dbUser) => {
            res.json(dbUser);
          });
        }
      });
    } else {
      return res.json({
        errors: [
          { message: "Error: You are not authorized to perform this action." },
        ],
      });
    }
  });

  app.get("/api/deleteUser/:userId", authenticate, (req, res) => {
    if (res.locals.role == "admin") {
      db.User.findOne({
        where: {
          userId: req.params.userId,
          companyUID: res.locals.companyUID,
        },
      }).then((dbUser) => {
        if (dbUser != null) {
          db.User.destroy({
            where: {
              userId: req.params.userId,
            },
          }).then((dbUser) => {
            res.json(dbUser);
          });
        }
      });
    } else {
      return res.json({
        errors: [
          { message: "Error: You are not authorized to perform this action." },
        ],
      });
    }
  });

  app.get("/api/deleteLocation/:locationId", authenticate, (req, res) => {
    if (res.locals.role == "admin") {
      db.Location.findByPk(req.params.locationId).then((dbLocation) => {
        if (dbLocation != null) {
          db.Location.destroy({
            where: {
              locationId: req.params.locationId,
            },
          }).then((dbLocation) => {
            return res.json(dbLocation);
          });
        }
      });
    } else {
      return res.json({
        errors: [
          { message: "Error: You are not authorized to perform this action." },
        ],
      });
    }
  });

  app.get("/api/getAgents", authenticate, async (req, res) => {
    const data = await db.sequelize.query(
      "SELECT `User`.`userId`, `User`.`name`, `User`.`emailAddress`, `User`.`phoneNumber`, `User`.`role`, `User`.`active`, `Locations`.`locationId` AS `locationId`,  `Locations`.`locationUID` AS `locationUID`, `Locations`.`locationName` AS `locationName` FROM `Users` AS `User` LEFT OUTER JOIN `Locations` AS `Locations` ON `User`.`locationUID` = `Locations`.`locationUID` WHERE `User`.`companyUID` = " +
        res.locals.companyUID,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json(data);
  });

  app.get("/api/getCompanyInfo", authenticate, (req, res) => {
    db.Company.findOne({
      where: {
        companyUID: res.locals.companyUID,
      },
    })
      .then((dbCompany) => {
        res.json(dbCompany);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get(
    "/api/getLocationData/:locationUID",
    authenticate,
    async (req, res) => {
      try {
        const data = await db.sequelize.query(
          "SELECT `Transaction`.`transactionId`, `Transaction`.`transactionUID`,`Transaction`.`companyUID`,`Transaction`.`locationUID`,`Transaction`.`transactionTerminal`,`Transaction`.`transactionType`,`Transaction`.`amountReceived`,`Transaction`.`amountPaid`,`Transaction`.`posCharge`,`Transaction`.`customerName`,`Transaction`.`customerPhone`,`Transaction`.`customerEmail`,`Transaction`.`preparedBy`,`Transaction`.`createdAt`,`Location`.`locationId` AS `locationId`,`Location`.`locationUID` AS `locationUID`,`Location`.`locationName` AS `locationName`,`Location`.`locationAddress` AS `locationAddress`,`Location`.`locationCity` AS `locationCity`,`Location`.`locationState` AS `locationState`,`Location`.`locationPhone` AS `locationPhone` FROM `Transactions` AS `Transaction` LEFT OUTER JOIN `Locations` AS `Location` ON `Transaction`.`locationUID` = `Location`.`locationUID` WHERE `Transaction`.`locationUID` =" +
            req.params.locationUID,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        if (data.length > 0) {
          var result = { Location: {}, Transactions: [] };
          result.Location.locationId = data[0].locationId;
          result.Location.locationUID = data[0].locationUID;
          result.Location.locationName = data[0].locationName;
          result.Location.locationAddress = data[0].locationAddress;
          result.Location.locationCity = data[0].locationCity;
          result.Location.locationState = data[0].locationState;
          result.Location.locationPhone = data[0].locationPhone;

          data.forEach((trans) => {
            var temp = {
              transactionId: trans.transactionId,
              transactionUID: trans.transactionUID,
              companyUID: trans.companyUID,
              transactionTerminal: trans.transactionTerminal,
              transactionType: trans.transactionType,
              amountPaid: trans.amountPaid,
              amountReceived: trans.amountReceived,
              posCharge: trans.posCharge,
              customerName: trans.customerName,
              customerEmail: trans.customerEmail,
              customerPhone: trans.customerPhone,
            };
            result.Transactions.push(temp);
          });
        } else {
          result = data;
        }
        return res.status(200).json(result);
      } catch (errors) {
        return res.json(errors);
      }
    }
  );

  app.get("/api/transactions/getMostRecent",
  authenticate,
  async (req, res) => {
    try{
      let data = await db.Transaction.findAll({
        where: {
          companyUID: res.locals.companyUID,
        },
        limit: 10,
        order: [['createdAt', 'DESC']],
        attributes: ['transactionUID', 'locationUID', 'transactionTerminal', 'transactionType', 'amountReceived', 'amountPaid', 'posCharge', 'createdAt'],
      });

      var results = [];
      for (let i = 0; i < data.length; i++){
        const locationName = await getLocationNamebyUID(data[i].dataValues.locationUID);
        data[i].dataValues.locationName = locationName;
        results.push(data[i].dataValues);
      }

      return res.status(200).json(results);
    } catch (errors) {
      return res.json(errors);
    }
  });

  app.get("/api/transactions/todayByLocation", 
  //authenticate, 
  async (req,res)=> {
    try{
      let results = [];
      let locations = await getCompanyLocations(28994);
      for(var i = 0; i < locations.length; i++){
        let data = { 
          locationName: locations[i].locationName,
          locationUID: locations[i].locationUID,
          locationCount: locations.length,
          transactions: [] 
        }

        let transactions = await db.Transaction.findAll({
          where: {
            locationUID: locations[i].locationUID,
            createdAt: {
              [Op.gt]: new Date().setHours(0, 0, 0, 0).toISOString(),
              [Op.lt]: new Date().toISOString()
            }
          }
        });

        data.transactionCount = transactions.length;

        for(var j = 0; j < transactions.length; j++){
          data.transactions.push(transactions[i].dataValues);
        }

        results.push(data);
      }
      return res.status(200).json(results);
    } catch (errors) {
      return res.json(errors);
    }
  });
};
