'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Estimates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      })
      this.belongsTo(models.Task, {
        foreignKey: 'task_id',
      })
    }
  }
  Estimates.init(
    {
      task_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      estimate: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Estimates',
    }
  )
  return Estimates
}
