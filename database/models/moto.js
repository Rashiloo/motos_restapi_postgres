'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Moto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Moto.init({
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    anio: DataTypes.INTEGER,
    cilindrada: DataTypes.INTEGER,
    precio: DataTypes.FLOAT,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Moto',
  });
  return Moto;
};