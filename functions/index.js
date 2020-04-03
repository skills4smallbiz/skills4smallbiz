
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'covidbizlink@gmail.com',
        pass: 'cblpaloalto'
    }
});

exports.autoEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
        var db = firebase.firestore();
        let cityRef = db.collection('cities').doc('SF');
        let getDoc = cityRef.get()
        .then(doc => {
            if (!doc.exists) {
            console.log('No such document!');
            } else {
        const mailOptions = {
            from: 'covidbizlink@gmail.com', // Something like: Jane Doe <janedoe@gmail.com>
            to: doc.data()['email'],
            subject: 'I\'M A PICKLE!!!', // email subject
            html: `<p style="font-size: 16px;">` + doc.id `</p>` 
        }
        }
        
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });

    })
    });    
});