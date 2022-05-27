// Global variable
let playMusic = false

$(".controls-music-btn").click(() => {
    if (!playMusic) {
        playMusic = true;
        $("#audio").get(0).play();
        $(".controls-music-btn").addClass("active");
    } else {
        playMusic = false;
        $("#audio").get(0).pause();
        $(".controls-music-btn").removeClass("active");
    }
});
