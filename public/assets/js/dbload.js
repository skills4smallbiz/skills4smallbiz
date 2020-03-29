function loadSome(col, prefix, keys) {

    var db = firebase.firestore();

    db.collection(col).get().then(function(snapshot) {
    snapshot.forEach(function(doc) {
        console.log(doc.data());
        
    });
    })
    .catch(function(error) {
        console.log("Error getting document:", error)
    });  
}


function printData(data, prefix, fields){
    var table = document.getElementById(prefix + "-table");

    var row = table.insertRow(-1);
    var cells = [];
   for (i = 0; i < fields.length; i++){
            cells.push(row.insertCell());
            cells[i].innerHTML = data[fields[i]]
            cells[i].id = prefix + '-' + fields;
        }
}


function query(qtype, utype, user, prefix, fields){
    if (user == null) {
        var servlist = ['accounting', 'webdev', 'phone', 'legal', 'advertising', 'consulting'];
        db.collection("volunteers").where('services', 'array-contains-any', servlist).get().then(
            snapshot => {
        snapshot.docs.forEach(doc =>{
                        
            printData(doc.data(), prefix, fields)

        }
        )
    })
    } else{

    uid = user.uid;
    name = user.displayName;
    email = user.email;

    var userData;
    db.collection("businesses").doc(uid).get().then(function(doc){

        userData = doc.data();

        db.collection("volunteers").where('services', 'array-contains-any', userData['services']).get().then(snapshot => {
        snapshot.docs.forEach(doc =>{
            
            printData(doc.data(), prefix, fields)

        });
        
        
    })


}



