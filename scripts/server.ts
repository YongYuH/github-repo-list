import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'

const port = process?.env?.port ?? 3000

const Fastify = fastify()

Fastify.register(fastifyStatic, {
  root: path.resolve(__dirname, '..', 'dist'),
})

Fastify.listen(port, (err, address) => {
  if (err) throw err
  console.log(`Server is now listening on ${address}`)
})
