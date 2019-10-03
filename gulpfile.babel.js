/**
 * @file: gulpfile.js
 * @desc: gulp 配置文件
 * @author: yiyh
 */
const  gulp = require('gulp');
const autoprefix = require('gulp-autoprefixer');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const del = require('del');
const fileinclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const babel = require('gulp-babel');

// gulp.task('jshint', function() {
//         gulp.src('./js/*.js')
//                 .pipe(jshint())
//                 .pipe(jshint.reporter('default'));
//});

gulp.task('js', cb => {
    return (
        gulp.src(['./js/*.js'])
            // .pipe(uglify())
            .pipe(eslint())
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(gulp.dest('./dist/js/'))
            .pipe(
                reload({
                    stream: true
                })
            )
    );
});

const lessStyle = () => {
    return gulp.src(['./css/*.less', '!./css/_*.less'])
        .pipe(less())
        .pipe(
            autoprefix({
                browsers: ['last 2 versions']
            })
        )
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(
            reload({
                stream: true
            })
        );
};
const cssStyle = () => {
    return gulp.src(['./css/*.css'])
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(
            reload({
                stream: true
            })
        );
};
gulp.task('less',
    gulp.series(cssStyle, lessStyle)
);
// gulp.task('less', cb => {
//     // 其余的样式文件都由style.less引入
//     let pipeStream = gulp.src(['./css/**.*'])
//         .pipe(less())
//         .pipe(
//             autoprefix({
//                 browsers: ['last 2 versions']
//             })
//         )
//         .pipe(cleanCSS())
//         .pipe(gulp.dest('./dist/css/'))
//         .pipe(
//             reload({
//                 stream: true
//             })
//         );
//     return pipeStream;
// });
gulp.task('html', () => {
    return gulp.src(['./page/*.html'])
        .pipe(
            fileinclude({
                prefix: '<!--@',
                suffix: '-->',
                basepath: './html_template'
            })
        )
        .pipe(gulp.dest('./dist/page/'))
        .pipe(
            reload({
                stream: true
            })
        );
});
gulp.task('img', () => {
    return gulp.src(['./img/**.*'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(gulp.dest('./dist/img/'))
        .pipe(
            reload({
                stream: true
            })
        );
});
gulp.task('browserSync', cb => {
    browserSync({
        server: {
            baseDir: ['./dist/']
        }
    });
});

gulp.task('watch', cb => {
    gulp.watch('./js/*.js', gulp.series('js'));

    gulp.watch('./css/*.less', gulp.series('less'));

    gulp.watch('./img/**.*', gulp.series('img'));
    gulp.watch(['./page/*.html', './html_template/*.html'], gulp.series('html'));
    cb();
});

gulp.task('clean', cb => {
    // return gulp.gulp.src(['dist/css/', 'dist/js/'])
    //     .pipe(clean({allowEmpty: true}));
    return del(['dist/css/', 'dist/js/', 'dist/page/']);
});

gulp.task('build', gulp.series('clean', 'html', 'less', 'js', 'img'));

gulp.task(
    'default',
    gulp.series('clean', 'less', 'js', 'img', 'html', 'watch', 'browserSync')
);
