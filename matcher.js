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

const mname = document.querySelector("#nameInput");
const mcompany = document.querySelector("#companyInput");
const mrate = document.querySelector("#matcherRate");
const mcompanyemail = document.querySelector("#emailInput");
const memail = document.querySelector("#personalEmailInput");
const mnote = document.querySelector("#noteInput");
const msave = document.querySelector("#submitButton");

msave.addEventListener("click", function(){
  var newmatcher = db.collection("matchers").doc();
  newmatcher.set({
    // matcher info
    name: mname.value,
    company: mcompany.value,
    rate: mrate.value,
    cemail: mcompanyemail.value,
    pemail: memail.value,
    note: mnote.value,
    date: firebase.firestore.FieldValue.serverTimestamp()
    //add donor info?
  })
  .then(function() {
      console.log("Matcher written with ID: " + newmatcher.id);
			document.getElementById("submitted").innerHTML = ("<h1>Success! Thank you for submitting! <br> ID: "
				+ newmatcher.id + "<br> email: " + memail.value)
  })
  .catch(function(error) {
      console.error("Error adding donor: ", error);
      document.getElementById("submitted").innerHTML = "<h1>Error processing matcher. Please try again later.</h1>"
  });
})
