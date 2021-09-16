module.exports = function (sequelize, DataTypes) {
  const Expense = sequelize.define("Expense", {
    expenseId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expenseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Expense;
};
