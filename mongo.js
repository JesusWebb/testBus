// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// console.log(process.argv[2])
// console.log(process.argv[3])
// console.log(process.argv[4])

// const url =
// `mongodb+srv://jesuscasesl:${password}@cluster0.pcozc.mongodb.net/cadizBus?retryWrites=true&w=majority&appName=Cluster0`
// // `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`


// mongoose.set('strictQuery',false)

// mongoose.connect(url)

// LINE
// const lineSchema = new mongoose.Schema({
//   id: String,
//   number: Number,
//   active: Boolean,
//   trasbordo: Boolean,
//   zone: String
// })
// const Line = mongoose.model('Line', lineSchema)

// "POST"
// const line = new Line({
//   id: 8,
//   number: "8",
//   active: true,
//   trasbordo: false,
//   zone: "Astilleros 3"
// })
//
// line
//  .save()
//  .then((result) => {
//    console.log('line saved!')
//     mongoose.connection.close()
//  })

// GET
// Line
//   .find({})
//   .then((result) => {
//     result.forEach((line) => console.log(line))
//     mongoose.connection.close()
// })

// GET > zona includes "stilleros"
// Line
//   .find({ zone: { $regex: 'Astilleros', $options: 'i' } })
//   .then((result) => {
//     result.forEach((line) => console.log(line))
//     mongoose.connection.close()
// })