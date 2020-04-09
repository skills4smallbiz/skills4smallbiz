
var uid, name, email, button_name, about, services, socials, bizname, lat, lng, keys, sendtoemail;

Array.prototype.forEach.call(document.getElementById("profile").children, function (n) {
    n.style.display = "none";
});

var db = firebase.firestore();
var prefix = "biz";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var userid = getUrlVars()['user'];
var col = getUrlVars()['type'];
var user_col = (col == "businesses") ? "volunteers" : "businesses"
keys =  (col == "businesses") ? ["bizname", "address", "services", "other-serv", "about", "socials", "helpRecv"] : ["name", "services", "other-serv", "about", "socials"];




firebase.auth().onAuthStateChanged(function (user) {
    //recover info from db and update relevant fields
    db.collection(col).doc(userid).get().then(function (doc) {
        if (doc.exists) {
            var data = doc.data();

            keys.forEach(function (id) {
                console.log(id)
                var fmtData = data[id];

                if (id == "services") {
                    fmtData = formatServices(fmtData);
                }

                textDoc = document.getElementById('profile-' + id)
                if (id == "socials") {
                    // TODO: WORK IN PROGRESS
                    for (let i = 0; i < data[id].length; i++) {
                        var a = document.createElement("a");
                        var p = document.createElement("p");
                        a.innerText = data[id][i];
                        a.style.textDecoration = "underline";
                        a.addEventListener("click", () => {
                            window.open(data[id][i])
                        })
                        // p.innerHTML="<br>"
                        textDoc.appendChild(a);
                        textDoc.appendChild(p)
                    }

                 } else if (id == "helpRecv") {
                    var table = document.getElementById('help-table')

                    var a = data[id]
                    console.log(a)
                    for (i = 0; i < a.length; i++) {
                        var row = table.insertRow(-1)
                        var cell = row.insertCell()
                        cell.innerText = a[i]
                    }
                } else {
                    textDoc.innerText += fmtData;

                }





                textDoc.style.display = "";
            });

            //email
            email = data["email"]
            //set email
            document.getElementById("contact").href = "mailto:" + email;
            sendtoemail = email
            if (col == "businesses") {
                //latitude and longitute
                lat = data["lat"]
                lng = data["lng"]
                //initialize the map
                initMap(lat, lng)
            }
            var events = [

                { ID: "contact", eventType: "click", action: user.uid + "connected with" + userid, category: "Connection", event_label: intersection(userData.data()['services'], doc.data()['services']).toString(), value: 5 }
            ]
            reportEvents(events)
            console.log("updating info")
        } else {
            console.log("No such document!")
        }
    }).catch(function (error) {
        console.log("Error getting document:", error)
    });
    // })

});

function initMap(latitutde, longitude) {
    var loc = { lat: latitutde, lng: longitude };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 13, center: loc });
    var marker = new google.maps.Marker({ position: loc, map: map });
    console.log("map init")
}



document.getElementById("contact").style = "";
