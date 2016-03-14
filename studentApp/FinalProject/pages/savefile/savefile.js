// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/savefile/savefile.html", {
        ready: function (element, options) {
            var myText;
            var myFile;

            function getData() {
                //Web api url
                console.log(sessionStorage.getItem('key'));
                var uriString = "http://localhost:8080/student/" + sessionStorage.getItem('key');
                //ajax call to get json data
                $.ajax({
                    url: uriString,
                    datatype: 'json',
                    type: 'get',
                    cache: false,
                    success: function (data) {
                        var form = "";
                        var obj = JSON.parse(data);
                        console.log(data);
                        var showKeys = document.getElementById("save-student");
                        var objKeys;

                        for (var i in obj) {
                            var value = obj[i];
                            console.log("value = " + value);
                            myText += value + "<br>";
                            console.log(myText);
                        }

                        var applicationData = Windows.Storage.ApplicationData.current;
                        var localFolder = applicationData.localFolder;


                        localFolder.createFileAsync("StudentList.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
                           .then(function (sampleFile) {
                               //console.log(sampleFile);
                               myFile = sampleFile;
                               //return Windows.Storage.FileIO.writeTextAsync(sampleFile, myText);
                           }).done(function () {
                               //console.log("Write File");
                           });

                        var WS = Windows.Storage.FileIO.writeTextAsync(myFile, myText)
                            .then(function () {
                                console.log("File done writing.");
                            });

                        localFolder.getFileAsync("StudentList.txt")
                           .then(function (sampleFile) {
                               //return Windows.Storage.FileIO.readTextAsync("StudentList.txt");
                           }).done(function (data) {
                               //console.log("Read file");
                               console.log("Data = " + data);
                           }, function () {


                           });
                    }
                });
            }

            function showFile() {
                document.getElementById('printout').innerHTML = myText;
            }

            var editBtn = document.getElementById("editBtn");
            editBtn.addEventListener("click", this.EditBtn, false);

            var logoutBtn = document.getElementById("logoutBtn");
            logoutBtn.addEventListener("click", this.LogoutPage, false);

            var context = document.getElementById("save-student");
            var btn = document.createElement("input");
            btn.id = "save-btn";
            btn.type = "button";
            btn.value = "Save";
            btn.onclick = getData;
            context.appendChild(btn);

            var context = document.getElementById("printout");
            var btn = document.createElement("input");
            btn.id = "print-btn";
            btn.type = "button";
            btn.value = "Print";
            btn.onclick = showFile;
            context.appendChild(btn);
        },

        EditPage: function (eventInfo) {
            WinJS.Navigation.navigate("/pages/edit/edit.html");
        },

        LogoutPage: function (eventInfo) {
            WinJS.Navigation.navigate("/pages/home/home.html");
        },
    });
})();
