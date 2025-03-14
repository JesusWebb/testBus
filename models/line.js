const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const lineSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  trasbordo: Boolean,
  zone: String
});
lineSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})




module.exports = mongoose.model('Line', lineSchema)