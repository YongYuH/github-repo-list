import { build, BuildOptions } from 'esbuild'
import path from 'path'

const buildOptions: BuildOptions = {
  bundle: true,
  entryPoints: [path.resolve(__dirname, '..', 'src/index.tsx')],
  outdir: path.resolve(__dirname, '..', 'dist'),
  sourcemap: true,
}

const buildApp = async () => {
  try {
    await build(buildOptions)
  } catch (e) {
    process.exit(1)
  }
}

buildApp()
