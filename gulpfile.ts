import * as gulp from 'gulp'
import * as ts from 'gulp-typescript'
import merge = require('merge-stream')

import {deploy} from 'gulp-ml-uservices'
import {generateMLSpec} from 'gulp-ml-uservices'
import {generateSchema} from 'gulp-ts-schema'

let tsProject = ts.createProject('tsconfig.json')

gulp.task('generate', function() {
  let schema = gulp.src('src/**/*.ts').pipe(generateSchema({
    path: './assets/schema.json'
  }))
  let specs = schema.pipe(generateMLSpec({
    path: './assets/specs.json'
  }))

  return merge(schema.pipe(gulp.dest('dist')), specs.pipe(gulp.dest('dist')))
})

gulp.task('compile', function() {
  return tsProject.src().pipe(ts(tsProject)).js.pipe(gulp.dest('dist'))
})

gulp.task('ml-deploy', ['generate', 'compile'], function() {
  return gulp.src('src/**/*.ts').pipe(deploy({
    password: 'passw0rd',
    database: 'chatDemo',
    user: 'admin'
  }, 'http://localhost:8080/mlListener', gulp.src('dist/assets/schema.json'), gulp.src('dist/assets/specs.json')))
})
