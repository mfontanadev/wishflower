var reqGlobalDefinitions = null;
var reqChLib = null;

if (typeof require != 'undefined')
{
	reqGlobalDefinitions = require(__basePath + "/config/globalDefinitions.js");
    reqChLib = require(__basePath + "/lib/chel-dist/js/chlib.js");
}

Flower.C_SUBTYPE_NOT_SET = 0;
Flower.C_BASS = 1;
Flower.C_BASS_LINE1 = 101;
Flower.C_BASS_LINE2 = 102;
Flower.C_BASSDRUM = 2;
Flower.C_BASSOON = 3;
Flower.C_BASSOON_LINE1 = 301;
Flower.C_BASSOON_LINE2 = 302;
Flower.C_CELLO = 4;
Flower.C_CLARINET = 5;
Flower.C_CLARINET_LINE1 = 501;
Flower.C_CLARINET_LINE2 = 502;
Flower.C_CONTRABASS = 6;
Flower.C_CONTRABASSOON = 7;
Flower.C_CYMBALS = 8;
Flower.C_ENGLISHHORN = 9;
Flower.C_FLUTE = 10;
Flower.C_GUIRO = 11;
Flower.C_HORN = 12;
Flower.C_HORN_LINE1 = 1201;
Flower.C_HORN_LINE2 = 1201;
Flower.C_OBOE = 13;
Flower.C_OBOE_LINE1 = 1301;
Flower.C_OBOE_LINE2 = 1302;
Flower.C_PICCOLO = 14;
Flower.C_SAXOFONE = 15;
Flower.C_TAMBOURINE = 16;
Flower.C_TAMTAM = 17;
Flower.C_TIMPANI = 18;
Flower.C_TRIANGLE = 19;
Flower.C_TROMBONE = 20;
Flower.C_TRUMPET = 21;
Flower.C_TUBA = 22;
Flower.C_VIOLA = 23;
Flower.C_VIOLIN = 24;
Flower.C_VIOLIN_LINE1 = 2401;
Flower.C_VIOLIN_LINE2 = 2402;
Flower.C_XILOFONE = 25;

Flower.C_STATE_NOT_AVAILABLE = 0;
Flower.C_STATE_AVAILABLE = 1;
Flower.C_STATE_SELECTING = 2;
Flower.C_STATE_SELECTED = 3;

Flower.C_FAMILY_NOT_SET = 0;
Flower.C_FAMILY_STRINGS = 1;
Flower.C_FAMILY_WOODS = 2;
Flower.C_FAMILY_WINDS = 3;
Flower.C_FAMILY_PERCUSSION = 4;


function Flower() 
{ 
	this.m_id = -1;
	this.m_name = 'undefined';
	this.m_type = -1;
	this.m_subType = -1;
	this.m_withInterpeter = false;
	this.m_imgId = -1;
	this.m_state = Flower.C_STATE_AVAILABLE;
	this.m_color = "black";
	this.m_family = Flower.C_FAMILY_NOT_SET;
	this.m_connected = false;
	this.m_prefixSoundFileName = "";
	this.m_uniqueSample = false;
	this.m_lastPlayedInstance = null;
}

Flower.prototype.initWithFlower = function (_FlowerObject)
{
	this.initWithFull
	(
		_FlowerObject.m_id,
		_FlowerObject.m_name,
		_FlowerObject.m_type,
		_FlowerObject.m_subType
	);
};

Flower.prototype.initWithFull = function (_id, _playerName, _type, _subType)
{
	this.initWithFullParams(_id, _playerName, _type, _subType, Flower.C_STATE_AVAILABLE);
};

