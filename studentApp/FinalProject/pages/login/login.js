// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/login/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            function toRegister() {
                var errors = "";
                var formData = {};
                $("#login-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var myUserName = formData.userName;
                var myPassword = formData.password;

                // client side error checking
                if (myUserName == "") {
                    errors += "Username must not be blank<br>";
                }

                if (myPassword == "") {
                    errors += "Password blank<br>";
                }

                if (errors) {
                    document.getElementById('divErrors').innerHTML = errors;
                    errors = "";        // reset clientside errors
                }

                else {
                    var uriString = "http://localhost:8080/login";
                    $.ajax({
                        url: uriString,
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        data: { username: myUserName, password: myPassword },
                        error: function (result) {

                            console.log(result.status);
                            if (result.status == 400) {
                                errors = "Username doesn't exist<br>" 
                            } 
                            else if (result.status == 410) {
                                errors = "Password doesn't match<br>";
                            }

                            document.getElementById('divErrors').innerHTML = errors;
                            errors = "";

                        },
                        // create session
                        success: function (result) {
                            var user = JSON.parse(result);
                            sessionStorage.setItem('username', user.username);
                            // clear user errors
                            document.getElementById('divErrors').innerHTML = "";
                            //WinJS.Navigation.navigate("/pages/edit/edit.html");
                        }
                    });
                }
            }

            // create button for register function
            var context = document.getElementById("login-form");
            var btn = document.createElement("input");
            btn.id = "add-btn";
            btn.type = "button";
            btn.value = "Login";
            btn.onclick = toRegister;
            context.appendChild(btn);
        },
    });
})();
