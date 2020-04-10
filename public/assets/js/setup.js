// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
    apiKey: "AIzaSyD-_Zm5y-K8xINw3m9eDeHBnAE4DqtSv50",
    authDomain: "covidsmallbizlink.firebaseapp.com",
    databaseURL: "https://covidsmallbizlink.firebaseio.com",
    projectId: "covidsmallbizlink",
    storageBucket: "covidsmallbizlink.appspot.com",
    appId: "1:131149431483:web:20f64b67ec10c9c53c1f9e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        // Name, email address etc
        var name = user.displayName;
        var email = user.email;
        console.log("yes");
        console.log(name);

        b = document.getElementById("sign-btn");
        b.style.display = "none";

        document.getElementById("account-welcome").innerText = "Hello, " + name;
        document.getElementById("account-drop").style.display = "";
    }
});
