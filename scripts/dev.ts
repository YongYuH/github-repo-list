import browserSync from 'browser-sync'
import { build, BuildOptions } from 'esbuild'
import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'

const protocal = process?.env?.port || 'http'
const host = process?.env?.port || 'localhost'
const port = process?.env?.port || 3000
const url = `${protocal}://${host}:${port}`

const Fastify = fastify()
const bs = browserSync.create()
const buildOptions: BuildOptions = {
  bundle: true,
  entryPoints: [path.resolve(__dirname, '..', 'src/index.tsx')],
  outdir: path.resolve(__dirname, '..', 'dist'),
  sourcemap: true,
  watch: {
    onRebuild: (error, result) => {
      if (error) {
        console.error('watch rebuild failed:', error)
      } else {
        console.log('watch rebuild succeeded: ', result)
        bs.reload()
      }
    },
  },
}

const devApp = async () => {
  try {
    await build(buildOptions)

    Fastify.register(fastifyStatic, {
      root: path.resolve(__dirname, '..', 'dist'),
    })

    Fastify.listen(port, (err, address) => {
      if (err) throw err
      console.log(`Server is now listening on ${address}`)
    })

    bs.init({
      proxy: url,
      ui: false,
    })
  } catch (e) {
    process.exit(1)
  }
}

devApp()
