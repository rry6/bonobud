//multi-page form
var currentLayer = 'page2';
//shows the next page of form and hides current page
function showLayer(lyr){
	hideLayer(currentLayer);
	document.getElementById(lyr).style.visibility = 'visible';
	currentLayer = lyr;
}
//hides a specific page
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

//log donor info from form
const dname = document.querySelector("#nameInput");
const demail = document.querySelector("#emailInput");
const dcharity = document.querySelector("#orgInput");
const dlink = document.querySelector("#linkInput");
const dreason = document.querySelector("#reasonInput");
const damount = document.querySelector("#amount");
const dsave = document.querySelector("#submitButton");

//create new donor doc in firebase from input information
dsave.addEventListener("click", function(){
  var newdonor = db.collection("donors").doc();
	var reason = dreason.value;
	if (reason.length === 0) {
		reason = "I really liked their mission!"; //sets a default message for reason
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
		status: "available" //available = display in feed, matcherid = donor is matched, expired = after 3 weeks
  })
  .then(function() {
      location.href='submission.html'; //donor success page
  })
  .catch(function(error) {
      console.error("Error adding donor: ", error);
      location.href='submissionFail.html'; //submission failed page
  });
})

//turns a charity name into an array of all sequential word combinations for search functionality
//i.e. American Red Cross -> [American, American , American Red, American Red , American Red Cross, American Red Cross ]
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
