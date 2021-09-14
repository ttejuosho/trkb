module.exports = function (sequelize, DataTypes) {
  const Log = sequelize.define("Log", {
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      isEmail: true,
    },
    companyUID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locationUID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apiEndpoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Log;
};
