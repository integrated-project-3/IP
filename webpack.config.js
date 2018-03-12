const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,,
        loader: 'vue-loader'
        use: [
          'vue-style-loader',
          'css-loader'
        ],
        options: {
          transformToRequire: {
            'img': 'src',
            'image': 'xlink:href',
            'b-img': 'src',
            'b-img-lazy': ['src', 'blank-src'],
            'b-card': 'img-src',
            'b-card-img': 'img-src',
            'b-carousel-slide': 'img-src',
            'b-embed': 'src'
          }
        }
      }
    ]
  }
};
