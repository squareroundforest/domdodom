/* global require module */

const nodeExternals = require("webpack-node-externals")

module.exports = {
	target: "node",
	externals: [nodeExternals()],
	node: {
		__filename: false,
		__dirname: false,
	},
}
