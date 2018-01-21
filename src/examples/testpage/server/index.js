import flags from 'flags'
import express from 'express'
import pretty from 'pretty'
import path from 'path'

import {markupDoc} from '../../..'
import {page} from '../app'

flags.defineBoolean('pretty')
flags.parse()

const index = (_, res) => {
  res.write((flags.get('pretty') ? pretty : x => x)(markupDoc(page)))
  res.end()
}

const server = express()
server.get('/', index)
server.use('/client', express.static(path.join(__dirname, 'client')))
server.listen(8080, () => console.error('server started on port: 8080'))
