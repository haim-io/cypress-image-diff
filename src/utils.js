import fs from 'fs-extra'
import path from 'path'
import { PNG } from 'pngjs'

const createDir = dirs => {
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true})
    }
  })
}

const cleanDir = dirs => {
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.emptyDirSync(dir)
    }
  })
}

const readDir = dir => {
  return fs.readdirSync(dir)
}

const setFilePermission = (dir, permission) => {
  try {
    if (fs.existsSync(dir)) {
      const fd = fs.openSync(dir, 'r')
      fs.fchmodSync(fd, permission)
      fs.closeSync(fd)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

const renameAndMoveFile = (originalFilePath, newFilePath) => {
  fs.moveSync(originalFilePath, newFilePath, {overwrite: true})
}

const renameAndCopyFile = (originalFilePath, newFilePath) => {
  fs.copySync(originalFilePath, newFilePath, {overwrite: true})
}

const parseImage = async image => {
  return new Promise((resolve, reject) => {
    const fd = fs.createReadStream(image)
    fd.on('error', (error) => reject(error))
      .pipe(new PNG())
      // eslint-disable-next-line func-names
      .on('parsed', function() {
        const that = this
        resolve(that)
      })
  })
}

const adjustCanvas = async (image, width, height) => {
  if (image.width === width && image.height === height) {
    return image
  }

  const imageAdjustedCanvas = new PNG({
    width,
    height,
    bitDepth: image.bitDepth,
    inputHasAlpha: true,
  })

  PNG.bitblt(image, imageAdjustedCanvas, 0, 0, image.width, image.height, 0, 0)

  return imageAdjustedCanvas
}

const getRelativePathFromCwd = (dir) => {
  const relative = path.relative(process.cwd(), dir)
  return fs.existsSync(relative) ? relative : ''
}

const getCleanDate = (date) => {
  const source = date ? new Date(date) : new Date()
  return source
    .toLocaleString('en-GB')
    .replace(/(,\s*)|,|\s+/g, '_')
    .replace(/\\|\//g, '-')
    .replace(/:/g, '')
}

const writeFileIncrement = async (name, data, increment = 1) => {
  const filename = `${path.basename(name, path.extname(name))}${
    increment >= 2 ? `_${increment}` : ''
  }${path.extname(name)}`

  const absolutePath = path.join(path.dirname(name), filename)
  if (fs.existsSync(absolutePath) === false) return fs.writeFile(absolutePath, data)

  return writeFileIncrement(name, data, increment + 1)
}

export { createDir, cleanDir, readDir, parseImage, adjustCanvas, setFilePermission, renameAndMoveFile, renameAndCopyFile, getRelativePathFromCwd, getCleanDate, writeFileIncrement }
