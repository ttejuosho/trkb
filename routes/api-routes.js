const db = require('../models');
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = (app) => {
    app.get('/api/getTransactions', (req,res) => {
        db.Transaction.findAll({
            attributes: { exclude: ['transactionId', 'createdAt', 'updatedAt'] }
        })
        .then((dbTransaction) => {
            res.json(dbTransaction);
        })
    });

    app.get('/api/getTransactionById/:transactionId', (req,res)=>{
        db.Transaction.findByPk(req.params.transactionId).then((dbTransaction)=>{
            res.json(dbTransaction);
        });
    });

    app.get('/api/getTransactionsByPreparer/:preparedBy', (req,res)=>{
        db.Transaction.findAll({
            where: {
                preparedBy: req.params.preparedBy
            }
        }).then((dbTransaction) => {
            res.json(dbTransaction);
        });
    });

    app.get('/api/getTransactionsByType/:transactionType', (req,res)=>{
        db.Transaction.findAll({
            where: {
                transactionType: req.params.transactionType
            }
        }).then((dbTransaction) => {
            res.json(dbTransaction);
        });
    });

    app.get('/api/getTransactionsByTerminal/:transactionTerminal', (req,res)=>{
        db.Transaction.findAll({
            where: {
                transactionTerminal: req.params.transactionTerminal
            }
        }).then((dbTransaction) => {
            res.json(dbTransaction);
        });
    });

    app.get('/api/getTransactionsByDateRange/:startDate/:endDate', (req,res)=>{
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
            }
        }).then((dbTransaction) => {
            res.json(dbTransaction);
        }).catch((error) => {
            console.log(error);
        });
    });

    app.get('/api/transaction/delete/:transactionId', (req,res)=>{
        db.Transaction.findByPk(req.params.transactionId).then((dbTransaction)=>{
            if(dbTransaction !== null){
                db.Transaction.update({ deleted: true }, {
                    where: {
                        transactionId: req.params.transactionId
                    }
                }).then((dbTransaction)=>{
                    console.log(dbTransaction);
                    res.json(dbTransaction);
                })
            }
        });
    });

    app.get('/api/getTransactionsByLocation/:locationUID', (req, res)=>{
        db.Transaction.findAll({
            where: {
                locationUID: req.params.locationUID
            }
        }).then((dbTransaction)=>{
            res.json(dbTransaction);
        })
    });

    app.get('/api/getDistinct/:columnName', (req, res)=>{
        if(req.isAuthenticated()){
            db.Transaction.findAll({
                where: {
                    companyUID: res.locals.companyUID
                },
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col(req.params.columnName)), 'value']]
            }).then((dbData)=>{
                res.json(dbData);
            }).catch((err)=>{
                res.json(err);
            });
        } else {
            res.json({ Error: "Unauthorized" });
        }
    });

    app.get('/api/getUsers', (req,res)=>{
        db.User.findAll({
            attributes: {exclude: ['password']}
        }).then((dbUser)=>{
            res.json(dbUser);
        }).catch((err)=>{
            res.json(err);
        });
    });

    app.get('/api/getUser/:userId', (req,res)=>{
        db.User.findByPk(req.params.userId).then((dbUser)=>{
            res.json(dbUser);
        }).catch((err)=>{
            res.json(err);
        });
    });

    app.get('/api/getTransactions/:searchBy/:searchQuery', (req, res)=>{
        if(!req.isAuthenticated()){
            return res.status(401).send({ Error: "Please sign in" });
        }
        var searchObject = {};
        searchObject[ req.params.searchBy ] = req.params.searchQuery;
        searchObject['companyUID'] = res.locals.companyUID;
        db.Transaction.findAll({
            where: searchObject,
            attributes: ['transactionUID', 'companyUID', 'transactionTerminal', 'transactionType', 'amountReceived', 'amountPaid', 'posCharge', 'estimatedCharge', 'transactionCharge', 'customerName', 'customerPhone', 'customerEmail', 'preparedBy', 'createdAt']
        }).then((dbTransaction)=>{
            return res.json(dbTransaction);
        }).catch((err)=>{
            res.json(err);
        });
    });

    app.get('/api/search/:searchBy/:searchQuery', (req,res)=>{
        if(!req.isAuthenticated()){
            return res.status(401).send({ Error: "Please sign in" });
        }
        const searchQuery = req.params.searchQuery;
        const searchBy = req.params.searchBy;
        let queryObj = {};
        const requestStart = Date.now();

        if (searchBy !== "All"){
            queryObj[searchBy] = { companyUID: res.locals.companyUID, [Op.like]: "%" + searchQuery + "%" };
        } else {
            queryObj = 
            {
                transactionUID: { [Op.like]: "%" + searchQuery + "%" },
                transactionTerminal: { [Op.like]: "%" + searchQuery + "%" },
                transactionType: { [Op.like]: "%" + searchQuery + "%" },
                customerName: { [Op.like]: "%" + searchQuery + "%" },
                customerEmail: { [Op.like]: "%" + searchQuery + "%" },
                customerPhone: { [Op.like]: "%" + searchQuery + "%" },
                preparedBy: { [Op.like]: "%" + searchQuery + "%" }
            };
        }

        db.Transaction.findAll({
            where: { companyUID: res.locals.companyUID, [Op.or]: queryObj } 
        }).then((dbTransaction)=>{
            if(dbTransaction.length > 0){
                const processingTime = Date.now() - requestStart;
                var data = {
                    processingTime: processingTime / 1000 + " seconds",
                    count: dbTransaction.length,
                    results: []
                }
                for(var i = 0; i < dbTransaction.length; i++){
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
                        transactionDate: dbTransaction[i].createdAt
                    }
                    data.results.push(temp);
                }

                res.json(data);
            }
    
        }).catch(function (err) {
            res.status(500).send({ message: err.message });
        });

    });

    app.post('/api/saveTransactions', (req, res)=>{
        db.Transaction.bulkCreate(req.body).then((dbTransaction)=>{
            res.json(dbTransaction);
        });
    });

    app.get('/api/getLocations', (req, res) => {
        db.Location.findAll({
            where: {
                companyUID: companyUID
            }
        }).then((dbLocation)=>{
            res.json(dbLocation);
        }).catch((err)=>{
            res.json(err);
        });
    });

    app.get('/api/getLocationsByCompany/:companyUID', (req, res) => {
        db.Company.findOne({
            where: {
                companyUID: req.params.companyUID
            }
        }).then((dbCompany)=>{
            if(dbCompany !== null){
                db.Location.findAll({
                    where: {
                        companyUID: req.params.companyUID
                    }
                }).then((dbLocation)=>{
                    res.json(dbLocation);
                }).catch((err)=>{
                    res.json(err);
                });
            } else {
                res.json({ message: "Company Id is invalid."});
            }
        })
    });

    app.get('/api/getLocationById/:locationUID', (req, res) => {
        db.Location.findOne({
            where: {
                locationUID: req.params.locationUID
            }
        }).then((dbLocation)=>{
            res.json(dbLocation);
        }).catch((err)=>{
            res.json(err);
        });
    });

    app.post('/api/saveNewLocation', (req, res)=>{
        db.Location.create({
            locationUID: (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).toUpperCase(),
            locationName: req.body.locationName,
            companyUID: res.locals.companyUID,
            locationEmail: req.body.locationEmail,
            locationAddress: req.body.locationAddress,
            locationCity: req.body.locationCity,
            locationState: req.body.locationState,
            locationPhone: req.body.locationPhone,
            locationContactName: req.body.locationContactName,
            locationContactEmail: req.body.locationContactEmail,
            locationContactPhone: req.body.locationContactPhone
        }).then((dbLocation)=>{
            res.json(dbLocation);
        }).catch((err)=>{
            res.json(err);
        });
    });
};