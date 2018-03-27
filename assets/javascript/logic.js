
// Initialize Firebase
var config = {
apiKey: "AIzaSyCfRalZ0YIuxocxbVbI1A9ZZT2Rlnk3WOk",
authDomain: "rps-multiplayer-98e74.firebaseapp.com",
databaseURL: "https://rps-multiplayer-98e74.firebaseio.com",
projectId: "rps-multiplayer-98e74",
storageBucket: "",
messagingSenderId: "70711430600"
};
firebase.initializeApp(config);

var database = firebase.database();
var player1 = player2 = false;
var win1 = losses1 = win2 = losses2 = 0;
var choice1 = choice2 = null;
var turn = 1;
var gameReset = false;
var currentPlayer = null;
var player = null;


function addListeners(player){
	if(player == "player1"){

		//turn on the html headers and add listeners
		$("#rock1").on("click", function(){
			console.log("rock");
			//function to push the choice to the database
			//and reset the choice of the HTML
			updateChoice("first","Rock");
		});

		$("#paper1").on("click", function(){
			console.log("paper");
			updateChoice("first","Paper");
		});

		$("#scissors1").on("click", function(){
			console.log("scissors");
			updateChoice("first","Scissors");
		});

	}
	else if(player == "player2"){
		$("#rock2").on("click", function(){
			console.log("rock");
			updateChoice("second","Rock");
		});

		$("#paper2").on("click", function(){
			console.log("paper");
			updateChoice("second","Paper");
		});

		$("#scissors2").on("click", function(){
			console.log("scissors");
			updateChoice("second","Scissors");
		})

	}

};

//function to check the amount of players
function initHTML(player){
	//check to see which player's html to setup
	if(player === "first"){
		//turn on the html headers and add listeners
		$("#rock1").show();

		$("#paper1").show();

		$("#scissors1").show();

		//setup wins and losses based off database
		$("#wins-losses1").text("Wins: " + win1 + " Losses: " + losses1);

	}
	else if(player === "second"){
		//turn on the html headers and add listeners
		$("#rock2").show();

		$("#paper2").show();

		$("#scissors2").show();

		//setup wins and losses based off database
		$("#wins-losses2").text("Wins: " + win2 + " Losses: " + losses2);

	}
};

function playAgain(player){
	console.log(player);
	//clean up HTML
	$("#winner-name").hide();
	$("#results").hide();
	$("#choice1").hide();
	$("#choice2").hide();
	gameReset = true;
	
	if(player == "second"){
		turn = 1;
		database.ref().update({turn:turn});
		database.ref("players/second").update({choice: null});
	}
	else if(player == "first"){
		database.ref("players/first").update({choice: null});

	}
	initHTML(player);
}

//function that will update database with user's choice and update html
function updateChoice(player, choice){
	//update the database
	if(player === "first"){
		database.ref("players/first").update({choice : choice});
		$("#rock1").hide();
		$("#paper1").hide();
		$("#scissors1").hide();
		$("#rock2").hide();
		$("#paper2").hide();
		$("#scissors2").hide()
		$("#choice1").show();
		$("#choice1").text(choice);
		//update turn after choice is made
		//get the value for turn
		/*turn++;
		database.ref().update({turn:turn});*/

	}
	else if(player === "second"){
		database.ref("players/second").update({choice : choice});
		$("#rock1").hide();
		$("#paper1").hide();
		$("#scissors1").hide();
		$("#rock2").hide();
		$("#paper2").hide();
		$("#scissors2").hide();
		$("#choice2").text(choice);
		$("#choice2").show();
	}
};

function revealMove(winner){
	if(winner == "player1"){
		$("#winner-name").text($("#player1-name").text()).on("click", function(){
			playAgain(player);
		});
		$("#choice1").show();
		$("#choice2").show();
		$("#winner-name").show();
		$("#results").show();
		//update win column/ loss column
		win1++;
		database.ref("players/first").update({wins: win1});
		losses2++;
		database.ref("players/second").update({losses: losses2});
		database.ref("playes/first").update({choice: null});
		database.ref("playes/second").update({choice: null});
	}
	else if(winner == "player2"){
		$("#winner-name").text($("#player2-name").text()).on("click", function(){
			playAgain(player);
		});
		$("#winner-name").show();
		$("#results").show();
		$("#choice1").show();
		$("#choice2").show();
		//update win column/ loss column
		win2++;
		database.ref("players/second").update({wins: win2});
		losses1++;
		database.ref("players/second").update({losses: losses1});
		database.ref("playes/first").update({choice: null});
		database.ref("playes/second").update({choice: null});
	}
	else if(winner == "tie"){
		$("#winner-name").text("Tie Game").on("click", function(){
			playAgain();
		});
		database.ref("playes/first").update({choice: null});
		database.ref("playes/second").update({choice: null});
	}

};

