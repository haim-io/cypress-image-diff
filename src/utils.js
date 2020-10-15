import fs from 'fs-extra'
import { PNG } from 'pngjs'

const createDir = dirs => {
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true})
    }
  })
}

const parseImage = async image => {
  return new Promise((resolve, reject) => {
    const fd = fs.createReadStream(image)
    fd.pipe(new PNG())
      .on('parsed', () => {
        const that = this
        resolve(that)
      })
      .on('error', (error) => reject(error))
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

export { createDir, parseImage, adjustCanvas }
