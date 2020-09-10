module.exports = function(sequelize, DataTypes){
    const Location = sequelize.define("Location", {
        locationId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        locationUID: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        companyUID: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        locationName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        locationEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            isEmail: true,
        },
        locationAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationCity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationState: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationContactName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationContactPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        locationContactEmail: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: true
        }
    });

    Location.associate = (models) => {
        Location.belongsTo(models.Company, {
          onDelete: 'cascade',
        });
    }

    return Location;
};