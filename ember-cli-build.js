/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {});

  app.import('node_modules/deeplearn/dist/deeplearn.js');

  app.import('node_modules/deeplearn-knn-image-classifier/dist/bundle.js');

  return app.toTree();
};
