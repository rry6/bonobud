//multi-page form
var currentLayer = 'page1';
function showLayer(lyr){
	hideLayer(currentLayer);
	document.getElementById(lyr).style.visibility = 'visible';
	currentLayer = lyr;
}

function hideLayer(lyr){
	document.getElementById(lyr).style.visibility = 'hidden';
}

//Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAxe7I5_U4JQ0VWkyRTIAEtPSbxuMOuR1s",
    authDomain: "bonobud-698d2.firebaseapp.com",
    databaseURL: "https://bonobud-698d2.firebaseio.com",
    projectId: "bonobud-698d2",
    storageBucket: "bonobud-698d2.appspot.com",
    messagingSenderId: "914561789800",
    appId: "1:914561789800:web:9ea460455fb6aeba36f0dd",
    measurementId: "G-NTB46WM60G"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();

const dname = document.querySelector("#nameInput");
const demail = document.querySelector("#emailInput");
const dcharity = document.querySelector("#orgInput");
const dlink = document.querySelector("#linkInput");
const dreason = document.querySelector("#reasonInput");
const dvenmo = document.querySelector("#venmoInput");
const damount = document.querySelector("#amount");
const dsave = document.querySelector("#submitButton");

dsave.addEventListener("click", function(){
  var newdonor = db.collection("donors").doc();
  newdonor.set({
    name: dname.value,
    email: demail.value,
    charity: dcharity.value,
    link: dlink.value,
    reason: dreason.value,
    amount: damount.value,
    venmo: dvenmo.value,
    date: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function() {
      console.log("Donor written with ID: " + newdonor.id);
  })
  .catch(function(error) {
      console.error("Error adding donor: ", error);
      document.getElementById("submitted").innerHTML = "<h1>Error. Please try again later.</h1>"
  });
})
