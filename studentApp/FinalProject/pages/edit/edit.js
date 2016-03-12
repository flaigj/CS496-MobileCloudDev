// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/edit/edit.html", {
        ready: function (element, options) {

            // get array of course objects from datastore
            var uriStringDD = "http://localhost:8080/course";
            $.ajax({
                url: uriStringDD,
                datatype: 'json',
                type: 'get',
                cache: false,
                success: function (data) {
                    var form = "";
                    var course = JSON.parse(data);

                    // create dynamic drop down list
                    for (var i = 0; i < course.length; i++) {
                        var context = document.getElementById("student_course_add");
                        var option = document.createElement("option");
                        option.value = course[i].key;
                        option.innerText = course[i].name;
                        context.appendChild(option);
                    }
                }
            })

            function toAdd() {
                var errors = "";
                var formData = {};
                $("#student-form").serializeArray().map(function (x) { formData[x.name] = x.value; });
                var studentName = formData.student_name;
                var studentMajor = formData.student_major;
                var courseAdd = formData.course_add;

                console.log(studentName);
                console.log(studentMajor);
                console.log(courseAdd);
            }

            var context = document.getElementById("student-form");
            var btn = document.createElement("input");
            btn.id = "add-btn";
            btn.type = "button";
            btn.value = "Save";
            btn.onclick = toAdd;
            context.appendChild(btn);
        },
    });
})();
