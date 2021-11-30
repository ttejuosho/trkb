module.exports = function (sequelize, DataTypes) {
  const TimeEntry = sequelize.define("TimeEntry", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    spent_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rounded_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    started_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ended_time: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    billable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    billable_rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost_rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return TimeEntry;
};
