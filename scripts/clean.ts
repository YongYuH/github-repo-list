import fs from 'fs'
import path from 'path'

const preservedFileName = 'index.html'

const distDirectory = path.resolve(__dirname, '..', 'dist')

fs.readdir(distDirectory, (err, files) => {
  if (err) {
    console.error(err)
  }

  files.forEach((file) => {
    const fileDir = `${distDirectory}/${file}`

    if (file !== preservedFileName) {
      fs.unlinkSync(fileDir)
    }
  })
})
