﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/registration/registration.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            // Precondition: registerUser ajax call must be successful
            // Purpose: creates session key to hold student we want to edit on next page
            function createStudent(myUserName) {
                var uriStringStudent = "http://localhost:8080/student";
                $.ajax({
                    url: uriStringStudent,
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    datatype: "json",
                    async: false,
                    data: { username: myUserName },
                    error: function (result) {
                        //console.log("ERROR?");
                    },
                    // create session for student key so we know which student to edit
                    success: function (result) {

                        findStudentKey(myUserName);
                    }
                });
            };

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
                        console.log("KEY ME" + sessionStorage.getItem('key'));
                    }
                });
            };


            // registers user if no errors
            function registerUser() {
                var errors = "";
                var formData = {};
                $("#register-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var myUserName = formData.userName;
                var myPassword = formData.password;
                var myPasswordConfirm = formData.passwordConfirm;

                // client side error checking
                if (myUserName == "") {
                    errors += "Username must not be blank<br>";
                }

                if (myPassword == "") {
                    errors += "Password blank<br>";
                }

                if (myPasswordConfirm == "") {
                    errors += "Password confirmation must not be blank<br>";
                }

                if (myPassword != myPasswordConfirm) {
                    errors += "Passwords must be same<br>";
                }
                
                if (errors) {
                    document.getElementById('divErrors').innerHTML = errors;
                    errors = "";        // reset clientside errors
                }

                else {
                    

                    var uriString = "http://localhost:8080/register";
                    $.ajax({
                        url: uriString,
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        datatype: 'json',
                        //async: false,
                        data: { username: myUserName, password: myPassword },
                        error: function(result){
                            // username already exists; clientside error checking supresses all other 400 codes
                            if (result.status == 400) {
                                errors = "Username already exists<br>";
                                document.getElementById('divErrors').innerHTML = errors;
                                errors = "";
                            }
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
                                createStudent(myUserName);
                                WinJS.Navigation.navigate("/pages/edit/edit.html");
                            }                                                     
                        }
                    });
                }
            }

            // create button for register function
            var context = document.getElementById("register-form");
            var btn = document.createElement("input");
            btn.id = "add-btn";
            btn.type = "button";
            btn.value = "Register";
            btn.onclick = registerUser;
            context.appendChild(btn);
        },
    });
})();
