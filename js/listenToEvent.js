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

// Read this: https://thewebdev.info/2020/08/05/using-classes-in-javascript/#:~:text=The%20most%20important%20thing%20to,declare%20and%20inherit%20complex%20objects.
// https://www.quora.com/Should-I-start-using-classes-in-JavaScript-for-cleaner-code
// https://everyday.codes/javascript/please-stop-using-classes-in-javascript/
// https://thewebdev.info/2020/07/21/javascript-refactoring%e2%80%8a-%e2%80%8afunctions-and-classes/
// https://dev.to/elijahtrillionz/building-a-project-with-javascript-classes-37me

//Test
function AddBall2(scene){
    const ball2 = getSphere(0.5)
    scene.add(ball2)
}