// JavaScript source code
var db = firebase.firestore();
var b = db.collection("businesses")


var userData;
db.collection("volunteers").doc(uid).get().then(function (doc) {
    userData = doc.data()
});


var selection = b.where("services", "array-contains-any", userData['services'])
    .get()
    .then(function (querySnapshot) {
    })
