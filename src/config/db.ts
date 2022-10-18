import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
})

try {
  sequelize.authenticate()
  console.log('Database connection established.')
} catch (error) {
  console.error('Failed to connect to database.')
}

sequelize.sync({ alter: true })

export default sequelize
