var serverUrl = "/";

function roomList() {

    var req = new XMLHttpRequest();
    var url = serverUrl + 'getRooms/';
//    var body = {username: userName, role: role};

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        var rooms = JSON.parse(req.responseText);
		console.log(req.responseText);
		for (i=0; i < rooms.length; i++) {
			document.getElementById("events").innerHTML += (i+1) + " - " + rooms[i].name + "<br>";
		}
      }
    };

    req.open('GET', url, true);
//    req.setRequestHeader('Content-Type', 'application/json');
    req.send();
  };

window.onload = function () {
	roomList();
};
