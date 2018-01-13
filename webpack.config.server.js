const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  node: {
    // the state of the world: neither true or default works, only false :/
    __filename: false,
    __dirname: false
  }
}
