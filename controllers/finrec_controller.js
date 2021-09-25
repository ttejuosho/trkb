const db = require("../models");
const Sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const sendEmail = require("../services/email/email.js");
const {
  getLocationNamebyUID,
  validateEmail,
} = require("../services/common/common.js");

exports.CheckApi = (req, res) => {
  return res.json({
    productName: "Financial Record System",
    productVersion: "1.0.0",
    productRelease: "Future.DateTime()",
    hostName: "finrec.herokuapp.com/api",
    runtimeFrameworkVersion: "v14.7.0",
    totalResponseTime: 0.0025,
  });
};

exports.GetNewTransactionForm = (req, res) => {
  return res.render("newTransaction", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
    transactionType: req.params.transactionType,
  });
};

exports.GetHomePage = (req, res) => {
  return res.render("index", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
  });
};

exports.GetTransactionLibrary = (req, res) => {
  return res.render("transactionLibrary", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
  });
};

exports.GetTransactionsPage = (req, res) => {
  return res.render("transactions", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
  });
};

exports.GetTransactionDetails = (req, res) => {
  db.Transaction.findOne({
    where: {
      transactionUID: req.params.transactionUID,
    },
    raw: true,
  }).then((dbTransaction) => {
    dbTransaction.companyName = req.session.userInfo.companyName;
    dbTransaction.companyId = req.session.userInfo.companyId;
    return res.render("transactionDetails", dbTransaction);
  });
};

exports.SaveNewTransaction = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.transactionTerminal = req.body.transactionTerminal;
    errors.transactionType = req.body.transactionType;
    errors.transactionAmount = req.body.transactionAmount;
    errors.transactionCharge = req.body.transactionCharge;
    errors.posCharge = req.body.posCharge;
    errors.customerName = req.body.customerName;
    errors.customerPhone = req.body.customerPhone;
    errors.customerEmail = req.body.customerEmail;
    errors.companyName = req.session.userInfo.companyName;
    errors.companyId = req.session.userInfo.companyId;
    return res.render("newTransaction", errors);
  }

  db.Transaction.create({
    transactionUID: (
      Math.random().toString(36).substring(2, 5) +
      Math.random().toString(36).substring(2, 5)
    ).toUpperCase(),
    preparedBy: res.locals.name,
    companyUID: res.locals.companyUID,
    locationUID: res.locals.locationUID,
    UserUserId: res.locals.userId,
    transactionTerminal: req.body.transactionTerminal,
    transactionType: req.body.transactionType,
    transactionCharge: parseFloat(req.body.transactionCharge),
    transactionAmount: parseFloat(req.body.transactionAmount),
    posCharge: parseFloat(req.body.posCharge),
    customerName: req.body.customerName,
    customerPhone: req.body.customerPhone,
    customerEmail: req.body.customerEmail,
    estimatedProfit:
      parseFloat(req.body.transactionCharge) - parseFloat(req.body.posCharge),
  }).then((dbTransaction) => {
    if (
      validateEmail(req.body.customerEmail) &&
      req.body.emailReceipt === "on"
    ) {
      const subject = `Your ${req.body.transactionType} Transaction Confirmation`;
      const emailBody = `
                    <p>Hello ${
                      req.body.customerName.split(" ").length > 1
                        ? req.body.customerName.split(" ")[0]
                        : req.body.customerName
                    },</p>
                    <p>Thank you for visiting our store.</p>
                    <p>Your ${req.body.transactionType.toLowerCase()} transaction is complete. Your transaction code is 
                    <span><strong>${
                      dbTransaction.dataValues.transactionUID
                    }</strong></span>.
                    Please use this code to reference this transaction in future communications with us regarding this transaction.</p>    
                    
                    <p>Click <a href="https://trkb.herokuapp.com/">here</a> to visit us online.</p>
                    <span style="font-size: 1rem;color: black;"><strong>${
                      req.session.userInfo.companyName
                    }</strong></span>
                    `;

      return new Promise((resolve, reject) => {
        sendEmail(
          req.session.userInfo.companyName,
          emailBody,
          subject,
          req.body.customerEmail
        );
        return res.render("newTransaction", {
          transactionSaved: true,
          transactionUID: dbTransaction.dataValues.transactionUID,
          companyName: req.session.userInfo.companyName,
          companyId: req.session.userInfo.companyId,
        });
      });
    }
    return res.render("newTransaction", {
      transactionSaved: true,
      transactionUID: dbTransaction.dataValues.transactionUID,
      companyName: req.session.userInfo.companyName,
      companyId: req.session.userInfo.companyId,
    });
  });
};

