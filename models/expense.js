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
    expenseCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expenseAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expenseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  });

  return Expense;
};
