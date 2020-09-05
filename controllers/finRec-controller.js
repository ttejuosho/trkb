const db = require("../models");
const Sequelize = require("sequelize");
const {validationResult} = require('express-validator');

exports.CheckApi = (req,res) => {
    return res.json({
        "productName": "Financial Record System",
        "productVersion": "1.0.0",
        "productRelease": "Yet to be announced",
        "hostName": "finrec.herokuapp.com/api",
        "runtimeFrameworkVersion": "v14.7.0",
        "totalResponseTime": 0.0025
    });
}

exports.GetSelectTransactionTypePage = (req, res) => {
    return res.render("transactionType");
}

exports.GetTransactionForm = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        errors.transactionType = req.body.transactionType;
        return res.render('transactionType', errors);
    }
    res.render("newTransaction", { transactionType: req.body.transactionType});
}

exports.GetHomePage = (req,res) => {
    return res.render("index");
}

exports.GetTransactionDetails = (req,res) => {
    db.Transaction.findOne({
        where: {
            transactionUID: req.params.transactionUID
        }}).then((dbTransaction)=>{
        return res.render('transactionDetails', dbTransaction.dataValues);
    })
}

exports.SaveDepositTransaction = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.transactionTerminal = req.body.transactionTerminal;
        errors.transactionType = req.body.transactionType;
        errors.amountReceived = req.body.amountReceived;
        errors.posDebitedAmount = req.body.posDebitedAmount;
        errors.transactionType = "Deposit";
        errors.customerName = req.body.customerName;
        errors.customerPhone = req.body.customerPhone;
        errors.customerEmail = req.body.customerEmail;
        return res.render('newTransaction', errors);
    }

    db.Transaction.create({
        transactionUID: (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).toUpperCase(),
        transactionTerminal: req.body.transactionTerminal,
        transactionType: req.body.transactionType,
        amountReceived: parseFloat(req.body.amountReceived),
        posDebitedAmount: parseFloat(req.body.posDebitedAmount),
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerEmail: req.body.customerEmail,
        preparedBy: res.locals.name,
        CompanyCompanyId: res.locals.companyUID,
        UserUserId: res.locals.userId
    }).then((dbTransaction) => {
        console.log(dbTransaction.dataValues);
        return res.render("newTransaction", { transactionSaved: true, transactionUID: dbTransaction.dataValues.transactionUID });
    }).catch((err) => {
        console.log(err.errors[0].message);
        return res.render('error', err.errors[0]);
    });
}

exports.SaveWithdrawalTransaction = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.transactionTerminal = req.body.transactionTerminal;
        errors.transactionType = req.body.transactionType;
        errors.amountPaid = req.body.amountPaid;
        errors.posDebitedAmount = req.body.posDebitedAmount;
        errors.transactionType = "Withdrawal";
        errors.customerName = req.body.customerName;
        errors.customerPhone = req.body.customerPhone;
        errors.customerEmail = req.body.customerEmail;
        return res.render('newTransaction', errors);
    }

    db.Transaction.create({
        transactionUID: (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).toUpperCase(),
        transactionTerminal: req.body.transactionTerminal,
        transactionType: req.body.transactionType,
        amountPaid: parseFloat(req.body.amountPaid),
        posDebitedAmount: parseFloat(req.body.posDebitedAmount),
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerEmail: req.body.customerEmail,
        preparedBy: res.locals.name,
        CompanyCompanyId: res.locals.companyUID,
        UserUserId: res.locals.userId
    }).then((dbTransaction) => {
        console.log(dbTransaction.dataValues);
        return res.render("newTransaction", { transactionSaved: true, transactionUID: dbTransaction.dataValues.transactionUID });
    }).catch((err) => {
        console.log(err.original);
        return res.render('error', err);
    });
}

exports.SaveTransferTransaction = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.transactionTerminal = req.body.transactionTerminal;
        errors.transactionType = req.body.transactionType;
        errors.amountReceived = req.body.amountReceived;
        errors.posDebitedAmount = req.body.posDebitedAmount;
        errors.transactionType = "Transfer";
        errors.customerName = req.body.customerName;
        errors.customerPhone = req.body.customerPhone;
        errors.customerEmail = req.body.customerEmail;
        return res.render('newTransaction', errors);
    }

    db.Transaction.create({
        transactionUID: (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).toUpperCase(),
        transactionTerminal: req.body.transactionTerminal,
        transactionType: req.body.transactionType,
        amountReceived: parseFloat(req.body.amountReceived),
        posDebitedAmount: parseFloat(req.body.posDebitedAmount),
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerEmail: req.body.customerEmail,
        preparedBy: res.locals.name,
        CompanyCompanyId: res.locals.companyUID,
        UserUserId: res.locals.userId
    }).then((dbTransaction) => {
        console.log(dbTransaction.dataValues);
        return res.render("newTransaction", { transactionSaved: true, transactionUID: dbTransaction.dataValues.transactionUID });
    }).catch((err) => {
        console.log(err);
        return res.render('error', err);
    });
}

exports.searchAll = (req, res) => {
    const Op = Sequelize.Op;
    const searchQuery = req.body.searchQuery;
    const searchBy = req.body.searchBy;
    let queryObj = {};

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
            var data = {
                count: dbTransaction.length,
                results: []
            }
            for(var i = 0; i < dbTransaction.length; i++){
                var temp = {
                    transactionId: dbTransaction[i].transactionUID,
                    transactionTerminal: dbTransaction[i].transactionTerminal,
                    transactionType: dbTransaction[i].transactionType,
                    amountReceived: dbTransaction[i].amountReceived,
                    amountPaid: dbTransaction[i].amountPaid,
                    posDebitedAmount: dbTransaction[i].posDebitedAmount,
                    customerName: dbTransaction[i].customerName,
                    customerEmail: dbTransaction[i].customerEmail,
                    customerPhone: dbTransaction[i].customerPhone,
                    preparedBy: dbTransaction[i].preparedBy,
                    transactionDate: dbTransaction[i].createdAt
                }
                data.results.push(temp);
            }
            res.render("index", data);
        }

    }).catch(function (err) {
        res.render("error", err.errors);
    });
}