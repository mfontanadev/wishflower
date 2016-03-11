function SoundManager()
{
	var ownerSoundManager = null;
	var m_idProgressBar = "";	

	SoundManager.prototype.initWith = function(_soundList, _soundPath, _callback_allLoadedAudio, _soundDisabled, _progressBar) 
	{
		msglog('INIT SOUND:initWith');
		ownerSoundManager = this;

		this.m_idProgressBar = _progressBar;

		this.m_firstInit = false;
		this.m_timeoutRunning = false;
		this.m_soundDisabled = _soundDisabled;
		this.m_soundCount = -1;
		this.m_totalSounds = 0;
		this.m_callback_allLoadedAudio = _callback_allLoadedAudio;
		
		if (_soundDisabled === false)
		{
			this.progressBarVisibility(true);

			if (!createjs.Sound.initializeDefaultPlugins())
			{
				msglog('INIT SOUND: new createjs.Sound.initializeDefaultPlugins() not created.');
            }
			else
			{
				try
				{

					this.m_soundList = _soundList;
					this.m_soundList.push({src:"/lib/nosound.wav", id:-1});
					this.m_soundList.push({src:"/lib/soundtest.mp3", id:-2});
					this.m_totalSounds = _soundList.length;
					this.m_soundCount = this.m_totalSounds;

					createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
					createjs.Sound.addEventListener("fileload", this.soundLoaded);
	    			createjs.Sound.registerSounds(this.m_soundList);
					msglog('INIT SOUND: ok');

					this.m_timeoutRunning = true;
					window.setTimeout(this.soundLoadTimeOut, 1000 * 10);
				}
				catch (e)
				{
					msglog('INIT SOUND ERROR:' + e);
                    this.m_timeoutRunning = true;
                    window.setTimeout(this.soundLoadTimeOut, 1000 * 10);
				}
			}
		}
		else
		{
			msglog('INIT SOUND: DISABLED BY USER');
		}
	};
	
	SoundManager.prototype.setProgressBar = function (_idProgressBar)
	{
		m_idProgressBar = _idProgressBar;
	};

	SoundManager.prototype.soundLoadTimeOut = function(event)
	{
		if (ownerSoundManager.m_timeoutRunning === true)
		{
			msglog('INIT SOUND: timeout, continue.');
			ownerSoundManager.m_soundDisabled = true;
			ownerSoundManager.m_callback_allLoadedAudio();
		}
	};

	SoundManager.prototype.soundLoaded = function(event)
	{
		ownerSoundManager.m_timeoutRunning = false;
		ownerSoundManager.m_soundCount--;
		msglog("Sound loaded id=" + event.id+ ", count=" + ownerSoundManager.m_soundCount);

        if ( (typeof ownerSoundManager.m_idProgressBar !== 'undefined') && (ownerSoundManager.m_idProgressBar !== null) )
		{
			var percent = (Math.floor(((ownerSoundManager.m_totalSounds - ownerSoundManager.m_soundCount) / ownerSoundManager.m_totalSounds) * 100));

			if ( (typeof ownerSoundManager.m_idProgressBar !== 'undefined') && (ownerSoundManager.m_idProgressBar !== null) )
            {
                chUpadeInfoControlTextCanvas(ownerSoundManager.m_idProgressBar, "Loading sounds: " + percent + "%");
            }
		}

		if (ownerSoundManager.m_soundCount === 0)
		{
			ownerSoundManager.progressBarVisibility(false);
			ownerSoundManager.m_callback_allLoadedAudio();
		}
	};

	SoundManager.prototype.initFirstSound = function(_id) 
	{
		if (this.m_soundDisabled === false && this.m_firstInit === false)
		{
			this.m_firstInit = true;
			this.play(-1);
		}
	};

	SoundManager.prototype.playSoundTest = function(_id) 
	{
		if (this.m_soundDisabled === false)
		{
			this.play(-2);
		}
	};

	SoundManager.prototype.play = function(_id) 
	{
		if (this.m_soundDisabled === false)
		{
			//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
            var instance = createjs.Sound.play(_id, createjs.Sound.INTERRUPT_ANY, 0, 0, false, 1);

            if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) 
			{
				msglog("play sound fail id=" + _id);
				return; 
			}

			instance.addEventListener ("complete", function(instance) 
			{
				//msglog("audio complete");
			});

			return instance;
		}
	};
	
	SoundManager.prototype.stop = function(_id) 
	{
		if (this.m_soundDisabled === false)
		{
			createjs.Sound.stop(_id);
		}
	};

	SoundManager.prototype.isPlaying = function(_id) 
	{
        //TODO: implement soundjs implementation.
		return false;
	};
	
	SoundManager.prototype.setLoop = function(_id, _infiniteLoop) 
	{
        //TODO: implement soundjs implementation.
	};
	
	SoundManager.prototype.setVolume = function(_id, _volumePercent) 
	{
        //TODO: implement soundjs implementation.
	};
	
	SoundManager.prototype.progressBarVisibility = function(_visible)
	{ 
		if ((typeof m_idProgressBar !== 'undefined') && m_idProgressBar !== null && m_idProgressBar != "")
			m_idProgressBar._visible = _visible;
	};

	SoundManager.prototype.getSoundIdBySoundName = function(_soundName, _wholeWord)
	{ 
		var result = -1;

		if (this.m_soundDisabled === false)
		{
			if (_wholeWord === true)
			{
				for (var i = 0; i < this.m_soundList.length; i++) 
				{
					if ( this.m_soundList[i].src === _soundName)
						result = this.m_soundList[i].id;
				}
			}
			else
			{
				for (var i = 0; i < this.m_soundList.length; i++) 
				{
					if ( this.m_soundList[i].src.indexOf(_soundName) != -1)
						result = this.m_soundList[i].id;
				}
			}
		}
		
		return result;
	}

}