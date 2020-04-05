

function sendEmail(uid){
    var functions = firebase.functions().httpsCallable("autoEmail?dest=" + uid) 
    functions().then(()=>{})
}



