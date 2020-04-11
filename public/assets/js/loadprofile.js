//Individual Print Functions, stored in object printfxns. 
//See lines 92-95 to see how these are man 
//If adding a print function, it must take 2 and only 2 args: (data, textdoc, key)
//Each function must be added to printfxns, and th key for that function must be added to keys
//Please follow this format to make things easier
function formatServices(data, textDoc, key) {//TODO: Get services from data, print to doc rather than return 
    //pre: a lsit of services
    //post: String: formats services with commas and spaces
    var serv = data[key]
    var res = "";
    const split = ", "
    serv.forEach(function (s) {
        res += s.slice(0, 1) + s.slice(1) + split;
    });
    res = res[0].toUpperCase() + res.slice(1);
    textDoc.innerText += res.slice(0, -2)
    textDoc.style.display = "";


    //    return res.slice(0, -2)
}

function formatSocials(data, textDoc, key) {//TODO: Get data from doc
    var socials = data[key]
    for (let i = 0; i < socials.length; i++) {
        var a = document.createElement("a");
        var p = document.createElement("p");
        a.innerText = socials[i];
        a.style.textDecoration = "underline";
        a.addEventListener("click", () => {
            window.open(socials[i])
        })
        // p.innerHTML="<br>"
        textDoc.appendChild(a);
        textDoc.appendChild(p)

        textDoc.style.display = "";
    }
}
function formatHelp(data, textDoc, key) {

    if (data[key] != undefined && data[key] != null) {
        var HelpSection = document.getElementById("HelpSection"); 
        HelpSection.innerHTML = "<div class='col-lg-4' id='helpBox' style='width: 70%; margin: auto; width: 80%; border: 3px solid rgb(0,97,128); padding: 2%;'><h4>Help this business has received:</h4><table id='help-table'></table></div> "
        HelpSection.style.display = "" 
        
        var table = document.getElementById('help-table')
        var a = data[key]
        for (i = 0; i < a.length; i++) {
            var row = table.insertRow(-1)
            var cell = row.insertCell()
            cell.innerText = a[i]
        }
    }


}
function formatNormal(data, textDoc, key) {//todo: 
    var fmtData = data[key]
    console.log(key, fmtData)
    textDoc.innerText += fmtData;
    textDoc.style.display = "";
}
function formatEmail(data, textDoc, key) {
    //email
    var email = data[key]
    //set email
    document.getElementById("contact").href = "mailto:" + email;

    document.getElementById("contact").style = "";
}
//mapping the business given lat and lng
function initMap(data, textDoc, key) {
    latitutde = data['lat']
    longitude = data['long']
    var loc = { lat: latitutde, lng: longitude };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 13, center: loc });
    var marker = new google.maps.Marker({ position: loc, map: map });
    console.log("map init")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
function getUrlVars(key) {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    console.log(vars[key])
    return (vars[key])
}


var printfxns = {

    'bizname': formatNormal,
    'name': formatNormal,
    'address': formatNormal,
    'services': formatServices,
    'other-serv': formatNormal,
    'about': formatNormal,
    'socials': formatSocials,
    'helpRecv': formatHelp,
    'email': formatEmail,
    // 'coords': initMap
}

function log() {
    var events = [
        { ID: "contact", eventType: "click", action: user.uid + "connected with" + userid, category: "Connection", event_label: intersection(userData.data()['services'], doc.data()['services']).toString(), value: 5 }
    ]
    reportEvents(events)
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//var sendtoemail, about, services, socials, bizname, lat, lng, uid, name, email;
var db = firebase.firestore();

Array.prototype.forEach.call(document.getElementById("profile").children, function (n) {
    n.style.display = "none";
});



firebase.auth().onAuthStateChanged(function (user) {
    //recover info from db and update relevant fields
    var userid = getUrlVars("user");
    var col = getUrlVars("type")
    var user_col = (col == "businesses") ? "volunteers" : "businesses"


    console.log("Printing for: ", col, ' ', userid)
    db.collection(col).doc(userid).get().then(function (doc) {
        if (doc.exists) {
            console.log("retrieving info")
            var data = doc.data();
            var keys = (col == "businesses") ? ['bizname', 'name', 'about', 'address', 'email', /*'coords',*/ 'other-serv', 'services', 'socials', "helpRecv"] : ['name', 'about', 'address', 'email', 'other-serv', 'services', 'socials']
            keys.forEach(function (id) {
                console.log("Printing: ", id)
                var textDoc = document.getElementById('profile-' + id)
                fxn = printfxns[id]
                fxn(data, textDoc, id)
            });
        } else {
            console.log("No such document!")
        }
    }).catch(function (error) {
        console.log("Error getting document:", error)
    });
});