Flower.prototype.initWithFullParams = function (_id, _playerName, _type, _subType, _state)
{
	this.m_id = _id;
	this.m_playerName = _playerName;
	this.m_type = _type;
	this.m_subType = _subType;
	this.m_withInterpeter = false;
	this.m_imgId = -1;
	this.m_state = _state;
	this.m_connected = false;
	
	switch(this.m_type)
	{
	//B4CBED celeste - percusion
		case Flower.C_BASS: if (reqGlobalDefinitions != null) 				this.m_imgId = reqGlobalDefinitions.C_BASS;			this.m_family = Flower.C_FAMILY_STRINGS; this.m_color = "#CBFFCE"; this.m_name = "Bass";this.m_name = "Bass"; break;
		case Flower.C_BASSDRUM: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_BASSDRUM;		this.m_family = Flower.C_FAMILY_PERCUSSION; this.m_color = "#B4CBED";this.m_name = "Bassdrum"; break;
		case Flower.C_BASSOON: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_BASSOON;		this.m_family = Flower.C_FAMILY_WOODS; this.m_color = "#F5EFCD";this.m_name = "Basson"; break;
		case Flower.C_CELLO: if (reqGlobalDefinitions != null)  			this.m_imgId = reqGlobalDefinitions.C_CELLO; 		this.m_family = Flower.C_FAMILY_STRINGS; this.m_color = "#CBFFCE";this.m_name = "Cello";break;
		case Flower.C_CLARINET: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_CLARINET;		this.m_family = Flower.C_FAMILY_WOODS;this.m_color = "#F5EFCD";this.m_name = "Clarinet"; break;
		case Flower.C_CONTRABASS: if (reqGlobalDefinitions != null) 		this.m_imgId = reqGlobalDefinitions.C_CONTRABASS;	this.m_family = Flower.C_FAMILY_STRINGS; this.m_color = "#CBFFCE";this.m_name = "Contrabass"; break;
		case Flower.C_CONTRABASSOON: if (reqGlobalDefinitions != null) 		this.m_imgId = reqGlobalDefinitions.C_CONTRABASSOON;this.m_family = Flower.C_FAMILY_WOODS;this.m_color = "#F5EFCD";this.m_name = "Contrabasson"; break;
		case Flower.C_CYMBALS: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_CYMBALS;		this.m_family = Flower.C_FAMILY_PERCUSSION;this.m_color = "#B4CBED";this.m_name = "Cymbals"; break;
		case Flower.C_ENGLISHHORN: if (reqGlobalDefinitions != null) 		this.m_imgId = reqGlobalDefinitions.C_ENGLISHHORN;	this.m_family = Flower.C_FAMILY_WOODS;this.m_color = "#F5EFCD";this.m_name = "English horn"; break;
		case Flower.C_FLUTE: if (reqGlobalDefinitions != null) 				this.m_imgId = reqGlobalDefinitions.C_FLUTE;		this.m_family = Flower.C_FAMILY_WOODS;this.m_color = "#F5EFCD";this.m_name = "Flute"; break;
		case Flower.C_GUIRO: if (reqGlobalDefinitions != null) 				this.m_imgId = reqGlobalDefinitions.C_GUIRO;		this.m_family = Flower.C_FAMILY_PERCUSSION;this.m_color = "#B4CBED";this.m_name = "Guiro"; break;
		case Flower.C_HORN: if (reqGlobalDefinitions != null) 				this.m_imgId = reqGlobalDefinitions.C_HORN;			this.m_family = Flower.C_FAMILY_WINDS; this.m_color = "#F1B3B6";this.m_name = "French horn"; break;
		case Flower.C_OBOE: if (reqGlobalDefinitions != null) 				this.m_imgId = reqGlobalDefinitions.C_OBOE;			this.m_family = Flower.C_FAMILY_WOODS;this.m_color = "#F5EFCD";this.m_name = "Oboe"; break;
		case Flower.C_PICCOLO: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_PICCOLO;		this.m_family = Flower.C_FAMILY_WOODS;this.m_color = "#F5EFCD";this.m_name = "Piccolo"; break;
		case Flower.C_SAXOFONE: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_SAXOFONE;		this.m_family = Flower.C_FAMILY_WOODS;this.m_color = "#F5EFCD";this.m_name = "Saxofone"; break;
		case Flower.C_TAMBOURINE: if (reqGlobalDefinitions != null) 		this.m_imgId = reqGlobalDefinitions.C_TAMBOURINE;	this.m_family = Flower.C_FAMILY_PERCUSSION;this.m_color = "#B4CBED";this.m_name = "Tambuorine"; break;
		case Flower.C_TAMTAM: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_TAMTAM;		this.m_family = Flower.C_FAMILY_PERCUSSION;this.m_color = "#B4CBED";this.m_name = "Tamtam"; break;
		case Flower.C_TIMPANI: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_TIMPANI;		this.m_family = Flower.C_FAMILY_PERCUSSION;this.m_color = "#B4CBED";this.m_name = "Timpani"; break;
		case Flower.C_TRIANGLE: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_TRIANGLE;		this.m_family = Flower.C_FAMILY_PERCUSSION;this.m_color = "#B4CBED";this.m_name = "Triangle"; break;
		case Flower.C_TROMBONE: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_TROMBONE;		this.m_family = Flower.C_FAMILY_WINDS;this.m_color = "#F1B3B6";this.m_name = "Trombone"; break;
		case Flower.C_TRUMPET: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_TRUMPET;		this.m_family = Flower.C_FAMILY_WINDS;this.m_color = "#F1B3B6";this.m_name = "Trumpet"; break;
		case Flower.C_TUBA: if (reqGlobalDefinitions != null) 				this.m_imgId = reqGlobalDefinitions.C_TUBA;			this.m_family = Flower.C_FAMILY_WINDS;this.m_color = "#F1B3B6";this.m_name = "Tuba"; break;
		case Flower.C_VIOLA: if (reqGlobalDefinitions != null) 				this.m_imgId = reqGlobalDefinitions.C_VIOLA; 		this.m_family = Flower.C_FAMILY_STRINGS; this.m_color = "#CBFFCE";this.m_name = "Viola"; break;
		case Flower.C_VIOLIN: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_VIOLIN; 		this.m_family = Flower.C_FAMILY_STRINGS; this.m_color = "#CBFFCE";this.m_name = "Violin"; break;
		case Flower.C_XILOFONE: if (reqGlobalDefinitions != null) 			this.m_imgId = reqGlobalDefinitions.C_XILOFONE;		this.m_family = Flower.C_FAMILY_PERCUSSION;this.m_color = "#B4CBED";this.m_name = "Xilofone"; break;
	}

	this.m_prefixSoundFileName = this.getPefixSoundFileName();
};

