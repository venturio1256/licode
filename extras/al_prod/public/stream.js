var serverUrl = "/";
var remoteStream, room, streaming;

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function startStreaming (){
  if (room!=undefined){
    if (!streaming){
//      room.startStreaming(remoteStream);
// TODO: Subscribe / Unsubscribe stream in the room
	  remoteStream.play("theVideo",{speaker: true});
	  document.getElementById("streamButton").innerHTML = "Suspend Streaming";
      streaming = true;
    }else{
//      room.stopStreaming(remoteStream);
	  remoteStream.stop();
	  document.getElementById("streamButton").innerHTML = "Resume Streaming";
      streaming = false;
    }
  }
}

function disconnect() {
	if (room!=undefined) {
		room.disconnect();
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

//  localStream = Erizo.Stream({audio: true, video: true, data: true, screen: screen, videoSize: [640, 480, 640, 480]});
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
  
      var subscribeToStreams = function (streams) {
        for (var index in streams) {
          var stream = streams[index];
		  console.log
//          if (localStream.getID() !== stream.getID()) {
			console.log('Stream List ' + stream.getID());
            room.subscribe(stream, {audio: true, video: true});
//          }
        }
      };


  createToken("user", "viewer", function (response) {
    var token = response;
    console.log(token);
    room = Erizo.Room({token: token});

//    localStream.addEventListener("access-accepted", function () {

      room.addEventListener("room-connected", function (roomEvent) {
        subscribeToStreams(roomEvent.streams);
      });

      room.addEventListener("stream-subscribed", function(streamEvent) {
/*		var parent = document.getElementById("theVideo");
		var child = document.getElementById("thePoster");
		parent.removeChild(child);

        var stream = streamEvent.stream;		
		stream.play("theVideo",{speaker: true});
*/
		var myURL = window.URL || webkitURL;
		var stream_url = myURL.createObjectURL(streamEvent.stream.stream);
		document.getElementById("theVideo").src = stream_url;

		});

      room.addEventListener("stream-added", function (streamEvent) {
        var streams = [];
        streams.push(streamEvent.stream);
        subscribeToStreams(streams);
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

//      localStream.show("myVideo");

    });
//    localStream.init();
//  });
};
