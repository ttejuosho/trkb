module.exports = function (sequelize, DataTypes) {
  const Tracker = sequelize.define("Tracker", {
    trackerId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vehicleYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehicleMake: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleModel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licensePlateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imei: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gpsDevice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    simCardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    protocol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    netProtocol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    port: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastConnectionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiresOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return Tracker;
};
