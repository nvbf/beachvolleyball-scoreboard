var gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  handleErrors = require('../util/handle-errors'),
  fs = require('fs');

function createSingleBundle(path) {
  basedir = __dirname + '/../../';
  sourcefile = basedir + path.input;
  if (!fs.existsSync(sourcefile)) {
    throw new Error('Sourcefile ' + sourcefile + ' do not exist');
  }
  return gulp.src(sourcefile)
    .on('error', handleErrors)
    .pipe(gulp.dest(path.output));
}

function createBundles(bundles) {
  return bundles.forEach(function(bundle) {
    createSingleBundle(bundle);
  });
}

gulp.task('move-static', ['clean'], function() {
  return createBundles([
      {
        input: './src/css/app.css',
        output: './public/css'
      },
      {
        input: './src/css/bootstrap-3.3.1.css',
        output: './public/css/'
      },
      {
        input: './src/css/fonts/glyphicons-halflings-regular.eot',
        output: './public/fonts/'
      },
      {
        input: './src/css/fonts/glyphicons-halflings-regular.svg',
        output: './public/fonts/'
      },
      {
        input: './src/css/fonts/glyphicons-halflings-regular.ttf',
        output: './public/fonts/'
      },
      {
        input: './src/css/fonts/glyphicons-halflings-regular.woff',
        output: './public/fonts/'
      },
      {
        input: './src/css/fonts/glyphicons-halflings-regular.woff2',
        output: './public/fonts/'
      },
      {
        input: './src/index.html',
        output: './public/'
      }
    ]
  );
});
