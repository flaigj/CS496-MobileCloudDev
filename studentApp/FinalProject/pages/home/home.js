(function () {
    //"use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // define functions

            var registerBtn = document.getElementById("registerBtn");
            registerBtn.addEventListener("click", this.RegisterPage, false);
    
            var loginBtn = document.getElementById("loginBtn");
            loginBtn.addEventListener("click", this.LoginPage, false);

            //var editBtn = document.getElementById("editBtn");
            //editBtn.addEventListener("click", this.EditPage, false);
        },

        /*EditPage: function (eventInfo) {
            WinJS.Navigation.navigate("/pages/edit/edit.html");
        },*/

        RegisterPage: function (eventInfo) {
            WinJS.Navigation.navigate("/pages/registration/registration.html");
        },

        LoginPage: function (eventInfo) {
            WinJS.Navigation.navigate("/pages/login/login.html");
        },

        // if session exists create button

    });
})();
