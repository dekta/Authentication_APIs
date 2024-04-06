var ImageKit = require('imagekit')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

var imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_END_POINT
})

const uploadAndSaveUrl = async file => {
  try {
    const filename = uuidv4()
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: filename
    })
    const imageUrl = response.url
    return imageUrl
  } catch (err) {
    console.error('Error uploading file:', err)
    throw err
  }
}

module.exports = { uploadAndSaveUrl }
