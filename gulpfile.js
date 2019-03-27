var gulp = require("gulp");
var htmlclean = require("gulp-htmlclean");//这个是压缩html页面的插件
var imagemin = require("gulp-imagemin");//这个是压缩图片的插件
var uglify = require("gulp-uglify");
var strip = require("gulp-strip-debug");//这个是去掉调试语句
var concat = require("gulp-concat");//这个是拼接js文件的插件
var less = require("gulp-less");//这个是将less文件转变为css的插件
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");//这个是添加前缀的插件
var cssnano = require("cssnano");//压缩css代码
var connect = require("gulp-connect");//模拟一个服务器
// gulp.src()//读文件
// gulp.dest()//写文件
// gulp.task()//任务
// gulp.watch()//监听
var devMode = process.env.NODE_ENV == "development";

var folder = {
    src: "src/",//开发目录文件夹
    dist: "dist/"//压缩打包后目录文件夹
}
//用task创建一个html任务，创建完成后执行里面的 
gulp.task("html", function () {
    var page = gulp.src(folder.src + "html/*")//这个是取到src下所有的html
    // .pipe(connect.reload())//自动刷新
    if (!devMode) {
        page.pipe(htmlclean())//变成流文件
        page.pipe(gulp.dest(folder.dist + "html/"))
    }
})
//这个是操作images任务
gulp.task("images", function () {
    gulp.src(folder.src + "images/*")
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + "images/"))
})
//这个是操作js任务
gulp.task("js", function () {
    var page = gulp.src(folder.src + "js/*")
    // .pipe(connect.reload())
    if (!devMode) {
        page.pipe(strip())//这是在压缩前去掉调式语句
        page.pipe(uglify())
    }

    // page.pipe(concat('main.js'))//这个直接给拼接到了mian.js
    page.pipe(gulp.dest(folder.dist + "js/"))
})
//这是操作css文件
gulp.task("css", function () {

    var option = [autoprefixer(), cssnano()]
    var page = gulp.src(folder.src + "css/*")
        .pipe(less())
        // .pipe(connect.reload())
    if (!devMode) {
        page.pipe(postcss(option))
    }

    page.pipe(gulp.dest(folder.dist + "css/"))
})
//监听
gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"]);//监听完让它执行一个任务
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"]);
    gulp.watch(folder.src + "images/*", ["images"]);
})

gulp.task('webserver',function () {
    connect.server({
        livereload:true,
        port:8090
    });
});

gulp.task("default", ["html", "images", "js", "css", "watch","webserver"])


