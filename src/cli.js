import arg from 'arg'
import colors from 'colors/safe'
import fs from 'fs-extra'

import buildPaths from './config'
import { readDir } from './utils'

const parseArgumentsIntoOptions = rawArgs => {
 const args = arg(
   {
     '--baseDir': String,
     '--update': Boolean,
     '-u': '--update',
   },
   {
     argv: rawArgs.slice(2),
   }
 )

 return {
   updateBaseline: args['--update'] || false,
 }
}

// eslint-disable-next-line import/prefer-default-export
export function cli(args) {
  const options = parseArgumentsIntoOptions(args)
  const paths = buildPaths(options.baseDir)
 if (options.updateBaseline) {
   // Only update image if it failed the comparison
   const filesToUpdate = readDir(paths.dir.diff)
   if (filesToUpdate) {
     filesToUpdate.forEach(file => {
       fs.copySync(`${paths.dir.comparison}/${file}`, `${paths.dir.baseline}/${file}`)
       console.log(colors.green(`Updated baseline image ${file}`))
     })
   } else {
    const output = 'No baselines to be updated. Make sure to run the visual tests before running update.'
    console.log(colors.yellow(output))
   }
 }
}