//form click to blank it
$("#player-name-input").on("click", function(){
	$(this).val("");
});

//button on click to begin the game
$("#enter-player-button").on("click", function(event){
	event.preventDefault();
	//form disappears
	$("#player-name-input").hide();
	$(this).hide();
	//get name entered
	if($("#player-name-input").val() != ""){
		var name = $("#player-name-input").val();
		//push to database
		//check to see if player is in database
		database.ref("players/first").once("value").then(function(snapshot){
			if(snapshot.exists()){
				//add number second player
				localStorage.setItem("player", "second");
				console.log("From local: " + localStorage.getItem("player"));
				player2 = true;
				database.ref().child("players/second").set({
					player: "second",
					losses: 0,
					name: name,
					wins: 0			
				});

				player = "second";
				//init function to set up the html
				initHTML(player);

				$("#player-info").text("Hi " + name + " you are player 2");

				//adding the onDisconnect listener which removes data for player
				//database.ref("players/second").onDisconnect().remove();
				database.ref("players/").child("second").onDisconnect().remove();
			}
			else{
				//add number 1
				player1 = true;
				player = "first";
				database.ref().child("players/first").set({
					player: "first",
					losses: 0,
					name: name,
					wins: 0	
				});
				//init function to set up the html
				initHTML(player);
				$("#player-info").text("Hi " + name + " you are player 1");

				//adding the onDisconnect listener which removes data for player
				database.ref("players/first").onDisconnect().remove();
				//database.ref("players/").child("first").onDisconnect().remove();
			}

		});
	}

});

//on child-added listener
database.ref("players/").on("child_added", function(snapshot) {
  // We are now inside our .on function...
  //update the html
  if(snapshot.val().player == "first"){
  	//display status
	$("#player1-name").text(snapshot.val().name);
	//get wins and losses
	win1 = (snapshot.val().wins);
	losses1 = snapshot.val().losses;
	//check to see if turn has been initialized
	database.ref("turn").once("value").then(function(snapshot){
		if(!snapshot.exists() && player2 == true){
			console.log("exists on player 1");
			database.ref().child("turn").set(1);
		}
	});
  }
  else if(snapshot.val().player == "second"){
  	//display status
	$("#player2-name").text(snapshot.val().name);
	//get wins and losses
	win2 = snapshot.val().wins;
	losses2 = snapshot.val().losses;
	//check to see if turn has been initialized
	database.ref("turn").once("value").then(function(snapshot){
		if(!snapshot.exists() && player1 == true){
			console.log("exists on player 2");
			database.ref().child("turn").set(1);
		}
	});
  }
  //add
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//add on child delete, remove turn
database.ref("players/").on("child_removed", function(snapshot){
	console.log(snapshot.val());
	database.ref().child("turn").remove();
	//reset the looks
	if(snapshot.val().player == "first"){
		player1 = false;
  		//display status
		$("#player1-name").text("Waiting for Player 1");
 	}
 	else if(snapshot.val().player == "second"){
 		player2 = false;
 		$("#player2-name").text("Waiting for Player 2");
 	}

});

//on CHILD_CHANGED, fires when the user makes his/her move
database.ref("players/").on("child_changed", function(snapshot){
	console.log("This child was changed: " + JSON.stringify(snapshot.val()));
	//function to compare choices
	if(snapshot.val().player == "first"){
		choice1 = snapshot.val().choice;
		//update turn
		if(player == "first"){
			database.ref().update({turn:2});
		}
	}
	else if(snapshot.val().player == "second"){
		choice2 = snapshot.val().choice;
		if(player == "second"){
			database.ref().update({turn:3});
		}
		
	}
});

//check the turn
database.ref("turn").on("value", function(snapshot){

	if(snapshot.val() == 3 && choice1 != null){
		if(choice1 == choice2){
			//then we have a tie
			revealMove("tie");
		}
		else if((choice1 == "Rock" && choice2 == "Paper") || (choice1 == "Paper" && choice2 == "Scissors") ||
		(choice1 == "Scissors" && choice2 == "Rock")){
			revealMove("player2");
			//player 1 loses
			//player 2 wins
			console.log("player 2 wins");
		}
		else if((choice2 == "Rock" && choice1 == "Paper") || (choice2 == "Paper" && choice1 == "Scissors") ||
		(choice2 == "Scissors" && choice1 == "Rock")){
			//player 2 loses
			console.log("player 1 wins");
			revealMove("player1");
		}
	}
	else if(snapshot.val() == 2){
		addListeners("player2");
		//setup wins and losses based off database
		$("#wins-losses2").text("Wins: " + win2 + " Losses: " + losses2);
	}
	else if(snapshot.val() == 1){
		//initHTML("first");
		console.log("called init1")
		addListeners("player1");
		//setup wins and losses based off database
		$("#wins-losses1").text("Wins: " + win1 + " Losses: " + losses1);
	}

});