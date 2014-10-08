var serverUrl = "/";
var localStream, room, broadcasting,recording,recordingId;

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function startBroadcasting (){
  if (room!=undefined){
    if (!broadcasting){
//      room.startBroadcasting(localStream);
// TODO: Publish / Unpublish stream in the room
	  localStream.play("myVideo",{speaker: true});
	  document.getElementById("broadcastButton").innerHTML = "Suspend Broadcasting";
      if (!recording){
		room.startRecording(localStream, function(id) {
			recording = true;
			recordingId = id;
		}, function(err){
			console.log("error streaming ",err);
		});
	  }
      broadcasting = true;
    }else{
//      room.stopBroadcasting(localStream);
		if (recording){
			room.startRecording(recordingId, function(id) {
				recording = true;
				recordingId = id;
			}, function(err){
				console.log("error streaming ",err);
			});
		}
	  localStream.stop();
	  document.getElementById("broadcastButton").innerHTML = "Resume Broadcasting";
      broadcasting = false;
    }
  }
}


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
  recording = false;
  var screen = getParameterByName("screen");

  localStream = Erizo.Stream({audio: true, video: true, data: true, screen: screen, videoSize: [320, 240, 640, 480]});
  var createToken = function(userName, role, callback) {

    var req = new XMLHttpRequest();
    var url = serverUrl + 'createToken/';
    var body = {username: userName, role: role};

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        callback(req.responseText);
      }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
  };

  createToken("user", "presenter", function (response) {
    var token = response;
    console.log(token);
    room = Erizo.Room({token: token});

    localStream.addEventListener("access-accepted", function () {
      var subscribeToStreams = function (streams) {
        for (var index in streams) {
          var stream = streams[index];
		  console.log
          if (localStream.getID() !== stream.getID()) {
			console.log('Stream List ' + stream.getID());
//            room.subscribe(stream);
			}
        }
      };

      room.addEventListener("room-connected", function (roomEvent) {

        room.publish(localStream, {maxVideoBW: 600});
//        subscribeToStreams(roomEvent.streams);
      });

      room.addEventListener("stream-subscribed", function(streamEvent) {
        var stream = streamEvent.stream;
        var div = document.createElement('div');
        div.setAttribute("style", "width: 320px; height: 240px;");
        div.setAttribute("id", "test" + stream.getID());

        document.body.appendChild(div);
        stream.play("test" + stream.getID());

      });

      room.addEventListener("stream-added", function (streamEvent) {
        var streams = [];
        streams.push(streamEvent.stream);
//        subscribeToStreams(streams);
      });

      room.addEventListener("stream-removed", function (streamEvent) {
        // Remove stream from DOM
        var stream = streamEvent.stream;
        if (stream.elementID !== undefined) {
          var element = document.getElementById(stream.elementID);
          document.body.removeChild(element);
        }
      });

      room.connect();

      localStream.play("myVideo",{speaker: true});
//	  document.getElementById("broadcastButton").innerHTML = "Suspend Broadcasting";
	  broadcasting = true;


    });
    localStream.init();
  });
};
