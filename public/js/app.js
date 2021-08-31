document.getElementById("registerText").addEventListener("click", function(event) {
  document.getElementById("card-container").setAttribute("style", "transform: rotateY(180deg)");
});

document.getElementById("loginText").addEventListener("click", function(event) {
  // alert("clicked");
  document.getElementById("card-container").setAttribute("style", "transform: rotateY(0deg)");
});
// document.getElementById("loginRegister").addEventListener("click", function(event) {
//   console.log("clicked");
//   event.preventDefault();
// });