Flower.prototype.getPefixSoundFileName = function ()
{
	var result;
	
	var instName = this.m_name;
	var instSubtype = "stn";
	
	if (this.m_type == Flower.C_BASSDRUM)
	{
		this.m_uniqueSample = true;
	}	
	else if (this.m_type == Flower.C_CYMBALS)
	{
		this.m_uniqueSample = true;
	}	
	else if (this.m_type == Flower.C_TRIANGLE)
	{
		this.m_uniqueSample = true;
	}	
	else if (this.m_type == Flower.C_VIOLIN)
	{
		if (this.m_subType == Flower.C_VIOLIN_LINE1)
			instSubtype = "stn";
		else if (this.m_subType == Flower.C_VIOLIN_LINE2)
			instSubtype = "stn";
	}	

	result = instName + "_" + instSubtype;
	return result;
};

// nt = note type.
// np = note pich.
Flower.prototype.playNote = function (ntone, noctv, nalt)
{
	this.stopPreviousSound();
	if ("S" !== ntone)
	{
		var soundFileName = this.getFlowerFileName(ntone, noctv, nalt);

		// Search Flower index in the Flower bank of SoundManager.
		var FlowerIndex = m_soundManager.getSoundIdBySoundName(soundFileName, false);
		if (FlowerIndex != -1)
			this.m_lastPlayedInstance = m_soundManager.play(FlowerIndex);
	}
};

Flower.prototype.stopPreviousSound = function ()
{
	if (this.m_lastPlayedInstance != null)
		this.m_lastPlayedInstance.stop();
};

Flower.prototype.getFlowerFileName = function (ntone, noctv, nalt)
{
	// Modify note because Fb sounds the same way to E (take in count another similarities)
	// This way we recycle sound files. 

	if (nalt === "#")
	{
		if (ntone === "E") 
		{
			ntone = "F";
			nalt = "_";
		}
		else if (ntone === "B")
		{
			ntone = "C";
			noctv = (parseInt(noctv) + 1).toString(); 
			nalt = "_";
		}
	}
	else if (nalt === "b")
	{
		if (ntone === "A") 
		{
			ntone = "G";
			nalt = "#"
		}
		else if (ntone === "B") 
		{
			ntone = "A";
			nalt = "#"
		}
		else if (ntone === "C")
		{
			ntone = "B"; 
			noctv = (parseInt(noctv) - 1).toString(); 
			nalt = "_";
		}
		else if (ntone === "D") 
		{
			ntone = "C";
			nalt = "#"
		}
		else if (ntone === "E") 
		{
			ntone = "D";
			nalt = "#"
		}		
		else if (ntone === "F") 
		{
			ntone = "E";
			nalt = "_";
		}
		else if (ntone === "G") 
		{
			ntone = "F";
			nalt = "#";
		}
	} 

	if (nalt === "#")
		nalt = "s";
	if (nalt === "_")
		nalt = "n";

	// Make sound filename, if the Flower has one only sample then not add tune sufix.
	var soundFileName = this.m_prefixSoundFileName;
	if (this.m_uniqueSample == false)
		soundFileName = soundFileName + "_" + ntone + noctv + nalt;

    msglog(soundFileName);
	return soundFileName;
};

Flower.prototype.log = function (_msg)
{
	var tmp = '';
	
	tmp+='this.m_id:' + this.m_id + ',';
	tmp+='this.m_name:' + this.m_name + ',';
	tmp+='this.m_type:' + this.m_type + ',';
	tmp+='this.m_subType:' + this.m_subType + ',';
	tmp+='this.m_withInterpeter:' + this.m_withInterpeter + ',';
	tmp+='this.m_imgId:' + this.m_imgId;
	tmp+='this.m_state:' + this.m_state;

    //reqChLib.msglog(_msg + tmp);
};
	
if (typeof module !== 'undefined' && module !== null)
{
	module.exports = Flower;
}


