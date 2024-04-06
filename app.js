const express = require('express')

const { db_connection } = require('./src/config/db')
const { authRouter } = require('./src/routes/auth.routes')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const options = require('./src/utils/swagger')
const { adminRouter } = require('./src/routes/admin.routes')
const { userRouter } = require('./src/routes/user.routes')

const app = express()
app.use(express.json())

app.use('/user', authRouter)
app.use('/admin', adminRouter)
app.use('', userRouter)

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  db_connection
  console.log(`Server is running on port ${PORT}`)
})
