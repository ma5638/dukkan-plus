const bcrypt = require('bcryptjs');


module.exports = (sequelize, DataTypes) => {
    const address = sequelize.define(
        'address',
        {
            address_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                comment: 'null',
                autoIncrement: true
            },
            customer_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                comment: 'null',
            },
            address_1: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: 'null'
            },
            address_2: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: 'null'
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: 'null'
            },
            region: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: 'null'
            },
            postal_code: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: 'null'
            },
            country: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: 'null'
            },
            // shipping_region_id: {
            //   type: DataTypes.INTEGER(11),
            //   allowNull: false,
            //   defaultValue: '1',
            //   comment: 'null'
            // },
        },
        {
            tableName: 'address',
            timestamps: false
        }
    );

    return address;
};
