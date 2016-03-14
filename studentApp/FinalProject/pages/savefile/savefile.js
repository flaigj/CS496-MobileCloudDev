// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/savefile/savefile.html", {
        ready: function (element, options) {

            var applicationData = Windows.Storage.ApplicationData.current;
            var localFolder = applicationData.localFolder;

            function writeTimeStamp(myText) {
                localFolder.createFileAsync("StudentList.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
                   .then(function (sampleFile) {
                       console.log("Create file");

                       //return Windows.Storage.FileIO.writeTextAsync(sampleFile, myText);
                   }).done(function () {
                       console.log("Write File");
                   });
            }

            function readTimeStamp() {
                localFolder.getFileAsync("StudentList.txt")
                   .then(function (sampleFile) {
                       //return Windows.Storage.FileIO.readTextAsync("StudentList.txt");
                   }).done(function (data) {
                       console.log("Read file");
                       console.log("Data = " + data);
                   }, function () {


                   });
            }

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
                            var myText;
                            // create data to write
                            for (t in value) {
                                myText += t + "<br>";
                            }

                            writeTimeStamp(myText);
                            readTimeStamp();

                        }


                    }
                });
            }

            var context = document.getElementById("save-student");
            var btn = document.createElement("input");
            btn.id = "save-btn";
            btn.type = "button";
            btn.value = "Save";
            btn.onclick = getData;
            context.appendChild(btn);
        },
    });
})();
