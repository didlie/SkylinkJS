//--------
function blink(){
  $("#LED").attr("src","green-led.png");
  setTimeout(function(){$("#LED").attr("src","grey-led.png");},500);
};
//--------
function addPeer( peer ){
  var newListEntry = '<li id="user' + peer.id + '" class="badQuality">'
    + '<div style="text-align:center;"><h4>' + peer.displayName + '</h4>';
  for( var i=0; i<6; i++) newListEntry += '<div class="circle ' + i + '"></div>';
  newListEntry += '</div></li>'
  $("#contactList ul.active").append( newListEntry );
  $("#user" + peer.id + " .0").css("background-color","green"); 
};
//--------
function rmPeer( peerID ){ $("#user" + peerID).remove(); };
//--------
$(":button").hide();
//--------
// this is arbitrary, but in this implementation, we only join the room
// once the channel has been open AND we have a stream.
// we coul djoin the room without a stream, and be in receive-only mode
function maybeJoin( t ){
  if( !started && gotChannel && gotStream )
    $("#joinRoomBtn").show();
}
//--------
$("#gumBtn"         ).click( function(e){ t.getDefaultStream(); } );
$("#openChannelBtn" ).click( function(e){ t.openChannel();      } );
$("#joinRoomBtn"    ).click( function(e){ t.joinRoom();         } );
$("#leaveRoomBtn"   ).click( function(e){ t.leaveRoom();        } );
//--------
var gotChannel = false;
var gotStream  = false;
var started    = false;
//--------
// get the variables needed to connect to skyway
var roomserver = 'http://54.251.99.180:8080/';
var owner = 'MomentMedia';
var room  = null;
var nbPeers = 0;
var t = new Temasys( roomserver, owner, room );
//--------
t.on("channelOpen", function(){
   gotChannel = true; maybeJoin( t ); $("#openChannelBtn").hide(); $("joinRoomBtn").show();
});
//--------
t.on("joinedRoom", function(){
  $("#joinRoomBtn").hide(); $("#leaveRoomBtn").show();
});
//--------
t.on("channelMessage", function(){ blink(); });
//--------
t.on("addPeerStream",  function(args){
   nbPeers += 1;
  $("#videoRemote" + nbPeers)[0].peerID = args[0];
  attachMediaStream( $('#videoRemote' + nbPeers)[0], args[1] );
});
//--------
t.on("mediaAccessSuccess", function(args){
  attachMediaStream( $('#videoLocal1')[0], args[0] );
  gotStream = true; maybeJoin( t ); $("#gumBtn").hide();
});
//--------
t.on("readystateChange", function(args){
  if(!args[0]) return;
  $("#openChannelBtn").show(); $("#gumBtn").show(); 
});
//--------
t.on("peerJoined", function(args){
  addPeer({ id: args[0] , displayName: args[0] });
});
//--------
t.on("peerLeft", function(args){
  $("video").each( function(){
    if( this.peerID == args[0] ){
      this.enabled = false; this.currentSrc = ''; this.poster = '/default.png';
    }
  });
 rmPeer( args[0] ); 
});
//--------
t.on("handshakeProgress", function(args){
  var stage = 0;
  switch( args[0] ){
    case 'welcome': stage = 1; break;
    case 'offer'  : stage = 2; break;
    case 'answer' : stage = 3; break;
  }
  for( var i=0; i<=stage; i++ )
    $("#user" + args[1] + " ." + i ).css("background-color","green");
});
//--------
t.on("candidateGenerationState",function(args){
  var color = "yellow";
  switch( args[0] ){
    case 'done': color = 'green'; break;
  }
  $("#user" + args[1] + " .4" ).css("background-color",color);
});
//--------
t.on("iceConnectionState",function(args){
  var color = 'yellow';
  switch( args[0] ){
    case 'new': 
    case 'closed':
    case 'failed':
      color = 'red';
      break;
    case 'checking':
    case 'disconnected':
      color = 'yellow';
      break;
    case 'connected':
    case 'completed':
      color = 'green';
  }
  $("#user" + args[1] + " .5" ).css("background-color",color);
});
 