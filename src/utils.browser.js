/* eslint-disable import/prefer-default-export */
const getFileName = ({
    nameTemplate,
    givenName,
    specName,
    browserName,
    width,
    height,
  }) => {
    return (
      nameTemplate
        .replace(/\[givenName\]/, givenName)
        // IN-QUEUE-FOR-BREAKING-CHANGE: should remove all spec file name extensions, instead of removing only .js extension
        .replace(/\[specName\]/, specName.replace('.js', ''))
        .replace(/\[browserName\]/, browserName)
        .replace(/\[width\]/, width)
        .replace(/\[height\]/, height)
        .replace(/[^a-z0-9_\-/.]/gi, '')
    ) // remove anything that's not a letter, a number, a dash, an underscore or a dot.
  }
  
  export { getFileName }
  