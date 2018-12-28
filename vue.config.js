module.exports = {
  outputDir: '../server/public',
  devServer: {
    open: true,
    proxy: 'http://localhost:3000'
  },
}