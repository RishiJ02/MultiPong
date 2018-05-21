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

//Creates a canvas 
const canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Creates the paddle image
var paddleImage = new Image();
paddleImage.src = "paddle.png";

//Sets Ball Position
var ballY = document.body.clientHeight/2;
var ballX = document.body.clientWidth;

//Sets Paddle Position
var paddleX = 5;
var paddleY = 5;

//Sets Ball Speed
var ballVX = 5;
var ballVY = 4;

var score=0;

//Creates the event listeners in app.js after paddle loads in
paddleImage.onload = function(e){
	console.log("START");
	start();


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
    paddleY = touch.clientY;
    }, false);

}

//Defines a function that initializes variables at the start
function start(){
	canvas.width = document.body.clientWidth;
	canvas.height = window.innerHeight;
	var loop = setInterval(render,10);
}

//Creates Master-Slave system that makes it so that two devices can communicate with each other
//Master has no advantages, the master just uses firebase more so the calculations between 
//the two devices don't create interferences or differences
var MASTER=false;
var oppWidth;
var RUN = false;
database.ref().once("value", function(e){
  	if(e.val().first == null || e.val().first == false){
		database.ref().update({first: true});
		MASTER=true;
		paddleX=5;
	}else if (e.val().full == null || e.val().full == false){
		database.ref().update({full: true});
		MASTER=false;
		paddleX=document.body.clientWidth-55;
	}else{
	    database.ref().update({
  		first: false,
		full: false,
		x:ballX,
		y:ballY,
		screenWidth: document.body.clientWidth,
		VX:10,
		slaveScore: 0,
		masterScore: 0
	    });
		database.ref().update({first: true});
		MASTER=true;
		paddleX=5;
	}
	oppWidth = e.val().screenWidth;
	RUN = true;
  });

var oldSlaveScore = 0;
var disScore = 0;

//Calculations on ball position and updates variables
database.ref().on("value", function(e){
	if(RUN){
	if(MASTER){
  		ballX = e.val().x;
		if(oldSlaveScore!=e.val().slaveScore){
			oldSlaveScore=e.val().slaveScore;
			disScore = e.val().slaveScore
			database.ref().update({
				x:document.body.clientWidth,
				y:document.body.clientHeight/2
			});
		}
	}else{
		ballX = e.val().x-oppWidth;
		disScore = e.val().masterScore;
	}
	ballY = e.val().y;
	}
	ballVX = e.val().VX;
  });
//clears the screen
function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//renders the ball
function renderBall(){
	ctx.beginPath();
	ctx.arc(ballX, ballY, 50, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
}
//renders the paddle and creates code that detects collisions with the paddle and ball
var contact = 0;
function renderPaddle(){
	ctx.fillRect(paddleX,paddleY,50,400);
	if(MASTER){
		if(ballX-50>=paddleX && ballX-50<=paddleX+50 &&  ballY+10>=paddleY && ballY-10<=paddleY+400 && contact>100){
			contact=0;
			database.ref().update({VX: ballVX *-1});
		}else{
			contact++;
		}
	}else if(RUN){
		if(ballX+50>=paddleX && ballX+50<=paddleX+50 &&  ballY+10>=paddleY && ballY-10<=paddleY+400 && contact>100){
			contact=0;
			database.ref().update({VX: ballVX *-1});
		}else{
			contact++;
		}
	}
}
//Increments score, checks if the ball hits any wall, updates positions and renders all existent items in the game
var scoreRec = false;
var count =0;
var hitWall = false;
function render(){
	count++;
	clear();
	if(MASTER){
		if(ballY-50+ballVY<0||ballY+50+ballVY>window.innerHeight&&!hitWall){
			ballVY=ballVY*-1;
			hitWall = true;
		}else{
			hitWall = false;
		}
		database.ref().update({
   			x:ballX+ballVX,
			y:ballY+ballVY
		});
		if(ballX<=0&&!scoreRec){
			scoreRec=true;
			score++;
			database.ref().update({
				masterScore: score,
				x:document.body.clientWidth,

				y:document.body.clientHeight/2
			});
		}else{
			scoreRec=false;
		}
	}else{
		if(ballX>=document.body.clientWidth&&!scoreRec){
			scoreRec=true;
			score++;
			database.ref().update({
				slaveScore: score
			});
		}else{
			scoreRec=false;
		}
	}
	renderPaddle();	
	renderBall();
}
