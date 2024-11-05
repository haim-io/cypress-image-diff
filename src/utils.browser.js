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
        .replace(/\[specName\]/, specName.replace(/\.(js|jsx|ts|tsx)$/, ''))
        .replace(/\[browserName\]/, browserName)
        .replace(/\[width\]/, width)
        .replace(/\[height\]/, height)
        .replace(/[^a-z0-9_\-/.]/gi, '')
    ) // remove anything that's not a letter, a number, a dash, an underscore or a dot.
  }
  
  export { getFileName }
  