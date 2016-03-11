var reqKeyPair = null;
var reqFlower = null;
var protocolMessages = null;
var reqChLib = null;

if (typeof require != 'undefined')
{
	reqProtocolMessages = require(__basePath + "/controllers/server/protocolMessages.js");

	reqKeyPair = require(__basePath + "/controllers/entities/keypair.js");
	reqFlower = require(__basePath + "/controllers/entities/flower.js");
    reqChLib = require(__basePath + "/lib/chel-1.0.1-dist/js/chlib.js");
}

function ServerOrchesta() 
{ 
	this.m_app = null;
	this.m_port = 0;
	this.m_io = null;

	this.m_registeredSockets = Array();
	this.m_instruments = Array();
}

ServerOrchesta.prototype.initWithAppPortIO = function (_app, _port, _io)
{
	this.m_app = _app;
	this.m_port = _port;
	this.m_io = _io;
}

ServerOrchesta.prototype.start = function (_io)
{
	var owner = this;
	
	_io.sockets.on
	(
		'connection', 

		// Welcome message when someone connect to server.
		function (socket) 
		{
			socket.emit('message', { message: 'WELCOME' });

			socket.on
			(
				'disconnect', 
				function (data) 
				{
					console.log("Disconnect message. Socket.id=" + socket.id + " Data:" + data);
					owner.processIncommingMessage_C_MESSAGE_LOGOUT(owner, _io, socket, data, true);
				}
			);

			socket.on
			(
				'send', 
				function (data) 
				{
					console.log("");
					console.log("---> Incomming SERVER data: " + JSON.stringify(data));
					socket.emit('message', { message: 'startting' });
										
					if (data.message == reqProtocolMessages.C_MESSAGE_GET_INSTRUMENTS_string)
						owner.processIncommingMessage_C_MESSAGE_GET_INSTRUMENTS(owner, _io, socket, data);
						
					else if (data.message == reqProtocolMessages.C_MESSAGE_SELECTED_INSTRUMENT_string)
						owner.processIncommingMessage_C_MESSAGE_SELECTED_INSTRUMENT(owner, _io, socket, data);
						
					else if (data.message == reqProtocolMessages.C_MESSAGE_GET_SCORE_string)
						owner.processIncommingMessage_C_MESSAGE_GET_SCORE(owner, _io, socket, data);

					else if (data.message == reqProtocolMessages.C_MESSAGE_PLAY_INSTRUMENTS_string)
						owner.processIncommingMessage_C_MESSAGE_PLAY_INSTRUMENTS(owner, _io, socket, data);

					else if (data.message == reqProtocolMessages.C_MESSAGE_PAUSE_INSTRUMENTS_string)
						owner.processIncommingMessage_C_MESSAGE_PAUSE_INSTRUMENTS(owner, _io, socket, data);

					else if (data.message == reqProtocolMessages.C_MESSAGE_STOP_INSTRUMENTS_string)
						owner.processIncommingMessage_C_MESSAGE_STOP_INSTRUMENTS(owner, _io, socket, data);

					else if (data.message == reqProtocolMessages.C_MESSAGE_VOLUME_ON_string)
						owner.processIncommingMessage_C_MESSAGE_VOLUME_ON(owner, _io, socket, data);

					else if (data.message == reqProtocolMessages.C_MESSAGE_VOLUME_OFF_string)
						owner.processIncommingMessage_C_MESSAGE_VOLUME_OFF(owner, _io, socket, data);

					else
					{
						_io.sockets.emit('message', data);
					}
				}
			);
		}
	);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_GET_INSTRUMENTS = function (_owner, _io, _socket, _data)
{
	_socket.emit
	(
		'message', 
		{ 
			message: reqProtocolMessages.C_MESSAGE_GET_INSTRUMENTS_string, 
			sender: 'serverOrchesta', 
			receptor: 'usuario=' + _socket.id ,
			params: '',
			data: _owner.getInstruments()
		}
	);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_SELECTED_INSTRUMENT = function (_owner, _io, _socket, _data)
{
	/*
	console.log('');
	console.log('---->processIncommingMessage_C_MESSAGE_SELECTED_INSTRUMENT');
	console.log('_owner:' + _owner);
	console.log('_io:' + _io);
	console.log('_socket:' + _socket);
	console.log('_data:' + _data);
	*/
	//_socket.emit
	_socket.emit
	(
		'message', 
		{ 
			message: reqProtocolMessages.C_MESSAGE_SELECTED_INSTRUMENT_string, 
			sender: 'serverOrchesta', 
			receptor: _socket.id ,
			params: _data.params,
			data: ''
		}
	);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_GET_SCORE = function (_owner, _io, _socket, _data)
{
	console.log("   ");
	console.log("   ");
	console.log("   ");

	var tmpInstrument = _owner.findInstrumentById(_data.params.instrumentId);
	var scoreDef = null;

	if (_data.params.scoreId == 1 && tmpInstrument != null) 
	{
		console.log("GET SCORE INSTRUMENT:" + tmpInstrument.m_type);
	}

	//Add instrument to hash, only if instrument come from not editor controller.
	if (_data.params.multiEditorIndex === 0)
	{
		// Remove previous registration if there were any and send message.
		_owner.processIncommingMessage_C_MESSAGE_LOGOUT(_owner, _io, _socket, _data, false);

		// Register the current instrument.
		_owner.registerIncommingInstrument(_socket, _data.params.instrumentId)
		
		// Notify instrument selection.
		_owner.send_C_MESSAGE_NOTIFY_SELECTION_TO_DIRECTOR(_owner, _io, _socket, _data.params.instrumentId);
	}

	_socket.emit
	(
		'message', 
		{ 
			message: reqProtocolMessages.C_MESSAGE_GET_SCORE_string, 
			sender: 'serverOrchesta', 
			receptor: _socket.id ,
			params: _data.params,
			data: JSON.stringify(scoreDef)
		}
	);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_LOGOUT = function (_owner, _io, _socket, _data, _removeSocket)
{
	var tmpInstrumentId = this.unRegisterInstrumentBySocketId(_socket.id);

	if (tmpInstrumentId != -1)
	{
		if (_removeSocket == true)
		{
			console.log("removiendo socket:" + _socket.id)

			this.removeRegInstrumentBySocketID(_socket.id);
			this.listRegisteredInstruments();
		}

		// Send messages to other connected clients.
		_io.sockets.emit
		(
			'message', 
			{ 
				message: reqProtocolMessages.C_MESSAGE_UNSELECTED_INSTRUMENT_string, 
				sender: 'serverOrchesta', 
				receptor: _socket.id ,
				params: '',
				data: {instrumentId: tmpInstrumentId} 
			}
		);	
	}
}

ServerOrchesta.prototype.send_C_MESSAGE_NOTIFY_SELECTION_TO_DIRECTOR = function (_owner, _io, _socket, _instrumentId)
{
	// Send messages to other connected clients.
	_io.sockets.emit
	(
		'message', 
		{ 
			message: reqProtocolMessages.C_MESSAGE_NOTIFY_SELECTION_TO_DIRECTOR_string, 
			sender: 'serverOrchesta', 
			receptor: _socket.id ,
			params: '',
			data: {instrumentId: _instrumentId} 
		}
	);	
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_PLAY_INSTRUMENTS = function (_owner, _io, _socket, _data)
{
	_owner.sendMessageToSelectedInstruments(_owner, _io, _socket, _data, reqProtocolMessages.C_MESSAGE_PLAY_INSTRUMENTS_string);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_PAUSE_INSTRUMENTS = function (_owner, _io, _socket, _data)
{
	_owner.sendMessageToSelectedInstruments(_owner, _io, _socket, _data, reqProtocolMessages.C_MESSAGE_PAUSE_INSTRUMENTS_string);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_STOP_INSTRUMENTS = function (_owner, _io, _socket, _data)
{
	_owner.sendMessageToSelectedInstruments(_owner, _io, _socket, _data, reqProtocolMessages.C_MESSAGE_STOP_INSTRUMENTS_string);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_VOLUME_ON = function (_owner, _io, _socket, _data)
{
	_owner.sendMessageToSelectedInstruments(_owner, _io, _socket, _data, reqProtocolMessages.C_MESSAGE_VOLUME_ON_string);
}

ServerOrchesta.prototype.processIncommingMessage_C_MESSAGE_VOLUME_OFF = function (_owner, _io, _socket, _data)
{
	_owner.sendMessageToSelectedInstruments(_owner, _io, _socket, _data, reqProtocolMessages.C_MESSAGE_VOLUME_OFF_string);
}

ServerOrchesta.prototype.sendMessageToSelectedInstruments = function (_owner, _io, _socket, _data, _message)
{
	var selectedInstruments = _data.params.instruments;
	var tmpSockets = null;
	tmpSockets = _owner.getRegisteredSocketsByInstrumentIDs(selectedInstruments);

	if (tmpSockets != null)
	{
		for(var i = 0; i < tmpSockets.length; i++) 
		{
			if (typeof tmpSockets != 'undefined')
			{
				console.log("sockettosend:" + tmpSockets[i].id);

				// Send messages to other connected clients.
				tmpSockets[i].emit
				(
					'message', 
					{ 
						message: _message, 
						sender: 'serverOrchesta', 
						receptor: tmpSockets[i].id ,
						params: '',
						data: '' 
					}
				);
			}
		}
	}
}

/// HELPERS
ServerOrchesta.prototype.addInstrument = function (_id, _name, _type, _subType)
{
	tmpInstruItem = new reqFlower();
	tmpInstruItem.initWithFull(_id, _name, _type, _subType);
	this.m_instruments.push(tmpInstruItem);
	tmpInstruItem.log('Addin instrument:');
}

ServerOrchesta.prototype.addInstrumentState = function (_id, _name, _type, _subType, _state)
{
	tmpInstruItem = new reqFlower();
	tmpInstruItem.initWithFullParams(_id, _name, _type, _subType, _state);
	this.m_instruments.push(tmpInstruItem);
	tmpInstruItem.log('Addin instrument:');
}

ServerOrchesta.prototype.getInstruments = function ()
{
	return this.m_instruments;
}

ServerOrchesta.prototype.findInstrumentById = function (_instrumentId)
{
	var result = null;
	
	for(var i = 0; i < this.m_instruments.length; i++) 
	{
		if (_instrumentId == this.m_instruments[i].m_id)
			result = this.m_instruments[i];
	}
	
	return result;
}

ServerOrchesta.prototype.listRegisteredInstruments = function ()
{
	var result = null;

	console.log("");
	console.log("******************************");
	console.log("LIST OF REGISTERED INSTRUMENTS");
	
	for(var i = 0; i < this.m_registeredSockets.length; i++) 
	{
		console.log("   m_registeredSockets[" + i + "]: " + this.m_registeredSockets[i].toString());
	}
	console.log("******************************");
	console.log("");

	return result;
}

ServerOrchesta.prototype.registerIncommingInstrument = function (_socket, _instrumentId)
{
	var regInstrument = null;
	regInstrument = this.findRegInstrumentBySocketId(_socket.id);

	if (regInstrument == null)
	{
		regInstrument = new reqKeyPair();
		regInstrument.initWith("",0);
		this.m_registeredSockets.push(regInstrument);
	}

	regInstrument.setKey(_socket);
	regInstrument.setValue(_instrumentId);

	// Update instrument status
	var inst = this.findInstrumentById(_instrumentId);
	if (inst != null)
		inst.m_connected = true;

	this.listRegisteredInstruments();
}

ServerOrchesta.prototype.unRegisterInstrumentBySocketId = function (_socketId)
{
	var result = -1;
	var regInstrument = this.findRegInstrumentBySocketId(_socketId);

	if (regInstrument != null)
	{
		// Update instrument status
		var inst = this.findInstrumentById(regInstrument.getValue());
		if (inst != null)
		{
			inst.m_connected = false;
			result = regInstrument.getValue();
		}
	}

	return result;
}

ServerOrchesta.prototype.findRegInstrumentBySocketId = function (_socketId)
{
	var result = null;

	for(var i = 0; i < this.m_registeredSockets.length; i++) 
	{
		if (_socketId == this.m_registeredSockets[i].getKey().id)
		{
			result = this.m_registeredSockets[i];
			break;
		}
	}

	return result;
}

ServerOrchesta.prototype.findRegInstrumentByInstrumentId = function (_instrumentId)
{
	var result = null;

	for(var i = 0; i < this.m_registeredSockets.length; i++) 
	{
		if (_instrumentId == this.m_registeredSockets[i].getValue())
		{
			result = this.m_registeredSockets[i];
			break;
		}
	}

	return result;
}

ServerOrchesta.prototype.removeRegInstrumentBySocketID = function (_socketId)
{
	for(var i = 0; i < this.m_registeredSockets.length; i++) 
	{
		if (_socketId == this.m_registeredSockets[i].getKey().id)
		{
			this.m_registeredSockets.splice(i,1);
			break;
		}
	}
}


ServerOrchesta.prototype.getRegisteredSocketsByInstrumentIDs = function (_arrayInstrumetIds)
{
	var result = Array();
	var tmpInstrument = null;
	var tmpSocket = null;

	for(var i = 0; i < _arrayInstrumetIds.length; i++) 
	{	
		tmpInstrument =  this.findRegInstrumentByInstrumentId(_arrayInstrumetIds[i])
		if (tmpInstrument != null)
		{
			tmpSocket = tmpInstrument.getKey();
			result.push(tmpSocket);
		}
	}

	return result;
}

module.exports = ServerOrchesta;

