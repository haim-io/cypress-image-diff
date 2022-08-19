import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import paths from '../config'

export const generateTemplate = options => {
  const templateFile = fs.readFileSync(path.resolve(__dirname, '../reporter/template.hbs'), 'utf8')
  const template = Handlebars.compile(templateFile)

  return template(options)
}

export const createReport = options => {
  const template = generateTemplate(options)
  fs.writeFile(paths.report(options.instance), template, err => {
    if (err) throw err
  })
}
