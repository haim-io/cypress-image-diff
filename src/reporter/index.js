import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import paths from '../config'

const handlebarsHelpers = () => {
  Handlebars.registerHelper('testStateIcon', status => {
    if (status === 'pass') {
      return '<span class="success">&#10004;</span>'
    }
    return '<span class="error">&#10006;</span>'
  })

  Handlebars.registerHelper('equal', (lvalue, rvalue, options) => {
    // eslint-disable-next-line no-undef
    if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters")
    if(lvalue !== rvalue) {
      return options.inverse(this)
    }
    return options.fn(this)
  })
}

export const generateTemplate = options => {
  handlebarsHelpers()
  const templateFile = fs.readFileSync(path.resolve(__dirname, '../reporter/template.hbs'), 'utf8')
  const template = Handlebars.compile(templateFile)

  return template(
    options,
    {
      allowProtoPropertiesByDefault: {
        testStatus: true,
        name: true,
      },
    }
  )
}

export const createReport = options => {
  const template = generateTemplate(options)
  fs.writeFile(paths.report(options.instance), template, err => {
    if (err) throw err
  })
}
