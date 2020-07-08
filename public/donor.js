//Mobile Check
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
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
				status: "available" //available = display in feed, matcherid = donor is matched, expired = after 2 weeks
			})
			.then(function () {
        if(isMobile){
          location.href ='submissionMobile.html';
        }
        else{
          location.href = 'submission.html';
        }
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
