module.exports = function (sequelize, DataTypes) {
  const SaleRecord = sequelize.define("SaleRecord", {
    itemId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    salePrice: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    saleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contactMedium: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meetingLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyerInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sellerInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sold: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    profit: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return SaleRecord;
};
