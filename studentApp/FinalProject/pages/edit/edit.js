// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/edit/edit.html", {
        ready: function (element, options) {

            function deleteStudent() {
                //var formData = {};
                //$("#student-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var student_key = sessionStorage.getItem('key');
                // if user entered errors go navigate home
                var uriString = "http://localhost:8080/deleteStudent";
                $.ajax({
                    url: uriString,
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    datatype: 'json',
                    data: { key: student_key },
                    success: function (result) {
                        document.getElementById('msg').innerHTML = "Deleted student " + student_key;
                    }
                });
            }


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
                            var element = document.getElementById("student_course_add");
                            var option = document.createElement("option");
                            option.value = course[i].key;
                            option.innerText = course[i].name;
                            element.appendChild(option);
                        }
                    }
                })
            };

            // gets values from database to populate into fields
            function getInfo() {
                var key = sessionStorage.getItem('key');
                var uriStringGet = "http://localhost:8080/student/" + key;
                $.ajax({
                    url: uriStringGet,
                    datatype: 'json',
                    type: 'get',
                    //cache: false,
                    success: function (data) {
                        var student = JSON.parse(data);
                        // get name and major
                        if (student.name != "undefined") {
                            var sName = document.getElementById("sName");
                            sName.value = student.name;
                        }

                        if (student.major != "undefined") {
                            var sMajor = document.getElementById("sMajor");
                            sMajor.value = student.major;
                        }
                    }
                })
            };
            


            // edit info on student profile
            function editStudent() {
                var errors = "";
                var formData = {};
                $("#student-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var studentName = formData.student_name;
                var studentMajor = formData.student_major;
                var courseAdd = formData.course_add;
                var studentCourses = formData.student_courses;
                //console.log(courseAdd);
                var mySession = sessionStorage.getItem('username');
                var studentKey = sessionStorage.getItem('key');

                var uriString = "http://localhost:8080/updateStudent";
                $.ajax({
                    url: uriString,
                    type: "post",
                    contentType: "application/x-www-form-urlencoded",
                    datatype: 'json',
                    data: { key: studentKey, name: studentName, major: studentMajor},
                    success: function (result) {
                        document.getElementById('msg').innerHTML = "Updated record";
                    }
                });
            };

            function addCourse() {
                var formData = {};
                $("#student-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var courseKey = formData.course_add;
                var studentKey = sessionStorage.getItem('key');

                //console.log(studentKey + "/" + courseKey + "/")

                var uriString = "http://localhost:8080/student/" + studentKey + "/course/" + courseKey;
                $.ajax({
                    url: uriString,
                    type: "PUT",
                    //contentType: "application/x-www-form-urlencoded",
                    //headers: { "X-HTTP-Method-Override": "PUT" },
                    //data: { },
                    success: function (result) {
                        document.getElementById('msg').innerHTML = "Added course " + courseKey + " to " + studentKey;
                    }
                });
            };

            // display edit for session account
            document.getElementById('editTitle').innerHTML = "Edit account: " + sessionStorage.getItem('username');

            // make courses dropdown list
            createDropDownList();

            // get values from database
            getInfo();

            // create button to update student
            var form = document.getElementById("student-form");
            var btn = document.createElement("input");
            btn.id = "add-btn";
            btn.type = "button";
            btn.value = "Save";
            btn.onclick = editStudent;
            form.appendChild(btn);

            var form = document.getElementById("student-form");
            var btn = document.createElement("input");
            btn.id = "add-class";
            btn.type = "button";
            btn.value = "Add course";
            btn.onclick = addCourse;
            form.appendChild(btn);
            //form.appendChild("<br>");

            var form = document.getElementById("student-form");
            var btn = document.createElement("input");
            btn.id = "del-student";
            btn.type = "button";
            btn.value = "Delete Student";
            btn.onclick = deleteStudent;
            form.appendChild(btn);

            var saveFile = document.getElementById("saveFile");
            saveFile.addEventListener("click", this.SaveFile, false);

            var logoutBtn = document.getElementById("logoutBtn");
            logoutBtn.addEventListener("click", this.LogoutPage, false);
        },
        SaveFile: function (eventInfo) {
            WinJS.Navigation.navigate("/pages/savefile/savefile.html");
        },

        LogoutPage: function (eventInfo) {
            sessionStorage.setItem('key', null);
            sessionStorage.setItem('username', null);
            WinJS.Navigation.navigate("/pages/home/home.html");
        },
    });
})();
