(function() {
	
	// ----- Options -----
	var transitionTime = '.3s';
	var controllerHeight = 80;
	var trackHeight = 50;
	var trackWidth = 2;
	var ballSize = 12;
	var storageKey = 'tvc-volume';
	// -------------------
	
	var video = null;
	var soundButton = document.querySelector('.sound-button');
	if(!soundButton) return;
	
	function waitForVideo() {
		video = document.querySelector('video');
		if(!video) requestAnimationFrame(waitForVideo);
		else videoReady();
	}
	waitForVideo();
	
	var barTop = (controllerHeight - trackHeight) / 2;
	
	soundButton.style.position = 'relative';
	var wrapper = document.createElement('div');
	wrapper.style.position = 'absolute';
	wrapper.style.width = '100%';
	wrapper.style.height = controllerHeight+'px';
	wrapper.style.bottom = '100%';
	wrapper.style.overflow = 'hidden';
	wrapper.style.visibility = 'hidden';
	wrapper.style.transition = 'visibility '+transitionTime;
	var bar = document.createElement('div');
	bar.style.position = 'absolute';
	bar.style.width = '100%';
	bar.style.height = '100%';
	bar.style.backgroundColor = 'rgba(0,0,0,.6)';
	bar.style.backgroundImage = 'linear-gradient(white, white)';
	bar.style.backgroundRepeat = 'no-repeat';
	bar.style.backgroundSize = trackWidth + 'px ' + trackHeight + 'px';
	bar.style.backgroundPosition = 'center';
	bar.style.borderRadius = '5px 5px 0 0';
	bar.style.transform = 'translateY(100%)';
	bar.style.transition = 'transform '+transitionTime;
	var ball = document.createElement('div');
	ball.style.position = 'absolute';
	ball.style.width = ballSize+'px';
	ball.style.height = ballSize+'px';
	ball.style.borderRadius = '50%';
	ball.style.background = 'white';
	ball.style.left = '50%';
	ball.style.top = barTop + 'px';
	var hbs = ballSize / 2;
	ball.style.margin = '-'+hbs+'px 0 0 -'+hbs+'px';
	
	function videoReady() {
		var stored = localStorage.getItem(storageKey);
		if(stored === null) stored = 1;
		stored = Math.min(Math.max(+stored, 0), 1);
		setVolume(stored);
	}
	
	function setVolume(vol) {
		ball.style.transform = 'translateY('+((1 - vol) * trackHeight)+'px)';
		if(video) video.volume = vol;
		localStorage.setItem(storageKey, vol);
	}
	
	var hovered = false;
	var mouseDown = false, preventClick = false;
	var barPos = null;
	function showBar() {
		if(!wrapper || !bar) return;
		wrapper.style.visibility = 'visible';
		bar.style.transform = 'translateY(0)';
	}
	function hideBar() {
		if(!wrapper || !bar) return;
		wrapper.style.visibility = 'hidden';
		bar.style.transform = 'translateY(100%)';
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
		if(!barPos) return;
		var posIn = e.clientY - barPos.top - barTop;
		var result = 1 - Math.min(Math.max(posIn / trackHeight, 0), 1);
		setVolume(result);
	}
	bar.addEventListener('mousedown', function(e) {
		e.stopPropagation();
		barPos = wrapper.getBoundingClientRect();
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
		} else {
			preventClick = false;
		}
		mouseDown = false;
		if(!hovered) hideBar();
	});
	bar.addEventListener('click', function(e) {
		if(preventClick)
			e.stopPropagation();
		preventClick = false;
	}, true);
	
	bar.appendChild(ball);
	wrapper.appendChild(bar);
	soundButton.appendChild(wrapper);
})();
