//multi-page form
var currentLayer = 'page1';
//shows the next page of form and hides current page
function showLayer(lyr){
	hideLayer(currentLayer);
	document.getElementById(lyr).style.display = 'inline';
	currentLayer = lyr;
	window.scroll({top: 0, left: 0});
}
//hides a specific page
function hideLayer(lyr){
	document.getElementById(lyr).style.display = 'none';
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
var load;

//sets 'load' to order and display all donors by date (oldest-newest)
function loadDefault(){
	load = db.collection("donors").where('status', '==', 'available').orderBy("date").limit(10);
	loadDonors(load);
}

//sets removes "active" from the class of a button (no longer looks like it is pressed)
function inactivate(button) {
	var classes = button.className;
	classes = classes.replace(new RegExp("active","g"),"");
	button.className = classes;
}

//adds "active" to the class of a button (so button looks like it is pressed)
function activate(button) {
	var classes = button.className;
	classes += " active";
	button.className = classes;
}

//filter donors by amount
const under25 = document.querySelector("#under25Button");
const mid = document.querySelector("#midButton");
const over50 = document.querySelector("#over50Button");

//under $25 button: sets 'load' to only donors under $25 and activates/deactivates the correct buttons
function loadUnder25(){
	var classes = under25.className;
	if (classes.indexOf("active")== -1) { //if under $25 button is not already active, load <25 to feed
		html = "";
		load = db.collection("donors").where('status', '==', 'available').where('amount', '<', 25).limit(10);
		loadDonors(load);
		activate(under25)
		inactivate(mid);
		inactivate(over50);

	} else { //if under $25 button is active-> deactivates, then loads default feed by date
		html = "";
		load = db.collection("donors").where('status', '==', 'available').orderBy("date").limit(10);
		loadDonors(load);
		inactivate(under25);
	}
}

//$25 - $50 button: sets 'load' to donors between $25 and $50 inclusive and activates/deactivates the correct buttons
function load25to50(){
	var classes = mid.className;
	if (classes.indexOf("active")== -1) { //if button is not already active, load $25 to $50 to feed
		html = "";
		load = db.collection("donors").where('status', '==', 'available').where('amount', '>=', 25).where('amount', '<=', 50).limit(10);
		loadDonors(load);
		activate(mid);
		inactivate(under25);
		inactivate(over50);

	} else { //if $25-$50 button is active-> deactivates, then loads default feed by date
		html = "";
		load = db.collection("donors").where('status', '==', 'available').orderBy("date").limit(10);
		loadDonors(load);
		inactivate(mid);
	}
}

//over $50 button: sets 'load' to donors above $50 and activates/deactivates the correct buttons
function loadOver50() {
	var classes = over50.className;
	if (classes.indexOf("active")== -1) { //if button is not already active, load above $50 to feed
		html = "";
		load = db.collection("donors").where('status', '==', 'available').where('amount', '>', 50).limit(10);
		loadDonors(load);
		activate(over50);
		inactivate(under25);
		inactivate(mid);

	} else { //if over $50 button is active-> deactivates, then loads default feed by date
		html = "";
		load = db.collection("donors").where('status', '==', 'available').orderBy("date").limit(10);
		loadDonors(load);
		inactivate(over50);
	}
}

//main function to load feed of donors, content = a sorted query from Firebase
//takes a snapshot of each document in the query and displays the information in individual boxes
function loadDonors(content){
	content.get()
  .then(function(querySnapshot){
    querySnapshot.forEach(function(doc) {
      var id = doc.id;
      var name = doc.data().name;
      var amount = doc.data().amount;
      var charity = doc.data().charity;
      var link = doc.data().link;
      var reason = doc.data().reason;
			var date = doc.data().date.toDate();
      html += `<div id= ${id} type="button" class="btn displayBox bigBox"
			onClick= "saveId('${id}');copyBox('${id}','${link}');showLayer('page2')">
      $${amount} to
      <a href="${link}" class="btn btn-lg displayBox linkBox" role="button"
			target = "_blank" aria-pressed="true"><b>${charity}</b></a>
      <div>By ${name}</div>
      <br>Reason: ${reason}
      <br>Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</div>`
    })
		//sets 'load' to the next query to be loaded when 'load more' button is pressed
		var n = querySnapshot.docs.length;
		if (n==10) { //checks if the last query was full, if so there may be more to be loaded
			var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
			load = load.startAfter(lastVisible);
			loadMore.setAttribute("onclick", "more()");
			loadMore.value = "Load more";
		} else { //if last query wasn't full, it means there are no more docs to be loaded
			loadMore.onclick = ""; //deactivates load more button
			loadMore.value = "All results loaded";
		}
  })
  .then(function(){ //after all documents in query are formatted, they are displayed on web page
    document.getElementById("feed").innerHTML = html;
  })
	.catch(function(error) {
    console.error("Error adding donor: ", error);
  });
}

//saves selected donor ID to global variable donorId (to be saved to matcher field later)
function saveId(id) {
  donorId = id;
}

//clones selected donor box for reference when filling out information form
function copyBox(id,link) {
  var clone = document.getElementById(id).cloneNode(true);
  // clone.onclick= "";
	// clone.style.pointerEvents="none";
	clone.setAttribute("onclick","window.open('"+link+"', '_blank'); return false;");
  document.getElementById("donorSummary").innerHTML = "";
  document.getElementById("donorSummary").appendChild(clone);
}

//loads next 10 donors (load more button)
function more() {
	loadDonors(load);
}

//search by charity name (searchBar input) when searchButton is pressed
var searchInput = document.querySelector("#searchBar");
const searchButton = document.querySelector("#searchButton");

//main search function: checks charityArray field of all Firebase donor docs for searched terms
//charityArray= array of all possible consecutive word combinations of charity name set in donor.js
function search() {
	if (searchButton.value == "Search!") { //search database if searchButton says 'search'
		var input = searchInput.value.toLowerCase();
		var output = db.collection("donors").where("charityArray", "array-contains", input).limit(10);
		html = "";
		loadDonors(output);
		searchButton.value = "Cancel"; //turns search button to say cancel when search is complete
		activate(searchButton);
		inactivate(under25); //completely inactivate any $ filters previously clicked
		under25.onclick = "";
		inactivate(mid);
		mid.onclick = "";
		inactivate(over50);
		over50.onclick = "";
	} else { //if searchButton says 'cancel', then cancel and reset the query
		searchInput.value = "";
		searchButton.value = "Search!";
		inactivate(searchButton);
		html = "";
		loadDefault();
		under25.setAttribute("onclick", "loadUnder25()"); //reactivate filter by amount buttons
		mid.setAttribute("onclick", "load25to50()");
		over50.setAttribute("onclick", "loadOver50()");
	}
}

//edit a search by clicking on the input bar (so it says search instead of cancel)
searchInput.addEventListener("click", function(event) {
	if (searchButton.value == "Cancel") {
		searchButton.value = "Search!";
		inactivate(searchButton);
	}
});

//change your mind and click away from search bar without searching (button says cancel instead of search)
function blurInput() {
	if (searchButton.value == "Search!") {
		searchButton.value = "Cancel";
		activate(searchButton);

	}
}

//so that onblur of searchInput excludes clicking searchButton
searchButton.setAttribute("onmouseover", "unblurInput()");
searchButton.setAttribute("onmouseout", "reblurInput()");

function unblurInput() {
	searchInput.onblur = "";
}

function reblurInput() {
	searchInput.setAttribute("onblur", "blurInput()");
}

//click searchButton by pressing enter
searchInput.addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13 && searchButton.value == "Search!") {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		searchButton.click();
		//deselect search button
		this.blur();
	}
});

