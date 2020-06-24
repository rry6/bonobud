//multi-page form
var currentLayer = 'page2';
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
const damount = document.querySelector("#amount");
const dsave = document.querySelector("#submitButton");

dsave.addEventListener("click", function(){
  var newdonor = db.collection("donors").doc();
	var reason = dreason.value;
	if (reason.length === 0) {
		reason = "I really liked their mission!";
	}
	var first = dname.value.split(" ")[0]
  newdonor.set({
    name: dname.value,
		firstname: first,
    email: demail.value,
    charity: dcharity.value,
		charityArray: arrayify(dcharity.value),
    link: dlink.value,
    reason: reason,
    amount: Number(damount.value),
    date: firebase.firestore.FieldValue.serverTimestamp(),
		status: "available" //available = display in feed, or matcherid if matched, expired after 3 weeks
  })
  .then(function() {
			location.href='submission.html';
  })
  .catch(function(error) {
      console.error("Error adding donor: ", error);
      document.getElementById("submitted").innerHTML = "<h1>Error processing donor. Please try again later.</h1>"
  });
})

//turns a charity name into an array of all sequential word combinations
function arrayify(phrase) {
	phrase = phrase.toLowerCase();
	var singleWords = phrase.split(" ");
	var array = [];
	for (var i = 0; i < singleWords.length; i++) {
		var last = singleWords[i];
		array.push(last);
		var space = last + " ";
		array.push(space);
		for (var n = i+1; n < singleWords.length; n++) {
			last = last + " " + singleWords[n];
			array.push(last);
			space = last + " ";
			array.push(space);
		}
	}
	return array;
}
