var gulp = require('gulp')
var ts = require('gulp-typescript')
var merge = require('merge-stream')

var deploy = require('gulp-ml-uservices').deploy
var generateMLSpec = require('gulp-ml-uservices').generateMLSpec
var generateSchema = require('gulp-typescript-schema').generateSchema
var generateDatabaseSpec = require('gulp-ml-admin').generateDatabaseSpec
var database = require('gulp-ml-admin').database
var path = require('path')

var watchify = require('watchify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gutil = require('gulp-util')
var sourcemaps = require('gulp-sourcemaps')
var assign = require('lodash.assign')
var fs = require('fs')
var tsify = require('tsify')
var brfs = require('brfs')

//var compilerOptions = JSON.parse(fs.readFileSync('./tsconfig.json').toString()).compilerOptions

gulp.task('compileClient', function() {
  var opts = assign({}, watchify.args, {
    debug: !gulp.env.production,
    basedir: path.join(__dirname, 'dist', 'lib', 'client')
  })
  var b = watchify(browserify(opts).add(path.join(opts.basedir, 'index.js')).transform(brfs))
  b.on('update', bundle)
  b.on('log', gutil.log)

  function bundle() {
    return b.bundle()
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(path.join(__dirname, 'dist', 'www')))
  }

  return bundle()
})

gulp.task('copyBrowserAssets', function(){
  return gulp.src('./www/**/*')
    .pipe(gulp.dest('./dist/www'))
})

gulp.task('client-deploy', ['copyClientAssets', 'compileClient'], function(){})

gulp.task('generate', function() {
  var schema = gulp.src('lib/**/*.ts').pipe(generateSchema({
    path: './assets/schema.json'
  }))
  var specs = schema.pipe(generateMLSpec({
    path: './assets/specs.json'
  }))
  var databaseSpec = schema.pipe(generateDatabaseSpec({
    path: './assets/databaseSpec.json'
  }))

  return merge(schema.pipe(gulp.dest('dist')), specs.pipe(gulp.dest('dist')), databaseSpec.pipe(gulp.dest('dist')))
})

// TODO
// gulp.task('createDatabase', [], function(){
//   return gulp.src('dist/assets/databaseSpec.json').pipe(database({
//     action: 0,
//     user: {
//       name: 'admin',
//       password: 'passw0rd'
//     }
//   }))
// })
//
// gulp.task('clearDatabase', ['generate'], function(){
//   return gulp.src('dist/assets/databaseSpec.json').pipe(database({
//     action: 2,
//     user: {
//       name: 'admin',
//       password: 'passw0rd'
//     }
//   }))
// })

gulp.task('ml-deploy', function() {
  return gulp.src('lib/database/chatService.ts').pipe(deploy(path.posix.join(__dirname, 'lib/'), {
    password: 'passw0rd',
    port: 8000
  }, {
    password: 'passw0rd',
    port: 8000
  }, 'http://localhost:8080/mlListener/', gulp.src('dist/assets/schema.json'), gulp.src('dist/assets/specs.json')))
})

//gulp.task('default', ['generate'], function(){})
//gulp.task('default', ['ml-deploy'], function(){})
