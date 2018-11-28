const bgMove = document.querySelector(".hero");
bgMove.addEventListener("mousemove", function (e) {
  var halfY = parseFloat(bgMove.style.backgroundPositionY.replace("px", "") * .5);
  var halfX = parseFloat(bgMove.style.backgroundPositionX.replace("px", "") * .5);
  var x = ((e.pageX - halfX) * (-4 / 15));
  var y = ((e.pageY - halfY) * (-1 / 15));
  bgMove.style.backgroundPosition = x + "px " + y + "px";
});
