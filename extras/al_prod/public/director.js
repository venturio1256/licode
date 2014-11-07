	var serverUrl = "/";
	var eventName = document.getElementById("eventName");
	var eventDate = document.getElementById("eventDate");
	var eventDescr = document.getElementById("eventDescr");
	var btnEvent = document.getElementById("btnEvent");
//	btnEvent.onclick = createEvent();
//	btnEvent.addEventListener('click', createEvent(),false);

function roomList() {

    var req = new XMLHttpRequest();
    var url = serverUrl + 'getRooms/';
//    var body = {username: userName, role: role};

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        var rooms = JSON.parse(req.responseText);
		console.log(req.responseText);
		for (i=0; i < rooms.length; i++) {
			document.getElementById("events").innerHTML += (i+1) + " - " + rooms[i].name + ":" + rooms[i]._id"<br>";
		}
      }
    };

    req.open('GET', url, true);
//    req.setRequestHeader('Content-Type', 'application/json');
    req.send();
  };
  
function createEvent(btn) {
    var req = new XMLHttpRequest();
    var url = serverUrl + 'createRoom/';
/*	var eventName = document.getElementById("eventName").value;
	var eventDate = document.getElementById("eventDate").value;
	var eventDescr = document.getElementById("eventDescr").value;
*/
	var body = {eventName:eventName.value, eventDate: eventDate.value, eventDescr: eventDescr.value};

    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status == 200) {
        var room = JSON.parse(req.responseText);
		console.log(req.responseText);
		document.getElementById("eventId").innerHTML = "Event # - " + room._id + "<br>";
	  } else { 
		document.getElementById("eventId").innerHTML = "Error: returned status code " + req.status + " " + req.statusText + "<br>";
      }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
};

function manageEvent() {
};

function manageActivity() {
};

/*
window.onload = function () {
	roomList();
};
*/
