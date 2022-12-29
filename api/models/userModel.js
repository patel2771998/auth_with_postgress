'use strict';

module.exports = function (sequelize, DataTypes) {
    const UserModel = sequelize.define('UserModel', {
        user_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email:{
            type: DataTypes.STRING,
            allowNull: true
        },
        state:{
            type: DataTypes.STRING,
            allowNull: true
        },
        material_status :{
            type: DataTypes.ENUM('unmarried', 'divorced','any'),
            allowNull: false,
            defaultValue: 'unmarried'
        },
        father_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        mother_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        dob:{
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        city:{
            type: DataTypes.STRING,
            allowNull: true
        },
        heigth:{
            type: DataTypes.STRING,
            allowNull: true
        },
        gender:{
            type: DataTypes.STRING,
            allowNull: true
        },
        phone1:{
            type: DataTypes.STRING,
            allowNull: true
        },
        phone2:{
            type: DataTypes.STRING,
            allowNull: true
        },
        income:{
            type: DataTypes.STRING,
            allowNull: true
        },
        occupation:{
            type: DataTypes.STRING,
            allowNull: true
        },
        education:{
            type: DataTypes.STRING,
            allowNull: true
        },
        siblings:{
            type: DataTypes.STRING,
            allowNull: true
        },
        address1:{
            type: DataTypes.STRING,
            allowNull: true
        },
        address2:{
            type: DataTypes.STRING,
            allowNull: true
        },
        father_occupations :{
            type: DataTypes.STRING,
            allowNull: true
        },
        father_education :{
            type: DataTypes.STRING,
            allowNull: true
        },
        mother_occupations :{
            type: DataTypes.STRING,
            allowNull: true
        },
        mother_education :{
            type: DataTypes.STRING,
            allowNull: true
        },
        marriage_budget:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'pending','suspended','cancelled'),
            allowNull: false,
            defaultValue: 'active'
        },
        role:{
            type: DataTypes.ENUM('end_user', 'admin','manager'),
            allowNull: false,
            defaultValue: 'manager'
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
        tableName: 'users'
    });
    return UserModel;
};