var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {
  gulp.src(['./public/components/AdditionalAttributes.js', './public/components/Filter.js',
    './public/components/List.js', './public/components/IssueBoard.js'])
    .pipe(concat('issues.js'))
    .pipe(gulp.dest('./public/'))
});
