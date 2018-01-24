/* global __dirname console */

import express from "express"
import flags from "flags"
import {markupDoc} from "../../.."
import {page} from "../app"
import path from "path"
import pretty from "pretty"

flags.defineBoolean("pretty")
flags.parse()

function index(_, res) {
	res.write(
		(flags.get("pretty") ? pretty : x => x)(markupDoc(page))
	)
	res.end()
}

const server = express()
server.get("/", index)
server.use("/client", express.static(path.join(__dirname, "client")))
server.listen(8080, () => console.error("server started on port: 8080"))
