const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  const Transaction = sequelize.define("Transaction", {
    transactionId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    transactionUID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyUID: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    locationUID: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    transactionTerminal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountReceived: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    amountPaid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    posCharge: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preparedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss')
    }
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      onDelete: "cascade",
    });
  };

  return Transaction;
};
