const fastify = require('fastify')({ logger: true })

//para mongodb
//require('./connection/config.js')

fastify.register(require('./routes/customer.js'),
    require('./routes/user.js'))

    fastify.get('/prueba', async (request, reply) => {
        return { hello: 'world' }
      })

// Run the server!
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })