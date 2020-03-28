// JavaScript source code
var db = firebase.firestore();
var v = db.collection("volunteers")
var v = db.collection("volunteer")
var userData;
db.collection("businesses").doc(uid).get().then(function (doc) {
    userData = doc.data()
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var selection = v.where("services", "array-contains-any", userData['services'])
    .get()
    .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            //TODO:Add query data to doc  

        });
    })

