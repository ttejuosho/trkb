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
    transactionAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    transactionCharge: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    posCharge: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    estimatedProfit: {
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
      isEmail: true,
    },
    preparedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    amendedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forReview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      onDelete: "cascade",
    });
  };

  return Transaction;
};
