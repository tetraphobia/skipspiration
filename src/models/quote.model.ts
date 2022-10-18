import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db.js'

export class Quote extends Model {
  declare id: number
  declare user: string
  declare quote: string
  declare created_at: Date
  declare updated_at: Date
}

Quote.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    user: { type: DataTypes.STRING, allowNull: false },
    quote: { type: DataTypes.STRING, allowNull: false }
  },
  {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'quotes'
  }
)
