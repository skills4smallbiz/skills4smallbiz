function formatServices(serv) {
    var res = "";
    const split = ", "
    serv.forEach(function(s) {
        res += s.slice(0,1).toUpperCase() + s.slice(1) + split;
    });

    return res.slice(0, -2)
}

function errorMsg() {
    var error = document.getElementById('loading-message');
    error.innerHTML = "No users match your current requirements, try changing them in accounts!"
    error.style.display = ""
}

function printData(items, prefix, fields, uid, qtype){

    var numEntries = 0;
    var table = document.getElementById(prefix+'-table')
    console.log(items)
    items.forEach(function(doc) { 
        if (doc.id != uid) {
            numEntries += 1;
            var row = table.insertRow(-1);
            var cells = [];
            for (i = 0; i < fields.length; i++){
                cells.push(row.insertCell());
                var fmtData = doc.data()[fields[i]]
                if (fields[i] == 'services') {
                    fmtData = formatServices(fmtData);
                }
                cells[i].innerHTML = fmtData
                cells[i].className = prefix + '-' + fields[i];

                row.addEventListener("click", () => {
                    window.location.href = "profile.html?type=" + qtype + "&user=" + doc.id;
                });
            }
        }
    });
    if (numEntries == 0) {
        errorMsg();
    }
}
function dist(i, geolocation){
    var lat = i.data()['lat']
    var long = i.data()['lng']
    var dist = Math.sqrt(Math.pow((geolocation['lat']-lat),2) + Math.pow((geolocation['lng']-long), 2)) 
    console.log(i.data()['bizname'], dist)
    return dist
}





async function sortData(qtype, prefix, fields, servlist, uid){


    if (servlist.length > 0) {
        db.collection(qtype).where('services', 'array-contains-any', servlist).get().then(function(snapshot) {
            var items = []
            printed = false
            snapshot.docs.forEach((doc)=> items.push(doc))





            if (prefix == 'biz' && navigator.geolocation){ 
                printData(items, prefix, fields, uid, qtype)



                navigator.geolocation.getCurrentPosition(function(position) {
                document.getElementById(prefix +'-table').innerHTML = ""
                console.log('Not bad')
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log(geolocation)
                console.log('My Lat:' + geolocation.lat)
                console.log('My Long:' + geolocation.lng)
                items.sort(function(a, b){
                    return dist(a, geolocation) - dist(b, geolocation)
                })
                console.log(items)
                printData(items, prefix, fields, uid, qtype)
                printed = true;
            })
            
                
            } else{
                printData(items, prefix, fields, uid, qtype)
            }
        });
    } else {
        errorMsg()
    }
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
            } else{
                var error = document.createElement('h1');
                var error_t = document.createTextNode("No users match your current requirements, try changing them in accounts!")
                error.appendChild(error_t)
                document.body.appendChild(error)
            }
            sortData(qtype, prefix, fields, servlist, uid)
        });

    } else {
        sortData(qtype, prefix, fields, servlist)
    }
}
