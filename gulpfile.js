const gulp = require("gulp");
      sass = require("gulp-sass");
      concat = require("gulp-concat");
      autoprefixer = require("gulp-autoprefixer");
      del = require("del");
      browserSync = require("browser-sync").create();
      miniJS = require("gulp-js-minify");
      uglify = require("gulp-uglify");
      terser = require("gulp-terser");
// const cleanCss = require("gulp-clean-css");
      imagemin = require("gulp-imagemin");
// Bсе пути к файлам записанны в обьект path
const path = {
    dist:{
        html:'dist',
        css:'dist/css',
        js:'dist/js',
        img : 'dist/img',
        ico: 'dist/favicon',
        self:'dist'
    },
    src : {
        html:'src/*.html',
        scss : 'src/scss/**/*.scss',
        js : 'src/js/*.js',
        img: 'src/img/**/**/*.*',
        ico: 'src/favicon/*.*',
    }
};

// Описание тасков:
//
// 1. УДАЛЕНИЮ СОДЕРЖИМОГО В DIST
const Del = () =>
    del(['dist'])
;
// 2.Компиляция изображения
 const imgBuild = () => (
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream())
);
// 3. Компиляция SACC в CSS. Конкатенация и минификация всех Файлов
const minCssBuild = () =>
            gulp.src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
                .pipe(concat("styles.min.css"))
                .pipe(autoprefixer({
                    cascade: false
                }))
        .pipe(gulp.dest(path.dist.css))
                .pipe(browserSync.stream());

// 4. Конкатенация и минификация всех Файлов JS
const minJSBuild = () =>
     gulp.src(path.src.js)
         .pipe(concat('script.min.js'))
         .pipe(terser({toplevel:true}))
         .pipe(miniJS())
         .pipe(uglify())
         .pipe(gulp.dest(path.dist.js))
         .pipe(browserSync.stream())
;
// 5. перемещение HTML отслеживания изменений
const htmlBuild = () =>
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.stream());

    // 6. БРАУЗЕР СИНК, не могу понять правильно ли прописал
const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch(path.src.html, htmlBuild).on('change',browserSync.reload);
    gulp.watch(path.src.scss, minCssBuild).on('change',browserSync.reload);
    gulp.watch(path.src.js, minJSBuild).on('change',browserSync.reload);
    gulp.watch(path.src.img, imgBuild).on('change',browserSync.reload);
};


// ПЕРЕЧЕНЬ ЗАДАННЫХ ТАСКОВ
gulp.task("build", gulp.series(Del, htmlBuild, imgBuild, minCssBuild, minJSBuild));
gulp.task ("dev", gulp.parallel(watcher));


