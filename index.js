require('dotenv').config()
const express = require('express')
const cors = require('cors')

const Line = require('./models/line')
const Parada = require('./models/parada')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());


const baseURL = '/api/v1'

const requestLogger = (request, response, next) => {
  console.log('---------------------')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---------------------')
  next()
}

const testFin = (request, response, next) => {
  console.log('++++++')
  console.log('FIN')
  console.log('++++++')
}

const unknownEndpoint = (request, response) => {
  response
    .status(404)
    .send({ error: 'Endpoint Desconocido' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response
      .status(400)
      .send({ error: 'malformatted id' })
  }

  return response
      .status(400)
      .send({ error: `'another err' ${ error }` })
}

app.get(`${ baseURL }/`, (request, response) => {
  response
    .send('<h1>Hello World!</h1>')
})

app.get(`${ baseURL }/lines`, (request, response, next) => {
  Line
    .find({})
    .then((lines) => {
      if (lines) {
        response
          .json(lines)
      } else {
        response
          .status(404)
          .send({ error: 'Lines not found' })
      }
    })
    .catch((error) => next(error))

  next();
}, testFin);

app.get(`${ baseURL }/lines/:id`, (request, response, next) => {
  const id = Number(request.params.id)
  
  // const line = lines.find((line) => line.id === id)
  // if (line) {
  //   response
  //     .json(line)
  // } else {
  //   response
  //     .status(404)
  //     .end()
  // }
  Line.find({ id: id })
    .then((line) => {
      if (line) {
        response
          .json(line)
      } else {
        response
          .status(404)
          .send({ error: 'Id not found' })
      }
    })
    .catch((error) => next(error))
})

app.put(`${ baseURL }/lines/:id`, (request, response, next) => {
  const id = Number(request.params.id)
  const { body } = request
  const { trasbordo } = body

  if (!id) {
    return response
      .status(400)
      .send({ error: 'Id not found' })
  }

  // const lineIndex = lines.findIndex((line) => line.id === id);
  // if (lineIndex === -1) {
  //   return response
  //     .status(404)
  //     .json({ error: "Linea no encontrada" });
  // }
  // lines[lineIndex].trasbordo = trasbordo;

  // response
  //   .status(204)
  //   .end();

  Line.findOneAndUpdate( { id: id }, { trasbordo }, { new: true, runValidators: true })
    .then((updatedLine) => {
      if (!updatedLine) {
        return response
          .status(404)
          .send({ error: 'Lines not found' })
      }
      response
        .json(updatedLine);
    })
    .catch((error) => next(error))
})

app.post(`${ baseURL }/lines`, (request, response, next) => {
  const { body } = request
  const { id } = body

  if (!id) {
    return response
      .status(400)
      .send({ error: 'Id not found' })
  }

  // const isLines = lines.some((line) => line.id === Number(id))
  // if (isLines) {
  //   return response
  //     .status(400)
  //       .json({ 
  //         error: 'Ya existe Linea' 
  //       })
  // }

  const line = new Line(body)
  line
    .save()
    .then((savedLine) => {
      response
        .json(savedLine)
    })
    .catch((error) => next(error))
})

app.delete(`${ baseURL }/lines/:id`, (request, response, next) => {
  const id = Number(request.params.id); 
  // const lineIndex = lines.findIndex((line) => line.id === id);

  // if (lineIndex === -1) {
  //   return response
  //     .status(404)
  //     .json({ error: "Linea no encontrada" });
  // }

  // lines.splice(lineIndex, 1);
  // response
  //   .status(204)
  //   .end();

  console.log(id)
  Line.findOneAndDelete({ id: id })
    .then((result) => {
      if (!result) {
        return response
          .status(404)
          .send({ error: 'Linea not found' })
      }
      response
        .status(204)
        .end()
    })
    .catch((error) => next(error))
})

app.use(requestLogger);
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})