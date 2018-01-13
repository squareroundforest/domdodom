import flags from 'flags'
import express from 'express'
import pretty from 'pretty'
import {markup} from '../domdodom'
import page from '../app'

flags.defineBoolean('pretty')
flags.parse()

const index = (_, res) => {
  res.write((flags.get('pretty') ? pretty : x => x)(markup(page)))
  res.end()
}

const client = (req, res) => {
  req.url = '/index.js'
  client.serve(req, res)
}

const server = express()
server.get('/', index)
server.use(express.static('client'))
server.listen(8080, () => console.error('server started on port: 8080'))
