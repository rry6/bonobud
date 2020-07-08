var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function adjustForMobile(){
  document.getElementById("subtitleElement").style.fontSize = "22px";
  document.getElementbyId("logo").height = "75";
  document.getElementById("titleElement").style.top="4%";
  document.getElementbyId("donorHeading").style.fontSize = "24px";
  document.getElementbyId("matcherHeading").style.fontSize = "24px";
  document.getElementById("donorDescription").style.fontSize = "14px";
  document.getElementById("matcherDescription").style.fontSize = "14px";
  document.getElementById("donorHeading").style.marginTop = "10px";
  document.getElementById("matcherHeading").style.marginTop = "10px";
  document.getElementById("donorButton").style.padding = "10px 30px";
  document.getElementById("matcherButton").style.padding = "10px 30px";
  document.getElementById("donorButton").href = "donorMobile.html";
}