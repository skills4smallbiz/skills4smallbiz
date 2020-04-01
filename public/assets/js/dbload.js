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





async function sortData(qtype, prefix, fields, servlist, uid, same){


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

                console.log(uid);
                if (uid != null && !same)  {
                    document.getElementById("filter-message").innerHTML = "Businesses are sorted by proximity and filtered so that their needs match your skillset."
                }
                else {
                    document.getElementById("filter-message").innerHTML = "Businesses are sorted by proximity."
                }        
                
            })
            
                
            } else{
                if (uid == null) {
                    document.getElementById("filter-message").innerHTML = "Log in to filter volunteers by their skillset."   
                }
                else if (same){
                    document.getElementById("filter-message").innerHTML = `As a volunteer, you are viewing all volunteers.`     
                }
                else {
                    document.getElementById("filter-message").innerHTML = "Volunteers are filtered so that their skillset matches your needs."      
                }
                printData(items, prefix, fields, uid, qtype)
            }
        });
    } else {
        errorMsg()
    }
}



//
function query(qtype, utype, user, prefix, fields){
    //all the skills
    var servlist = ['accounting', 'webdev', 'phone', 'legal', 'advertising', 'consulting', "socialmedia", "organize"];
    //if user is logged in
    if (user != null)  {
        uid = user.uid;
        name = user.displayName;
        email = user.email;
        //get that user's data
        db.collection(utype).doc(uid).get().then(function(doc) {
            //if user is of the other type (biz looking at vol, vol looking at biz)
            if (doc.data() != undefined){
                //generate servlist based on needs/skills
                servlist = doc.data()['services'];
                sortData(qtype, prefix, fields, servlist, uid)
            } 
            //if doc is empty: 2 scenarios
            else{
                db.collection(qtype).doc(uid).get().then(function(doc) {
                    //if both are empty 
                    if (doc.data() == undefined){
                        var error = document.createElement('h1');
                        var error_t = document.createTextNode("You did not make a profile or no users match your current needs/skills, try changing them in Account!")
                        error.appendChild(error_t)
                        document.body.appendChild(error)
                    }
                    //if the other one is filled (vol looking at vol, biz looking at biz)
                    else {
                        //display all
                        sortData(qtype, prefix, fields, servlist, uid, true) 

                    }
                
            });
        }
        });
    //else if the user is not logged in, display all
    } else {
        sortData(qtype, prefix, fields, servlist)
    }
}


