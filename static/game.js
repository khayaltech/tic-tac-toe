const room_code = JSON.parse(document.getElementById('room_code').textContent);
const username = JSON.parse(document.getElementById('username').textContent);
var player = username.charAt(0);

var connectionString = 'ws://' + window.location.host + '/ws/game/' + room_code + '/';
var socket = new WebSocket(connectionString);


let gameState = ["", "", "",
                 "", "", "",
                 "", "", ""];


let elementArray = document.querySelectorAll(".space");
let myturn=true;

elementArray.forEach((element) => {
  element.addEventListener("click", (event) => {
    setText(event.path[0].getAttribute("data-cell-index"), player);
  });
});



//function for checking the end or not
function checkGameEnd() {
  var count = 0;

  gameState.map((game) => {
    if (game != "") {
      count++;
    }
  });

  if (count >= 9) {
    var data = { type: "over", message:'Game is over no one won!' };
    socket.send(JSON.stringify(data));
    // swal("Good over!", "Game end no one won", "warning");
  }
}


//function to define who is winner
function checkWon(value, player) {
  var won = false;

  if (
    gameState[0] === value &&
    gameState[1] == value &&
    gameState[2] == value
  ) {
    won = true;
  } else if (
    gameState[3] === value &&
    gameState[4] == value &&
    gameState[5] == value
  ) {
    won = true;
  } else if (
    gameState[6] === value &&
    gameState[7] == value &&
    gameState[8] == value
  ) {
    won = true;
  } else if (
    gameState[0] === value &&
    gameState[3] == value &&
    gameState[6] == value
  ) {
    won = true;
  } else if (
    gameState[1] === value &&
    gameState[4] == value &&
    gameState[7] == value
  ) {
    won = true;
  } else if (
    gameState[2] === value &&
    gameState[5] == value &&
    gameState[8] == value
  ) {
    won = true;
  } else if (
    gameState[0] === value &&
    gameState[4] == value &&
    gameState[8] == value
  ) {
    won = true;
  } else if (
    gameState[2] === value &&
    gameState[4] == value &&
    gameState[6] == value
  ) {
    won = true;
  }

  if (won) {
    var data = { type: "end", player: player, message:`${player} is winner, play again?`};
    socket.send(JSON.stringify(data));
    return;
    // swal("Good job!", "You won", "success");
  }
    checkGameEnd();


}


function setText(index, value) {
  var data = {
    player: player,
    index: index,
    type: "running",
  };

  if (gameState[parseInt(index)] == "") {

    if(myturn){
        myturn=false;
        gameState[parseInt(index)] = value;
        elementArray[parseInt(index)].innerHTML = value;
        socket.send(JSON.stringify(data));
        document.getElementById("alert_move").style.display = 'none'; // Hide

        checkWon(value, player);
    }
    else{
        alert('Wait for your turn, please!')
    }

  } else {
    alert("This cell is full");
  }
}

function setAnotherText(index, value) {
  gameState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
}


socket.onopen = function (e) {
  console.log("Socket connected");
};

function reset() {
  console.log("reset called");
  gameState = ["", "", "",
               "", "", "",
               "", "", ""];
  myturn=true;
  count = 0;
  document.getElementById("alert_move").style.display = 'inline';
  for (var i = 0; i < elementArray.length; i++){
    elementArray[i].innerHTML = "";
}


}
socket.onmessage = function (e) {
  var data = JSON.parse(e.data);
  if (data.payload.type == "end") {
    alert(data.payload.message)
    reset();

  } else if (data.payload.type == "over") {
    alert(data.payload.message);
    reset();
  } else if (data.payload.type == "running" && data.payload.player !== player) {
    setAnotherText(data.payload.index, data.payload.player);
    document.getElementById("alert_move").style.display = 'inline';
    myturn=true;
  }
};
