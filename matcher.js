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

//building explore feed
var html = ``;
var donorId;
const loadMore = document.querySelector("#loadButton");

var load = db.collection("donors").where('status', '==', 'available').orderBy("date").limit(10);
loadDonors(load);

function loadDonors(content){
	content.get() //oldest to newest
	//use firebase function to get rid of expired
  .then(function(querySnapshot){
    querySnapshot.forEach(function(doc) {
      var id = doc.id;
      var name = doc.data().name;
      var amount = doc.data().amount;
      var charity = doc.data().charity;
      var link = doc.data().link;
      var reason = doc.data().reason; //check to see if reason exists
      html += `<div id= ${id} type="button" class="btn btn-outline-primary" onClick= "saveId('${id}');copyBox('${id}');showLayer('page3')">
      $${amount} to
      <a href="${link}" class="btn btn-lg btn-primary" role="button" target = "_blank" aria-pressed="true"><b>${charity}</b></a>
      <div>By ${name}</div>
      <br>Reason: ${reason}
      <br>ID: ${id}
      <br>Date: ${doc.data().date.toDate()}</div> `
    })
		var n = querySnapshot.docs.length-1;
		if (n==9) {
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
			load = db.collection("donors").where('status', '==', 'available').orderBy("date").startAfter(lastVisible).limit(10);
		} else {
			loadMore.style = "visibility: hidden";
		}
  })
  .then(function(){
    document.getElementById("feed").innerHTML = html;
  })
	.catch(function(error) {
    console.error("Error adding donor: ", error);
  });
}

function saveId(id) {
  donorId = id;
}

//clones selected donor box for reference when filling out form
function copyBox(id) {
  console.log(id);
  var clone = document.getElementById(id).cloneNode(true);
  clone.onclick= "";
  document.getElementById("donorSummary").innerHTML = "";
  document.getElementById("donorSummary").appendChild(clone);
}

//load next 10 donors
function more() {
	loadDonors(load);
}

//log matcher info
const mName = document.querySelector("#nameInput");
const mCompany = document.querySelector("#companyInput");
const mRate = document.querySelector("#matcherRate");
const mCompanyemail = document.querySelector("#emailInput");
const mEmail = document.querySelector("#personalEmailInput");
const mNote = document.querySelector("#noteInput");
const mSave = document.querySelector("#submitButton");

mSave.addEventListener("click", function(){
  var newMatcher = db.collection("matchers").doc();
  newMatcher.set({
    name: mName.value,
    company: mCompany.value,
    rate: mRate.value,
    cemail: mCompanyemail.value,
    pemail: mEmail.value,
    note: mNote.value,
    date: firebase.firestore.FieldValue.serverTimestamp(),
    donorID: donorId
  })
  .then(function() {
		  document.getElementById("submitted").innerHTML = ("<h1>Success! Thank you for submitting! <br> ID: "
				       + newMatcher.id + "<br> email: " + mEmail.value);
  })
  .catch(function(error) {
      console.error("Error adding donor: ", error);
      document.getElementById("submitted").innerHTML = "<h1>Error processing matcher. Please try again later.</h1>";
  });
})

//pairing complete: send email to mEmail.value and donor email (read from firebase)
//reach into donor doc with donorId and find info for email, double check status, write matcherid, and change status to complete
