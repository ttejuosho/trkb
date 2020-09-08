const db = require('../models');
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = (app) => {
    app.get('/api/getTransactions', (req,res) => {
        db.Transaction.findAll()
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
        db.User.findAll().then((dbUser)=>{
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
        var searchObject = {};
        searchObject[ req.params.searchBy ] = req.params.searchQuery;
        db.Transaction.findAll({
            where: searchObject,
            attributes: ['transactionUID', 'companyUID', 'transactionTerminal', 'transactionType', 'amountReceived', 'amountPaid', 'posCharge', 'estimatedCharge', 'transactionCharge', 'customerName', 'customerPhone', 'customerEmail', 'preparedBy', 'createdAt']
        }).then((dbTransaction)=>{
            res.json(dbTransaction);
        });
    });

    app.get('/api/search/:searchBy/:searchQuery', (req,res)=>{
        const searchQuery = req.params.searchQuery;
        const searchBy = req.params.searchBy;
        let queryObj = {};
        const requestStart = Date.now();

        if (searchBy !== "All"){
            queryObj[searchBy] = { [Op.like]: "%" + searchQuery + "%" };
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
            where: { [Op.or]: queryObj } 
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
};