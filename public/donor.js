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
	if(!empty()) {
		var newdonor = db.collection("donors").doc();
		var reason = dreason.value;
		if (reason.length === 0) {
			reason = "I really liked their mission!"; //sets a default message for reason
		}
		var first = dname.value.split(" ")[0];
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
			.then(function () {
				location.href = 'submission.html'; //donor success page
			})
			.catch(function (error) {
				console.error("Error adding donor: ", error);
				location.href = 'submissionFail.html'; //submission failed page
			});
	} else {
		return;
	}
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

function empty(){
	var nameInput = document.getElementById("nameInput");
	var emailInput = document.getElementById("emailInput");
	var orgInput = document.getElementById("orgInput");
	var linkInput = document.getElementById("linkInput");
	var amount = document.getElementById("amount");
	var isEmpty = false;
	var alertString = " ";
	var emailRegex = RegExp('^\\S+@\\S+$');
	var linkRegex = RegExp('https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}')

	var isInvalid = false;

	//Test name value
	if(nameInput.value.trim() == ""){
		nameInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		nameInput.style.boxShadow = "rgb(181, 234, 215) 0px 1px";
	}

	//Test email value and validation
	if(emailInput.value.trim() == ""){
		emailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else if(!emailRegex.test(emailInput.value)){
		emailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		alertString = alertString.concat(" ","Please enter a valid email.");
		isInvalid = true;
	}
	else{
		emailInput.style.boxShadow = "rgb(181, 234, 215) 0px 1px";
	}

	//Test org input
	if(orgInput.value.trim() == ""){
		orgInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		orgInput.style.boxShadow = "rgb(181, 234, 215) 0px 1px";
	}

	//Test link input and validation
	if(linkInput.value.trim() == ""){
		linkInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else if(!linkRegex.test(linkInput.value)){
		linkInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		alertString = alertString.concat(" ","Please enter a valid link.");
		isInvalid = true;
	}
	else{
		linkInput.style.boxShadow = "rgb(181, 234, 215) 0px 1px";
	}

	//Test amount input
	if(amount.value == null){
		amount.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		amount.style.boxShadow = "rgb(181, 234, 215) 0px 1px";
	}

	if(isEmpty){
		alertString = alertString.concat(" ", "Please fill out all required fields.");
		isInvalid = true;
	}
	if(isInvalid){
		alert(alertString);
	}
	return isInvalid;
}
