var gulp         = require("gulp"),
  watch          = require("gulp-watch"),
  plumber        = require("gulp-plumber"),
  sass           = require("gulp-sass"),
  autoPrefixer   = require("gulp-autoprefixer"),
  order          = require("gulp-order"),
  concat         = require("gulp-concat"),
  sourcemaps     = require("gulp-sourcemaps"), 
  rename         = require("gulp-rename"),
  bsync          = require("browser-sync").create()
  bsync2         = require("browser-sync").create()

// gulp gulp-watch gulp-plumber gulp-sass gulp-autoprefixer gulp-order gulp-concat gulp-sourcemaps gulp-rename browser-sync

// Files
// /////
var source = {
  css: 'src/sass/site.scss',
  js: [
    // Libaries
    'src/js/lib/jquery.js',
    'src/js/lib/bootstrap_custom.js'
        
    // Custom code
    'src/js/src/ultils.js',    
    'src/js/main.js'        
  ]
}

var distribute = {
  fileName: {
    css: 'site.css',
    js: 'site.js'
  },
  location: {
    css: '../assets/css/',
    js: '../assets/js/',
    img: '../assets/img/',
    font: '../assets/font/'
  }
}

var watcher = {
  css: 'src/sass/**/*.scss',
  js: 'src/js/**/*.js',
  php: '../php/**/*'
} 

// BROWSER SYNC
// ////////////
// creare object with options for bsync
var proxy1 = {
    proxy: "zzz.domain.hh/folder",
    host: "zzz.domain.hh",
    open: false
  }
var proxy2 = {
    proxy: "xxx.domain.hh/chaplin",
    host: "xxx.domain.hh",
    open: false
  }

// run bsync server
gulp.task('browserSync', ()=> 
  bsync.init(proxy1 , 
    // and next bsync2 server run inside
    ()=>bsync2.init(proxy2)
  )
) 


// style
// /////////
gulp.task('style', function() {
  return gulp.src(source.css)
    .pipe(plumber())
  // only source maps supported plugins here
    .pipe(sourcemaps.init())
      .pipe(sass().on('error',sass.logError))
      .pipe(autoPrefixer())
    .pipe(sourcemaps.write())
    .pipe(rename(distribute.fileName.css))
    .pipe(gulp.dest(distribute.location.css))
    .pipe(bsync.stream())
})


// JAVASCRIPT
// ///////////
gulp.task('javascript', function() {
  return gulp.src(source.js)
    .pipe(plumber())
  // only source maps supported plugins here
    .pipe(sourcemaps.init())
      .pipe(concat(distribute.fileName.js))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distribute.location.js))
})




// easy watcher | dev
// /////////////////
gulp.task('watch', function() {
  gulp.watch(watcher.css, ['style'])
  gulp.watch(watcher.js, ['javascript'])
})

gulp.task('dev', ['watch', 'style', 'javascript'])
gulp.task('default', ['watch', 'style', 'javascript'])




// browser sync watcher | bs
/////////////////////////
gulp.task('watchBs', ['browserSync'], function() {
  gulp.watch(watcher.css, ['style'])
  gulp.watch(watcher.js, ['javascript']).on('change', () => {bsync.reload; bsync2.reload})
  gulp.watch(watcher.php).on('change', () => {bsync.reload; bsync2.reload})
})
gulp.task('bs', ['watchBs', 'style', 'javascript'])

