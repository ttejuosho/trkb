const moment = require("moment");
module.exports = function(sequelize, DataTypes){
    const Company = sequelize.define("Company", {
        companyId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        companyUID: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        companyEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            isEmail: true,
        },
        companyAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        companyCity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        companyState: {
            type: DataTypes.STRING,
            allowNull: true
        },
        companyPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        companyWebsite: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contactName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contactPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contactEmail: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss')
          },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss')
        }
    });

    Company.associate = (models) => {
        Company.hasMany(models.Location, {
            onDelete: 'cascade',
        });
    }

    return Company;
}