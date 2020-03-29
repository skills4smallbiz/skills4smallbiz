function loadSome(col, prefix, keys) {
    var table = document.getElementById(prefix + "-table");

    var db = firebase.firestore();

    db.collection(col).get().then(function(snapshot) {
    snapshot.forEach(function(doc) {
        console.log(doc.data());
        var row = table.insertRow(-1);
        var cells = [];
        keys.forEach(function(id, idx) {
            cells.push(row.insertCell());
            cells[idx].innerHTML = doc.data()[id]
            cells[idx].id = prefix + '-' + id;
        });
    });
    })
    .catch(function(error) {
        console.log("Error getting document:", error)
    });  
}