(function() {
	
	// ----- Options -----
	var transitionTime = '.3s';
	var controllerSize = 80;
	var trackSize = 68;
	var trackWidth = 2;
	var ballSize = 12;
	var storageKey = 'tvc-volume';
	// -------------------
	
	var soundButton = document.querySelector('.sound-button');
	if(!soundButton) return;
	
	var volume = localStorage.getItem(storageKey);
	if(volume === null) volume = 1;
	volume = Math.min(Math.max(+volume, 0), 1);
	
	var trackPos = (controllerSize - trackSize) / 2;
	
	soundButton.style.position = 'relative';
	soundButton.style.marginRight = '15px';
	soundButton.style.marginTop = '0';
	soundButton.style.transition = 'margin-right '+transitionTime;
	var wrapper = document.createElement('div');
	wrapper.style.position = 'absolute';
	wrapper.style.top = '0';
	wrapper.style.bottom = '5px';
	wrapper.style.left = '100%';
	wrapper.style.width = controllerSize + 'px';
	wrapper.style.overflow = 'hidden';
	wrapper.style.visibility = 'hidden';
	wrapper.style.transition = 'visibility '+transitionTime;
	var bar = document.createElement('div');
	bar.style.position = 'absolute';
	bar.style.width = '100%';
	bar.style.height = '100%';
	// bar.style.backgroundColor = 'rgba(0,0,0,.6)';
	bar.style.backgroundImage = 'linear-gradient(white, white)';
	bar.style.backgroundRepeat = 'no-repeat';
	bar.style.backgroundSize = trackSize + 'px ' + trackWidth + 'px';
	bar.style.backgroundPosition = 'center';
	bar.style.borderRadius = '5px 5px 0 0';
	bar.style.transform = 'translateX(-100%)';
	bar.style.transition = 'transform '+transitionTime;
	var ball = document.createElement('div');
	ball.style.position = 'absolute';
	ball.style.width = ballSize+'px';
	ball.style.height = ballSize+'px';
	ball.style.borderRadius = '50%';
	ball.style.background = 'white';
	ball.style.left = trackPos + 'px';
	ball.style.top = '50%';
	var hbs = ballSize / 2;
	ball.style.margin = '-'+hbs+'px 0 0 -'+hbs+'px';
	
	// Move it to the left
	var leftSide = document.querySelector('.player-controls-bottom-left');
	if(leftSide) leftSide.appendChild(soundButton);
	
	var nativeSlider = document.querySelector('.volume-control-container');
	if(nativeSlider) nativeSlider.style.display = 'none';
	
	var timeDisplayStyle = document.createElement('style');
	timeDisplayStyle.type = 'text/css';
	timeDisplayStyle.appendChild(document.createTextNode('.time-display { margin-right: 15px; }'));
	document.head.appendChild(timeDisplayStyle);
	
	var video = null;
	function waitForVideo() {
		video = document.querySelector('video');
		if(!video) requestAnimationFrame(waitForVideo);
		else videoReady();
	}
	updateVolume(volume);
	waitForVideo();
	
	function videoReady() {
		setVolume(volume);
		video.addEventListener('volumechange', function() {
			updateVolume(video.volume, video.muted);
		});
	}
	
	function setVolume(vol) {
		volume = vol;
		if(video) {
			// video.muted = false;
			video.volume = vol;
		}
	}
	function updateVolume(vol, muted) {
		// var pos = muted ? 0 : vol * trackSize;
		var pos = vol * trackSize;
		ball.style.transform = 'translateX('+pos+'px)';
		localStorage.setItem(storageKey, vol);
	}
	
	var hovered = false;
	var mouseDown = false, preventClick = false;
	var barScreenPos = null;
	function showBar() {
		if(!wrapper || !bar) return;
		soundButton.style.marginRight = (15 + controllerSize) + 'px';
		wrapper.style.visibility = 'visible';
		bar.style.transform = 'translateX(0)';
	}
	function hideBar() {
		if(!wrapper || !bar) return;
		soundButton.style.marginRight = '15px';
		wrapper.style.visibility = 'hidden';
		bar.style.transform = 'translateX(-100%)';
	}
	soundButton.addEventListener('mouseenter', function() {
		hovered = true;
		showBar();
	});
	soundButton.addEventListener('mouseleave', function mouseLeave() {
		hovered = false;
		if(!mouseDown) hideBar();
	});
	function checkMouse(e) {
		if(!barScreenPos) return;
		var posIn = e.clientX - barScreenPos.left - trackPos;
		var result = Math.min(Math.max(posIn / trackSize, 0), 1);
		setVolume(result);
	}
	bar.addEventListener('mousedown', function(e) {
		e.stopPropagation();
		barScreenPos = wrapper.getBoundingClientRect();
		mouseDown = true;
		preventClick = true;
		checkMouse(e);
	}, true);
	document.addEventListener('mousemove', function(e) {
		if(!mouseDown) return;
		checkMouse(e);
	});
	document.addEventListener('mouseup', function(e) {
		if(mouseDown) {
			e.stopPropagation();
			e.preventDefault();
		} else {
			preventClick = false;
		}
		mouseDown = false;
		if(!hovered) hideBar();
	}, true);
	bar.addEventListener('click', function(e) {
		if(preventClick)
			e.stopPropagation();
		preventClick = false;
	}, true);
	
	bar.appendChild(ball);
	wrapper.appendChild(bar);
	soundButton.appendChild(wrapper);
})();