exports.search = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.searchQuery = req.body.searchQuery;
    return res.render("index", errors);
  }

  const Op = Sequelize.Op;
  const searchQuery = req.body.searchQuery;
  const searchBy = req.body.searchBy;
  let queryObj = {};

  if (searchBy !== "All") {
    queryObj[searchBy] = { [Op.like]: "%" + searchQuery + "%" };
  } else {
    queryObj = {
      transactionUID: { [Op.like]: "%" + searchQuery + "%" },
      transactionTerminal: { [Op.like]: "%" + searchQuery + "%" },
      transactionType: { [Op.like]: "%" + searchQuery + "%" },
      customerName: { [Op.like]: "%" + searchQuery + "%" },
      customerEmail: { [Op.like]: "%" + searchQuery + "%" },
      customerPhone: { [Op.like]: "%" + searchQuery + "%" },
      preparedBy: { [Op.like]: "%" + searchQuery + "%" },
    };
  }

  db.Transaction.findAll({
    where: { [Op.or]: queryObj },
  })
    .then((dbTransaction) => {
      if (dbTransaction.length > 0) {
        var data = {
          companyName: req.session.userInfo.companyName,
          companyId: req.session.userInfo.companyId,
          count: dbTransaction.length,
          results: [],
        };
        for (var i = 0; i < dbTransaction.length; i++) {
          var temp = {
            transactionId: dbTransaction[i].transactionUID,
            transactionTerminal: dbTransaction[i].transactionTerminal,
            transactionType: dbTransaction[i].transactionType,
            transactionAmount: dbTransaction[i].transactionAmount,
            transactionCharge: dbTransaction[i].transactionCharge,
            posCharge: dbTransaction[i].posCharge,
            customerName: dbTransaction[i].customerName,
            customerEmail: dbTransaction[i].customerEmail,
            customerPhone: dbTransaction[i].customerPhone,
            preparedBy: dbTransaction[i].preparedBy,
            transactionDate: dbTransaction[i].createdAt,
          };
          data.results.push(temp);
        }
        res.render("index", data);
      }
    })
    .catch(function (err) {
      res.status(500).send({ message: err.message });
    });
};

exports.GetProfilePage = async (req, res) => {
  try {
    const locationName = await getLocationNamebyUID(res.locals.locationUID);

    const hbsObject = {
      name: res.locals.name,
      companyUID: res.locals.companyUID,
      locationUID: res.locals.locationUID,
      locationName: locationName,
      emailAddress: res.locals.emailAddress,
      phoneNumber: res.locals.phoneNumber,
      companyName: req.session.userInfo.companyName,
      companyId: req.session.userInfo.companyId,
    };
    res.render("profile", hbsObject);
  } catch (error) {
    console.log("There was an error: ", error);
  }
};

exports.GetSettingsPage = async (req, res) => {
  try {
    const companyInfo = await db.Company.findOne({
      where: {
        companyUID: res.locals.companyUID,
      },
      raw: true,
    });

    const hbsObject = {
      companyInfo: companyInfo,
      companyName: req.session.userInfo.companyName,
      companyId: req.session.userInfo.companyId,
    };

    res.render("settings", hbsObject);
  } catch (error) {
    console.log("There was an error: ", error);
  }
};

exports.UpdateCompanyInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.companyName = req.body.companyName;
      errors.companyEmail = req.body.companyEmail;
      errors.companyAddress = req.body.companyAddress;
      errors.companyCity = req.body.companyCity;
      errors.companyState = req.body.companyState;
      errors.companyPhone = req.body.companyPhone;
      errors.companyInfo = {
        companyName: req.body.companyName,
        companyEmail: req.body.companyEmail,
        companyAddress: req.body.companyAddress,
        companyCity: req.body.companyCity,
        companyState: req.body.companyState,
        companyPhone: req.body.companyPhone,
        companyWebsite: req.body.companyWebsite,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
      };
      return res.render("settings", errors);
    }

    await db.Company.update(
      {
        companyName: req.body.companyName,
        companyEmail: req.body.companyEmail,
        companyAddress: req.body.companyAddress,
        companyCity: req.body.companyCity,
        companyState: req.body.companyState,
        companyPhone: req.body.companyPhone,
        companyWebsite: req.body.companyWebsite,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        contactEmail: req.body.contactEmail,
      },
      {
        where: {
          companyUID: res.locals.companyUID,
        },
      }
    ).then((dbCompany) => {
      return res.redirect("/settings");
    });
  } catch (error) {
    console.log("There was an error: ", error);
  }
};

