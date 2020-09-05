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

};