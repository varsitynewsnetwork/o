'use strict';

module.exports = {
  'src': {
    'root': 'lib'
  },
  'dist': {
    'root': 'dist'
  },
  'webpack': {
    entry: __dirname + '/../lib/main.js',
    output: {
      path: __dirname + '/../dist',
      filename: 'o.js'
    },
    resolve: {
      modulesDirectories: ['node_modules']
    },
    plugins: []
  }
};