exports.GetExpenseTracker = async (req, res) => {
  return res.render("expenseTracker", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
  });
};

exports.GetNewSaleRecordPage = async (req, res) => {
  return res.render("newSaleRecord", {
    companyName: req.session.userInfo.companyName,
    companyId: req.session.userInfo.companyId,
  });
};

exports.SaveNewSaleItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.itemName = req.body.itemName;
    errors.itemModel = req.body.itemModel;
    errors.itemCategory = req.body.itemCategory;
    errors.brandName = req.body.brandName;
    errors.purchasePrice = req.body.purchasePrice;
    errors.purchaseContactMedium = req.body.purchaseContactMedium;
    return res.render("newSaleRecord", errors);
  }

  let itemData = {
    itemName: req.body.itemName,
    itemModel: req.body.itemModel,
    itemCategory: req.body.itemCategory,
    brandName: req.body.brandName,
    purchasePrice: parseInt(req.body.purchasePrice),
    purchaseDate: req.body.purchaseDate,
    salePrice: parseInt(req.body.salePrice),
    saleDate: req.body.saleDate === "" ? null : req.body.saleDate,
    purchaseContactMedium: req.body.purchaseContactMedium,
    sellContactMedium: req.body.sellContactMedium,
    purchaseMeetingLocation: req.body.purchaseMeetingLocation,
    sellMeetingLocation: req.body.sellMeetingLocation,
    buyerInfo: req.body.buyerInfo,
    sellerInfo: req.body.sellerInfo,
    sold: req.body.sold === "Yes" ? true : false,
    profit:
      parseInt(req.body.salePrice) > 0
        ? parseInt(req.body.salePrice) - parseInt(req.body.purchasePrice)
        : 0,
    notes: req.body.notes,
  };
  if (req.params.itemId) {
    db.SaleRecord.update(itemData, {
      where: {
        itemId: req.params.itemId,
      },
    })
      .then((dbSaleItem) => {
        console.log(dbSaleItem);
        let hbsObject = {
          saleRecordSaved: true,
          edit: true,
          itemId: req.params.itemId,
          companyName: req.session.userInfo.companyName,
          companyId: req.session.userInfo.companyId,
        };
        res.render("newSaleRecord", hbsObject);
      })
      .catch(function (err) {
        itemData.message = err.message;
        itemData.companyName = req.session.userInfo.companyName;
        itemData.companyId = req.session.userInfo.companyId;
        res.status(500).render("newSaleRecord", itemData);
      });
  } else {
    db.SaleRecord.create(itemData)
      .then((dbSaleItem) => {
        let hbsObject = {
          saleRecordSaved: true,
          itemId: dbSaleItem.dataValues.itemId,
          companyName: req.session.userInfo.companyName,
          companyId: req.session.userInfo.companyId,
        };
        res.render("newSaleRecord", hbsObject);
      })
      .catch(function (err) {
        itemData.message = err.message;
        itemData.companyName = req.session.userInfo.companyName;
        itemData.companyId = req.session.userInfo.companyId;
        res.status(500).render("newSaleRecord", itemData);
      });
  }
};

exports.GetItemDetails = async (req, res) => {
  db.SaleRecord.findOne({
    where: {
      itemId: req.params.itemId,
    },
    raw: true,
  }).then((dbSaleRecord) => {
    dbSaleRecord.companyName = req.session.userInfo.companyName;
    dbSaleRecord.companyId = req.session.userInfo.companyId;
    return res.render("itemDetails", dbSaleRecord);
  });
};

exports.GetItemEditPage = async (req, res) => {
  db.SaleRecord.findOne({
    where: {
      itemId: req.params.itemId,
    },
    raw: true,
  }).then((dbSaleRecord) => {
    dbSaleRecord.edit = true;
    dbSaleRecord.companyName = req.session.userInfo.companyName;
    dbSaleRecord.companyId = req.session.userInfo.companyId;
    return res.render("newSaleRecord", dbSaleRecord);
  });
};
