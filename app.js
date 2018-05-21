// Initialize Firebase
  var config = {
    apiKey: "AIzaSyD3BeP-u_ia56MHUMawVCHLvz2V4CICMKc",
    authDomain: "multipong-40f96.firebaseapp.com",
    databaseURL: "https://multipong-40f96.firebaseio.com",
    projectId: "multipong-40f96",
    storageBucket: "multipong-40f96.appspot.com",
    messagingSenderId: "1051815741574"
  };
   firebase.initializeApp(config);

   var database = firebase.database();

// Sets screen size, creates a canvas
    var canvas = document.getElementById("myCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
//Adds event listeners to look for specific events, these involve touching the screen
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
//Clears everything on the database so that objects don't leave trails or get messy
    database.ref().on("value", function(e){
  	ctx.clearRect(0, 0, canvas.width, canvas.height);
  	ctx.fillRect(e.val().x,e.val().y,10,10);
    });