//log matcher info from form
const mName = document.querySelector("#nameInput");
const mCompany = document.querySelector("#companyInput");
const mRate = document.querySelector("#matcherRate");
const mCompanyemail = document.querySelector("#emailInput");
const mEmail = document.querySelector("#personalEmailInput");
const mNote = document.querySelector("#noteInput");
const mSave = document.querySelector("#submitButton");

//create new matcher doc in firebase with input information
mSave.addEventListener("click", function(){
	if(!empty()) {
		db.collection("donors").doc(donorId).get() //reread the specific donor chosen
			.then(function (snapshot) {
				if (snapshot.data().status == "available") { //double check that the donor is still available
					var newMatcher = db.collection("matchers").doc();
					var first = mName.value.split(" ")[0];
					newMatcher.set({ //writes new matcher to firebase
						name: mName.value,
						firstname: first,
						company: mCompany.value,
						rate: Number(mRate.value),
						cemail: mCompanyemail.value,
						pemail: mEmail.value,
						note: mNote.value,
						date: firebase.firestore.FieldValue.serverTimestamp(),
						donorID: donorId
					})
						.then(function () {
							location.href = 'matcherSubmission.html'; //matcher success page
						})
						.catch(function (error) {
							console.error("Error adding donor: ", error);
							location.href = 'matcherSubmitFail.html'; //matcher fail page
						});
				} else {
					location.href = 'matcherSubmitFail.html'; //matcher fail page if donor status isn't available anymore
				}
			});
	}
})

