module.exports = function (sequelize, DataTypes) {
    const ItemModel = sequelize.define('ItemModel', {
        name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: null
        },
        ext: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: null
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'suspended', 'cancelled'),
            allowNull: false,
            defaultValue: 'active'
        },
        createdAt: {
            field: 'timestamp_created',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            field: 'timestamp_edited',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
    }, {
        tableName: 'item'
    });



    return ItemModel;
};