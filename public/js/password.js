// password.js
const pswdBtn = document.querySelector("#passwordBtn");

pswdBtn.addEventListener("click", function() {
    const pswdInput = document.getElementById("account_password");
    const pswdType = pswdInput.getAttribute("type");

    if (pswdType === "password") {
        pswdInput.setAttribute("type", "text");
        pswdBtn.innerHTML = "Hide Password";
    } else {
        pswdInput.setAttribute("type", "password");
        pswdBtn.innerHTML = "Show Password";
    }
});
