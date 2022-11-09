module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define("Customer", {
    customerId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    customerExternalId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    privilege: {
      type: DataTypes.ENUM,
      defaultValue: "Basic",
      values: ["Basic", "Admin", "Super Admin", "Other"],
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiresOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    registeredOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    lastLoginDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Customer.associate = (models) => {
    Customer.hasMany(models.Tracker, {
      onDelete: "cascade",
    });
  };

  return Customer;
};
