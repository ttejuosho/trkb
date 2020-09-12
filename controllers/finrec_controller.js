const db = require("../models");
const Sequelize = require("sequelize");
const {validationResult} = require('express-validator');
const sendEmail = require("../services/email/email.js");
const security = require("../services/security/security.js");

exports.CheckApi = (req,res) => {
    return res.json({
        "productName": "Financial Record System",
        "productVersion": "1.0.0",
        "productRelease": "Future.DateTime()",
        "hostName": "finrec.herokuapp.com/api",
        "runtimeFrameworkVersion": "v14.7.0",
        "totalResponseTime": 0.0025
    });
}

exports.GetSelectTransactionTypePage = (req, res) => {
    return res.render("transactionType");
}

exports.GetNewTransactionForm = (req,res) => {
    return res.render("newTransaction");
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

exports.SaveNewTransaction = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.transactionTerminal = req.body.transactionTerminal;
        errors.transactionType = req.body.transactionType;
        errors.amountReceived = req.body.amountReceived;
        errors.amountPaid = req.body.amountPaid;
        errors.transactionCharge = req.body.transactionCharge;
        errors.posCharge = req.body.posCharge;
        errors.customerName = req.body.customerName;
        errors.customerPhone = req.body.customerPhone;
        errors.customerEmail = req.body.customerEmail;
        return res.render('newTransaction', errors);
    }

    db.Transaction.create({
        transactionUID: (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).toUpperCase(),
        preparedBy: res.locals.name,
        companyUID: res.locals.companyUID,
        locationUID: res.locals.locationUID,
        UserUserId: res.locals.userId,
        transactionTerminal: req.body.transactionTerminal,
        transactionType: req.body.transactionType,
        amountPaid: parseFloat(req.body.amountPaid),
        amountReceived: parseFloat(req.body.amountReceived),
        posCharge: parseFloat(req.body.posCharge),
        transactionCharge: parseFloat(req.body.transactionCharge),
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerEmail: req.body.customerEmail
    }).then((dbTransaction) => {
        if(security.validateEmail(req.body.customerEmail) && req.body.emailReceipt === "on"){
            const subject = "TrKB Transaction Confirmation";
            const emailBody = `
                  <p>Ogbeni ${req.body.customerName},</p>
                  <p style="color: black;">Enle o, Eyin onibara wa. Atunwa l'oruko yin. Ayun lo Ayun bo lowo n yun enu. Aatun ma riyin later.</p>
                  <p>Your ${req.body.transactionType.toLowerCase()} transaction is complete. Your transaction Id is 
                  <span><strong>${dbTransaction.dataValues.transactionUID}</strong></span>.
                  Please use this to reference this transaction in future communications with us regarding this transaction. </p>    
                  <p>If you lost it, dont even call us o, infat dont even come to awa shop again.</p>
                  <p>Click <a href="https://trkb.herokuapp.com/">here</a> to see fisit us online.</p>

                  <p>If you did not do any transaction with us, sombori haf hack you be that, we don collect awa chargis, OYO lo wa. Kama pade mo.</p>
                  <span style="font-size: 1rem;color: black;"><strong>Kowope Enterprises.</strong></span>
                  `;
        
            return new Promise((resolve, reject) => {
              sendEmail(emailBody, subject, req.body.customerEmail);
              return res.render("newTransaction", { transactionSaved: true, transactionUID: dbTransaction.dataValues.transactionUID });
            });
        }
        
    }).catch((err) => {
        console.log(err.errors[0].message);
        return res.render('error', err.errors[0]);
    });
}

exports.search = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.searchQuery = req.body.searchQuery;
        return res.render('index', errors);
    }
    
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
                    posCharge: dbTransaction[i].posCharge,
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
        res.status(500).send({ message: err.message });
    });
}
