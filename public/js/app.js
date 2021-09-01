// if on login card and "register" text is clicked, rotate to register card
document.getElementById("registerText").addEventListener("click", function(event) {
  document.getElementById("card-container").setAttribute("style", "transform: rotateY(180deg)");
});

// if on Register card and "login" text is clicked, rotate to login card
document.getElementById("loginText").addEventListener("click", function(event) {
  // alert("clicked");
  document.getElementById("card-container").setAttribute("style", "transform: rotateY(0deg)");
});

// "input" monitors changes as user types
document.getElementById("password1").addEventListener("input", function(e) {
  checkPasswordEquality();
});

// "input" monitors changes as user types
document.getElementById("password2").addEventListener("input", function(e) {
  checkPasswordEquality();
});

function checkPasswordEquality() {
  password1 = document.getElementById("password1").value;
  password2 = document.getElementById("password2").value;
  registerBtn = document.getElementById("registerBtn");
  if(password1 !== password2) {
      registerBtn.innerHTML = "passwords don't match";
      registerBtn.style.backgroundColor = "#CF0000";

      // disable the ability to submit form if password fields don't match
      registerBtn.setAttribute("type", "button");
      console.log(registerBtn.getAttribute("type"));
  } else {
    registerBtn.innerHTML = "Register";

    // eneable the ability to submit a form when password fields match
    registerBtn.setAttribute("type", "submit");
    registerBtn.style.backgroundColor = "#548CA8";
    console.log(registerBtn.getAttribute("type"));
  }
}
