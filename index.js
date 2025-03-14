const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
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

let lines = [
  {
    "id": 1,
    "number": "1",
    "active": true,
    "trasbordo": false,
    "zone": "Avenida vieja"
  },
  {
    "id": 2,
    "number": "2",
    "active": true,
    "trasbordo": false,
    "zone": "Centro"
  },
  {
    "id": 3,
    "number": "3",
    "active": true,
    "trasbordo": true,
    "zone": "Barriada de la paz"
  },
  {
    "id": 4,
    "number": "4",
    "active": false,
    "trasbordo": false,
    "zone": "Astillero 1"
  },
  {
    "id": 5,
    "number": "5",
    "active": true,
    "trasbordo": false,
    "zone": "Avenida nueva"
  },
  {
    "id": 6,
    "number": "6",
    "active": false,
    "trasbordo": false,
    "zone": "Astillero 2"
  },
  {
    "id": 7,
    "number": "7",
    "active": true,
    "trasbordo": true,
    "zone": "Playa"
  },
  {
    "id": 8,
    "number": "8",
    "active": true,
    "trasbordo": true,
    "zone": "Playa"
  }
]

app.use(requestLogger);

app.get(`${ baseURL }/`, (request, response) => {
  response
    .send('<h1>Hello World!</h1>')
})

app.get(`${ baseURL }/lines`, (request, response, next) => {
  response
    .json(lines);

  next();
}, testFin);

app.get(`${ baseURL }/lines/:id`, (request, response) => {
  const id = Number(request.params.id)
  const line = lines.find((line) => line.id === id)

  if (line) {
    response
      .json(line)
  } else {
    response
      .status(404)
      .end()
  }
})

app.put(`${ baseURL }/lines/:id`, (request, response) => {
  const { body } = request
  const { id, trasbordo } = body

  if (!id) {
    return response
      .status(400)
        .json({ 
          error: 'No hay ID' 
        })
  }

  const lineIndex = lines.findIndex((line) => line.id === id);
  if (lineIndex === -1) {
    return response
      .status(404)
      .json({ error: "Linea no encontrada" });
  }
  lines[lineIndex].trasbordo = trasbordo;

  response
    .status(204)
    .end();
})

app.post(`${ baseURL }/lines`, (request, response) => {
  const { body } = request
  const { id } = body

  if (!id) {
    return response
      .status(400)
        .json({ 
          error: 'No hay ID' 
        })
  }

  const isLines = lines.some((line) => line.id === Number(id))
  if (isLines) {
    return response
      .status(400)
        .json({ 
          error: 'Ya existe Linea' 
        })
  }

  lines = lines.concat(body)
  response
    .json(body)
})

app.delete(`${ baseURL }/lines/:id`, (request, response) => {
  const id = Number(request.params.id);
  const lineIndex = lines.findIndex((line) => line.id === id);

  if (lineIndex === -1) {
    return response
      .status(404)
      .json({ error: "Linea no encontrada" });
  }

  lines.splice(lineIndex, 1);
  response
    .status(204)
    .end();
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})