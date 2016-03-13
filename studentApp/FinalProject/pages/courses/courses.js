// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/courses.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

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
