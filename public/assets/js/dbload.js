function printData(qtype, prefix, fields, servlist){
    var table = document.getElementById(prefix+'-table')

    db.collection(qtype).where('services', 'array-contains-any', servlist).get().then(function(snapshot) {
        if(Object.keys(snapshot).length > 0){
            snapshot.docs.forEach(function(doc) {            
                var row = table.insertRow(-1);
                var cells = [];
                for (i = 0; i < fields.length; i++){
                    cells.push(row.insertCell());
                    cells[i].innerHTML = doc.data()[fields[i]]
                    cells[i].id = prefix + '-' + fields;
                }
            });
        } else {
            var error = document.createElement('h1');
            var error_t = document.createTextNode("No users match your current requirements, try changing them in accounts!")
            error.appendChild(error_t)
            document.body.appendChild(error)
        }
    });
}




//
function query(qtype, utype, user, prefix, fields){
    var servlist = ['accounting', 'webdev', 'phone', 'legal', 'advertising', 'consulting'];
    if (user != null)  {   // USER LOGGED IN
        uid = user.uid;
        name = user.displayName;
        email = user.email;

        db.collection(utype).doc(uid).get().then(function(doc) {
            if (doc != undefined){
                servlist = doc.data()['services'];
                console.log(servlist)
            } else{
                var error = document.createElement('h1');
                var error_t = document.createTextNode("No users match your current requirements, try changing them in accounts!")
                error.appendChild(error_t)
                document.body.appendChild(error)
            }
            printData(qtype, prefix, fields, servlist)
        });

    } else {
        printData(qtype, prefix, fields, servlist)
    }
}

