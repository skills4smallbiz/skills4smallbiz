//function init() {
var firebaseConfigProd = {
    apiKey: "AIzaSyD-_Zm5y-K8xINw3m9eDeHBnAE4DqtSv50",
    authDomain: "covidsmallbizlink.firebaseapp.com",
    databaseURL: "https://covidsmallbizlink.firebaseio.com",
    projectId: "covidsmallbizlink",
    storageBucket: "covidsmallbizlink.appspot.com",
    appId: "1:131149431483:web:20f64b67ec10c9c53c1f9e",
};

var firebaseConfigDev = {
    apiKey: "AIzaSyB7eh9eAW5_MC8kmY3eXt2Rm5f59uWGaAI",
    authDomain: "covidsmallbizlink-staging.firebaseapp.com",
    databaseURL: "https://covidsmallbizlink-staging.firebaseio.com",
    projectId: "covidsmallbizlink-staging",
    storageBucket: "covidsmallbizlink-staging.appspot.com",
    messagingSenderId: "857300331152",
    appId: "1:857300331152:web:516b63439b734c9d9c0615"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfigProd);
var db = firebase.firestore()


firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        // Name, email address etc
        var name = user.displayName;
        var email = user.email;
        console.log("yes");
        console.log(name);
    }
})

/*
firebase.database.enableLogging(function (message) {
    console.log("[FIREBASE]", message);
});
*/