const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Authentication APIs',
    version: '1.0.0',
    description: 'API documentation for Authentication API'
  },
  components: {
    schemas: {
      Auth: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            description: 'Name of user'
          },
          email: {
            type: 'string',
            description: 'User email'
          },
          password: {
            type: 'string',
            description: 'User Password'
          },
          bio: {
            type: 'string',
            description: 'User biography (optional)'
          },
          phone: {
            type: 'string',
            description: 'User phone number (optional)'
          },
          photo: {
            type: 'string',
            description: 'User photo url (optional)'
          },
          isProfilePublic: {
            type: 'boolean',
            description: 'User preference for profile public or private'
          }
        },
        example: {
          name: 'John Doe',
          email: 'john@gmail.com',
          password: 'john1234',
          bio: 'A brief description of the user',
          phone: '+1234567890',
          photo: '',
          isProfilePublic: false
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/auth.routes.js',
    './src/routes/admin.routes.js',
    './src/routes/user.routes.js'
  ]
}

module.exports = options
