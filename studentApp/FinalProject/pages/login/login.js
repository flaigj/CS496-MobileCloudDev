// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/login/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            
            // Purpose: creates session key to hold student we want to edit on next page
            function findStudentKey(myUserName) {
                var uriStringStudent = "http://localhost:8080/student";
                $.ajax({
                    url: uriStringStudent,
                    datatype: 'json',
                    async: false,
                    type: "GET",
                    //cache: false,
                    error: function (result) {
                        console.log("Error somewhere");
                    },
                    // create session for student key so we know which student to edit
                    success: function (result) {
                        //console.log("Inside success findStudentKey");
                        var student = JSON.parse(result);
                        var j = 0;
                        for (i = 0; i < student.length; i++) {
                            //console.log("Enters loop");
                            if (student[i].username == myUserName) {
                                j = i;
                                //console.log("Enters if statement");
                            }
                        }
                        sessionStorage.setItem('key', student[j].key);
                    }
                });
            };

            // logs in if username and password match database values
            function login() {
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
                        async: false,
                        contentType: "application/x-www-form-urlencoded",
                        dataype: 'json',
                        data: { username: myUserName, password: myPassword },
                        error: function (result) {

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
                            
                            if (sessionStorage.getItem('username') == "admin") {
                                WinJS.Navigation.navigate("/pages/courses/courses.html");
                            }
                            else {
                                //console.log("At least not admin");
                                findStudentKey(myUserName);
                                WinJS.Navigation.navigate("/pages/edit/edit.html");                 
                            }
                            
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
            btn.onclick = login;
            context.appendChild(btn);
        },
    });
})();
