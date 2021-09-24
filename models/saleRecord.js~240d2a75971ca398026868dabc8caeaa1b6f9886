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
    itemModel: {
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
      allowNull: true,
    },
    saleDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    purchaseContactMedium: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sellContactMedium: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchaseMeetingLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sellMeetingLocation: {
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
      defaultValue: false,
    },
    profit: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return SaleRecord;
};
