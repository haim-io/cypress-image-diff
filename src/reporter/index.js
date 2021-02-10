import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

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
        if (lvalue !== rvalue) {
            return options.inverse(this)
        }
        return options.fn(this)
    })
}

export const generateTemplate = (reportData) => {
    handlebarsHelpers()
    const templateFile = fs.readFileSync(path.resolve(__dirname, '../reporter/template.hbs'), 'utf8')
    const template = Handlebars.compile(templateFile)
    return template(
        reportData,
        {
            allowProtoPropertiesByDefault: {
                testStatus: true,
                name: true,
            },
        }
    )
}

// This method could be improved in case there is a need to save multiple report files
export const createReport = (tests, paths) => {
    const dirs = {
        baseline: path.relative( paths.dir.report, paths.dir.baseline),
        comparison: path.relative( paths.dir.report, paths.dir.comparison),
        diff: path.relative( paths.dir.report, paths.dir.diff)
    }
    const template = generateTemplate({title: 'Cypress Visual Regression', paths: dirs, tests})
    
    fs.writeFile(paths.report(), template, err => {
        if (err) throw err
    })
}
