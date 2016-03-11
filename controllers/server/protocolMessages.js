// Application global constants.
// **********************************************************************

function Protocol_Messages() {};

// Constants for client/server protocol.
Protocol_Messages.C_MESSAGE_GET_INSTRUMENTS_val = 1;
Protocol_Messages.C_MESSAGE_GET_INSTRUMENTS_string = 'C_MESSAGE_GET_INSTRUMENTS';

Protocol_Messages.C_MESSAGE_SELECTED_INSTRUMENT_val = 2;
Protocol_Messages.C_MESSAGE_SELECTED_INSTRUMENT_string = 'C_MESSAGE_SELECTED_INSTRUMENT';

Protocol_Messages.C_MESSAGE_GET_SCORE_val = 3;
Protocol_Messages.C_MESSAGE_GET_SCORE_string = 'C_MESSAGE_GET_SCORE';

Protocol_Messages.C_MESSAGE_UNSELECTED_INSTRUMENT_val = 4;
Protocol_Messages.C_MESSAGE_UNSELECTED_INSTRUMENT_string = 'C_MESSAGE_UNSELECTED_INSTRUMENT';

Protocol_Messages.C_MESSAGE_LOGOUT_val = 5;
Protocol_Messages.C_MESSAGE_LOGOUT_string = 'C_MESSAGE_LOGOUT';

Protocol_Messages.C_MESSAGE_NOTIFY_SELECTION_TO_DIRECTOR_val = 6;
Protocol_Messages.C_MESSAGE_NOTIFY_SELECTION_TO_DIRECTOR_string = 'C_MESSAGE_NOTIFY_SELECTION_TO_DIRECTOR';

Protocol_Messages.C_MESSAGE_PLAY_INSTRUMENTS_val = 7;
Protocol_Messages.C_MESSAGE_PLAY_INSTRUMENTS_string = 'C_MESSAGE_PLAY_INSTRUMENTS';

Protocol_Messages.C_MESSAGE_PAUSE_INSTRUMENTS_val = 8;
Protocol_Messages.C_MESSAGE_PAUSE_INSTRUMENTS_string = 'C_MESSAGE_PAUSE_INSTRUMENTS';

Protocol_Messages.C_MESSAGE_STOP_INSTRUMENTS_val = 9;
Protocol_Messages.C_MESSAGE_STOP_INSTRUMENTS_string = 'C_MESSAGE_STOP_INSTRUMENTS';

Protocol_Messages.C_MESSAGE_VOLUME_ON_val = 10;
Protocol_Messages.C_MESSAGE_VOLUME_ON_string = 'C_MESSAGE_VOLUME_ON';

Protocol_Messages.C_MESSAGE_VOLUME_OFF_val = 11;
Protocol_Messages.C_MESSAGE_VOLUME_OFF_string = 'C_MESSAGE_VOLUME_OFF';

if (typeof module !== 'undefined' && module !== null)
{
	module.exports = Protocol_Messages;
}

