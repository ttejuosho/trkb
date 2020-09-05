module.exports = function(sequelize, DataTypes){
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
            defaultValue: 0
          },
          amountPaid: {
            type: DataTypes.INTEGER,
            defaultValue: 0
          },
          posDebitedAmount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
          }
    });

    Transaction.associate = models => {
      Transaction.belongsTo(models.Company, {
        onDelete: "cascade"
      });
    }
    
    return Transaction;
}