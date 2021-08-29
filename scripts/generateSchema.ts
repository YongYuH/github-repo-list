import fs from 'fs'
import openapiTS from 'openapi-typescript'
import path from 'path'

const apiDescriptionYAMLUrl =
  'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.yaml'

const generateSchema = async () => {
  const output = await openapiTS(apiDescriptionYAMLUrl)
  fs.mkdir(path.resolve(__dirname, '..', 'types'), { recursive: true }, (err) => {
    if (err) {
      throw err
    }
  })
  fs.writeFile(path.resolve(__dirname, '..', 'types/generated-schema.ts'), output, (err) => {
    if (err) {
      throw err
    }
  })
}

generateSchema()
