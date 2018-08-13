import { default as tsLint } from 'gulp-tslint';
import * as tsc from 'gulp-typescript';
import * as gulp from 'gulp';

const tsProject = tsc.createProject('tsconfig.json');

const lint = () => {
  tsProject
    .src()
    .pipe(tsLint())
    .pipe(tsLint.report());
  return gulp
    .src(['test/**/*.ts', 'test/*.ts'])
    .pipe(tsLint())
    .pipe(tsLint.report());
};

const build = () =>
  gulp
    .src(['api/**/*.ts'])
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));

gulp.task('build', build);
gulp.task('ts', build); // Alias

gulp.task('lint', lint);

gulp.task('default', gulp.parallel(lint, build));
