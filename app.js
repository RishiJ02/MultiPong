// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBtLRlcXkrQQTcs-1Qp1Od2rbPoYcwTEHE",
    authDomain: "sync-test-game.firebaseapp.com",
    databaseURL: "https://sync-test-game.firebaseio.com",
    projectId: "sync-test-game",
    storageBucket: "sync-test-game.appspot.com",
    messagingSenderId: "825894585819"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


var canvas = document.getElementById("myCanvas");
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
//canvas.width = screen.width;
//canvas.height = screen.height;
console.log(screen.width);
console.log(screen.height);
var ctx = canvas.getContext("2d");
canvas.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
canvas.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
canvas.addEventListener("touchmove", function (e) {
	var touch = e.touches[0];
		  if (e.target == canvas) {
			e.preventDefault();
		  }
            	database.ref().set({
  		  		  x:touch.clientX,
  		  		  y:touch.clientY
	  		});
}, false);
        canvas.addEventListener('mousemove', function(evt) {
        evt.preventDefault();
          console.log('Mouse position: ' + evt.clientX + ',' + evt.clientY);
          	//database.ref().set({
		  		 // x:evt.clientX,
		  		 // y:evt.clientY
	  		//});
      }, false);
  database.ref().on("value", function(e){
  	ctx.clearRect(0, 0, canvas.width, canvas.height);
  	ctx.fillRect(e.val().x,e.val().y,10,10);
  });