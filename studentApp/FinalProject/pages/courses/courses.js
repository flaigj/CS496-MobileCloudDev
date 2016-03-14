// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/courses/courses.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            // dropdown list for updating courses
            function createDropDownList() {
                var uriStringDD = "http://localhost:8080/course";
                $.ajax({
                    url: uriStringDD,
                    datatype: 'json',
                    type: 'get',
                    //cache: false,
                    success: function (data) {
                        var form = "";
                        var course = JSON.parse(data);

                        // create dynamic drop down list
                        for (var i = 0; i < course.length; i++) {
                            var element = document.getElementById("course_del");
                            var option = document.createElement("option");
                            option.value = course[i].key;
                            option.innerText = course[i].name;
                            element.appendChild(option);
                        }
                    }
                })
            };

            function deleteCourse() {
                var formData = {};
                $("#course-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var course_key = formData.course_delete;
                // if user entered errors go navigate home
                    var uriString = "http://localhost:8080/deleteCourse";
                    $.ajax({
                        url: uriString,
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        datatype: 'json',
                        data: { key: course_key },
                        success: function (result) {
                    }
                });
            }

            function addCourse() {
                error = false;
                var errors = "";
                var formData = {};
                $("#course-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var course_name = formData.course_name;
                var course_days = formData.course_days;
                var course_time = formData.course_time;
                // if user entered errors go navigate home
                if (course_name == "") {
                    error = true;
                    errors += "Course name must not be blank<br>";
                }

                if (course_days == "" || course_time == "") {
                    error = true;
                    errors += "Course days or time must not be blank<br>";
                }

                if (error == false) {
                    var uriString = "http://localhost:8080/course";
                    $.ajax({
                        url: uriString,
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        datatype: 'json',
                        data: { name: course_name, days: course_days, time: course_time },
                        success: function (result) {
                        }
                    });
                }

                if (error == true) {
                    document.getElementById("divErrors") = errors;
                }
            };
            //create button for every entity
            var parent = document.getElementById("course-form");
            var addBtn = document.createElement("input");
            addBtn.id = "add-btn";
            addBtn.type = "button";
            addBtn.value = "Add";
            addBtn.onclick = addCourse;
            parent.appendChild(addBtn);


            // make courses dropdown list
            createDropDownList();

            // create button to delete course
            var form = document.getElementById("course-form");
            var btn = document.createElement("input");
            btn.id = "del-btn";
            btn.type = "button";
            btn.value = "Delete";
            btn.onclick = deleteCourse;
            form.appendChild(btn);

            var logoutBtn = document.getElementById("logoutBtn");
            logoutBtn.addEventListener("click", this.LogoutPage, false);
        },

        LogoutPage: function (eventInfo) {
            sessionStorage.setItem('key', null);
            sessionStorage.setItem('username', null);
            WinJS.Navigation.navigate("/pages/home/home.html");
        },
    });
})();
