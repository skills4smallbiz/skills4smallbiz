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

function printData(qtype, prefix, fields, servlist, uid){
    var table = document.getElementById(prefix+'-table')


    if (servlist.length > 0) {
        db.collection(qtype).where('services', 'array-contains-any', servlist).get().then(function(snapshot) {
            var numEntries = 0;
            orderedItems = []
            
            snapshot.docs.forEach((doc)=> orderedItems.push(doc))
            if (prefix == 'biz' && navigator.geolocation){ 
                    navigator.geolocation.getCurrentPosition(function(position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                        };
            console.log('My Lat:' + geolocation.lat)
            console.log('My Long:' + geolocation.lng)
            orderedItems.sort((i)=>{
                var lat = i.data()['lat']
                var long = i.data()['lng']
                var dist = Math.sqrt(Math.pow((geolocation['lat']-lat),2) + Math.pow((geolocation['lng']-long), 2)) 
                console.log(i.data()['bizname'], dist) 

                return dist
                })
            
            })
        }
        orderedItems.forEach((x)=>{
            console.log(x.id, x.data())
        }
        ) 
            orderedItems.forEach(function(doc) { 
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
            printData(qtype, prefix, fields, servlist, uid)
        });

    } else {
        printData(qtype, prefix, fields, servlist)
    }
}
