var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var index = 0;
var songList;
var controlManger;
var audio = new root.audioControl();
function bindEvent() {

    $scope.on("play:change", function (event, index, flag) {
        audio.getAudio(songList[index].audio);
        if (audio.status == "play" || flag) {
            audio.play();
            root.pro.start();
        }
        root.pro.renderAllTime(songList[index].duration);
        root.render(songList[index]);
    })

    $scope.on("click", ".like-btn", function () {

        $(this).toggleClass("liking");
    })
    $scope.on("click", ".prev-btn", function () {
        var index = controlManger.prev();
        $scope.trigger("play:change", index);
        if (audio.status == "pause") {
            audio.pause();
            root.pro.update(0);
        } else {
            audio.play();
            root.pro.start();
        }
    })
    $scope.on("click", ".next-btn", function () {
        var index = controlManger.next();
        $scope.trigger("play:change", index);
        if (audio.status == "pause") {
            audio.pause();
            root.pro.update(0);
        } else {
            root.pro.start();
            audio.play();

        }
    })
    $scope.on("click", ".play-btn", function () {
        if (audio.status == "play") {
            $scope.find(".img-wrapper").removeClass("rotate");
            audio.pause();
            root.pro.stop();
        } else {
            $scope.find(".img-wrapper").addClass("rotate");
            audio.play();
            root.pro.start();
        }
        $(this).toggleClass("pause");
    })
}
// 实现拖拽
function bindTouch() {
    var $slider = $scope.find('.slider-pointer');
    var offset = $scope.find('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;
    $slider.on('touchstart', function () {
        root.pro.stop();
    }).on('touchmove', function (e) {
        var x = e.changedTouches[0].clientX;     
        var per = (x - left) / width;
        if (per > 0 && per <= 1) {
            root.pro.update(per);
            $scope.find(".img-wrapper").removeClass("rotate");
        }

    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX;     
        var per = (x - left) / width;
        if (per > 0 && per <= 1) {
            var curTime = per * songList[controlManger.index].duration;
            audio.playTo(curTime);
            $scope.find('.play-btn').addClass('pause');
            $scope.find(".img-wrapper").addClass("rotate");
            root.pro.start(per);

        }

    })

}
function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            root.render(data[0]);
            songList = data;
            bindEvent();
            bindTouch();
            controlManger = new root.controlManger(data.length);
            console.log(data)
            $scope.trigger("play:change", 0);

        },
        error: function () {
            console.log('error');
        }
    })
}
getData("../mock/data.json");