//pairing complete-> send email to mEmail.value and donor email (read from firebase)
//use donorId to find doc with donor email, double check status, and change status to matcherid


function empty(){
	var nameInput = document.getElementById("nameInput");
	var companyInput = document.getElementById("companyInput");
	var matcherRate = document.getElementById("matcherRate");
	var emailInput = document.getElementById("emailInput");
	var secondEmailInput = document.getElementById("emailInput2");
	var personalEmailInput = document.getElementById("personalEmailInput");
	var secondPersonalEmailInput = document.getElementById ("personalEmailInput2");
	var reasonMessage = document.getElementById("noteInput");
	var alertString = " ";

	var emailRegex = RegExp('^\\S+@\\S+$');

	var isEmpty = false;
	var isInvalid = false;

	//Test name value
	if(nameInput.value.trim() == ""){
		nameInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		nameInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Test company name value
	if(companyInput.value.trim() == ""){
		companyInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		companyInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Test rate input
	if(matcherRate.value == 0){
		matcherRate.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		matcherRate.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Tests if second company email matches the first
	if(secondEmailInput.value.trim() != emailInput.value.trim()){
		emailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		secondEmailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		alertString = alertString.concat("Make sure both of the company emails match. ");
		isInvalid = true;
	}
	else{
		emailInput.style.boxShadow = "#FFDAC1 0px 1px";
		secondEmailInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Test company email value
	if(emailInput.value.trim() == ""){
		emailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		emailInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Test second company email value
	if(secondEmailInput.value.trim() == ""){
		secondEmailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		secondEmailInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Tests if second personal email matches the first
	if(secondPersonalEmailInput.value.trim() != personalEmailInput.value.trim()){
		personalEmailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		secondPersonalEmailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		alertString = alertString.concat("Make sure both of the personal emails match. ");
		isInvalid = true;
	}
	else{
		secondPersonalEmailInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Test personal email value and validation
	if(personalEmailInput.value.trim() == ""){
		personalEmailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else if(!emailRegex.test(personalEmailInput.value)){
		personalEmailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		alertString = alertString.concat("Please enter a valid email. ");
		isInvalid = true;
	}
	else{
		personalEmailInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Test second personal company email value
	if(secondPersonalEmailInput.value.trim() == ""){
		secondPersonalEmailInput.style.boxShadow = "rgb(255,105,97) 0px 1px";
		isEmpty = true;
	}
	else{
		secondPersonalEmailInput.style.boxShadow = "#FFDAC1 0px 1px";
	}

	//Tests reason input
	if(reasonMessage.value.trim().length > 150){
    reasonMessage.style.background =  "rgba(255,105,97, 0.10)";
    alertString = alertString.concat("Please make sure your note is under 150 characters. ");
    isInvalid = true;
  }
  else{
    reasonMessage.style.background =  "rgba(255, 218, 193, 0.20)";
  }

	if(isEmpty){
		alertString = alertString.concat("Please fill out all required fields. ");
		isInvalid = true;
	}
	if(isInvalid){
		alert(alertString);
	}
	return isInvalid;
}
