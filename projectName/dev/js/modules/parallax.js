const parallax = document.querySelectorAll(".parallax");
const parallaxParent = document.querySelectorAll(".parallax-box");

window.addEventListener("scroll", function () {

  let offset = window.pageYOffset;

  parallaxParent.forEach(function (parallax, i) {
    const parallaxCurrent = document.querySelector(".parallax--" + (i + 1));
    console.log("Parallax " + i + ": " + parallax.offsetTop + " / Window: " + offset);

    parallaxCurrent.style.backgroundPositionY = (offset - parallax.offsetTop) * 0.7 + "px";

  });

});
