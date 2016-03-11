var currentUserName = "";

var messages = [];
var socket = null;
var sendButton  = null;
var name  = null;
var startButton  = null;
var owner = null;

function initChat() 
{
	owner = this; 
	
	var myHost = window.location.hostname;
	
	if (myHost == "localhost")
		myHost = myHost + ":5000";
	else if (myHost.substring(0,7) == "192.168")
		myHost = myHost + ":5000";

	console.log("HOST HOST HOST:" +myHost);

	socket = io.connect(myHost);

	//***remover
	sendButton = document.getElementById("send");
	startButton = document.getElementById("idStartButton");

	socket.on
	(
		'message', 
		function (data) 
		{
			if(data.message) 
			{
				console.log("");
				console.log("CLIENT:")
				console.log("data");
				console.log("");
				console.log("<--- Incomming CLIENT data: " + JSON.stringify(data));

				if (data.message == "WELCOME")
				{
					socket.emit('send', { message: Protocol_Messages.C_MESSAGE_GET_INSTRUMENTS_string, sender: "CLIENT", receptor:'server', params: '', data:'' });
				}
				
				if (data.message == Protocol_Messages.C_MESSAGE_GET_INSTRUMENTS_string)
				{
					console.log(Protocol_Messages.C_MESSAGE_GET_INSTRUMENTS_string);
					//console.log('data=' + data);
					//console.log('data JSON=' + JSON.stringify(data));
					owner.onFillInstruments(data.data);
				}
				
				if (data.message == Protocol_Messages.C_MESSAGE_SELECTED_INSTRUMENT_string)
				{
					// Get score
					socket.emit
					('send', 
						{ 
							message: Protocol_Messages.C_MESSAGE_GET_SCORE_string, 
							sender: currentUserName, 
							receptor: 'server', 
							params: data.params, 
							data:'' 
						}
					);
				}
				
				if (data.message == Protocol_Messages.C_MESSAGE_GET_SCORE_string)
				{
					owner.onGetScore(data);
				}

				if (data.message == Protocol_Messages.C_MESSAGE_PLAY_INSTRUMENTS_string)
				{
					owner.onScoreStart();
				}
				
				if (data.message == Protocol_Messages.C_MESSAGE_PAUSE_INSTRUMENTS_string)
				{
					owner.onScorePause();
				}

				if (data.message == Protocol_Messages.C_MESSAGE_STOP_INSTRUMENTS_string)
				{
					owner.onScoreReset();
				}

				if (data.message == Protocol_Messages.C_MESSAGE_VOLUME_ON_string)
				{
					owner.btnSoundOn_controller();
				}

				if (data.message == Protocol_Messages.C_MESSAGE_VOLUME_OFF_string)
				{
					owner.btnSoundOff_controller();
				}
			} 
			else 
			{
				console.log("There is a problem:", data);
			}
		}
	);
}

function send_button_message(_senderName, _text) 
{
	socket.emit('send', { message: _text, username: _senderName });
}

function send_selected_instrument_base(_idInstrument, _multiEditorIndex, _scoreId) 
{
	socket.emit
	(
		'send', 
		{ 	message: Protocol_Messages.C_MESSAGE_SELECTED_INSTRUMENT_string, 
			sender: currentUserName, 
			receptor:'server', 
			params: {scoreId: _scoreId, instrumentId: _idInstrument, multiEditorIndex: _multiEditorIndex}, 
			data:'' 
		}
	);
}

function send_selected_instrument(_idInstrument) 
{
	send_selected_instrument_base(_idInstrument, 0, 1);
}

function send_selected_instrument_multieditorIndex(_idInstrument, _multiEditorIndex) 
{
	send_selected_instrument_base(_idInstrument, _multiEditorIndex, 1);
}

