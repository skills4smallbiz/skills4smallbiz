function formatServices(serv) {
    //pre: a lsit of services
    //post: String: formats services with commas and spaces

    var res = "";
    const split = ", "
    serv.forEach(function(s) {
        res += s.slice(0,1) + s.slice(1) + split;
    });
    res=res[0].toUpperCase()+res.slice(1);
    return res.slice(0, -2)
}

function formatSocials(socials) {
    var links = socials.toString().split(',')
    var res = "";
    for (let i = 0; i < Math.min(socials.length,3); i++) {
        res += links[i]+", "
    }
    return res
}

function errorMsg() {
    //post: error message

    var error = document.getElementById('loading-message');
    error.innerHTML = "No users match your current requirements, try changing them in Account or click 'View all Listings'"
    error.style.display = ""
}

function printData(items, prefix, fields, uid, qtype, view_self){
    //pre: items: listings to be printed, prefix: see below, uid: see user ID, qtype: see below
    //post: prints out listings on user screen

    var numEntries = 0;
    var table = document.getElementById(prefix+'-table')
    console.log(items)
    items.forEach(function(doc) { 
   //     if (doc.id != uid || view_self) {
            numEntries += 1;
            var row = table.insertRow(-1);
            var cells = [];
            for (i = 0; i < fields.length; i++){
                cells.push(row.insertCell());
                var fmtData = doc.data()[fields[i]]
                if (fields[i] == "socials"){
                    fmtData = formatSocials(fmtData)
                }
                if (fields[i] == 'services') {
                    fmtData = formatServices(fmtData);
                }
                cells[i].innerHTML = fmtData
                cells[i].className = prefix + '-' + fields[i];

                row.addEventListener("click", () => {
                    window.location.href = "profile.html?type=" + qtype + "&user=" + doc.id;
                });
            }
        //}
    });
    // make first row header so that it doesn't get highlighted
    var tbl_rows = document.getElementById(prefix+'-table').rows
    tbl_rows[0].id="table-header"

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
    //pre:
        //qtype: see below, prefix: see below, servlist: a list of the user's skills/needs, used to filter
        //uid: user ID, same: whether it's the same type of user looking at the same type of page (eg. vol looking at vol, biz looking at biz)
    //post:
        //sorts the data (geo sorted for businesses), and calls printData() to display data

    if (servlist.length > 0) {
        db.collection(qtype).where('services', 'array-contains-any', servlist).get().then(function(snapshot) {
            var items = []
            printed = false
            snapshot.docs.forEach((doc)=> items.push(doc))





            if (prefix == 'biz' && navigator.geolocation){ 
                printData(items, prefix, fields, uid, qtype)



                navigator.geolocation.getCurrentPosition(function(position) {
                document.getElementById(prefix +'-table').innerHTML = document.getElementById(prefix + '-table').getElementsByTagName('tr')[0].innerHTML
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



//repect for whoever commented this code-- Andrew
function query(qtype, utype, user, prefix, fields, showAll, view_self){
    console.log(showAll)
    //pre: 
        //qtype: the page querying the data from: businesses/volunteers
        //utype: the user type (the one that's not qtype)
        //user: the firebase auth obj
        //prefix: biz/vol, consistent with qtype
        //fields: the data fields to be queried (varies depending on biz/vol)
        //showAll: if query is to display all data
    
    //post:
        //calls sortData based  on the type and user

    //all the skills
    var servlist = ['accounting', 'webdev', 'phone', 'advertising', 'consulting', "social media", "organize","online video platform","marketing/outreach", "SEO"];




    if (showAll) {
        //clears table
        document.getElementById(prefix +'-table').innerHTML = document.getElementById(prefix + '-table').getElementsByTagName('tr')[0].innerHTML
        sortData(qtype, prefix, fields, servlist, view_self)
        return;
    }
    console.log("continue")

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
                sortData(qtype, prefix, fields, servlist, uid, view_self)
            } 
            //if doc is empty: 2 scenarios
            else{
                db.collection(qtype).doc(uid).get().then(function(doc) {
                    //if both are empty 
                    if (doc.data() == undefined){
                        var error = document.createElement('h1');
                        var error_t = document.createTextNode("You did not make a profile or no users match your current needs/skills, try changing them in Account or click 'View all Listings'")
                        error.appendChild(error_t)
                        document.body.appendChild(error)
                    }
                    //if the other one is filled (vol looking at vol, biz looking at biz)
                    else {
                        //display all
                        sortData(qtype, prefix, fields, servlist, uid, true, view_self) 

                    }
                
            });
        }
        });
    //else if the user is not logged in, display all
    } else {
        console.log("You are not logged in")
        sortData(qtype, prefix, fields, servlist, view_self)
    }
}
function delete_account(type, uid){
    var collection = (type == "vol-delete") ? "volunteers" : "businesses";
    console.log(collection, uid)
    db.collection(collection).doc(uid).delete().then(function() {
    console.log("Document successfully deleted!");
    window.alert("Your data has been successfully deleted")
    location.reload()
})
}

function set_up_delete(uid){
    var button_ids = ['biz-delete','vol-delete']
    button_ids.forEach((button_id)=>{
        document.getElementById(button_id).addEventListener("click",()=>{delete_account(button_id, uid)})
    })
}