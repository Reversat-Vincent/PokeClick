"use strict";
var timeRest = 30;
var timeTaille = 100;
var Timecss = 100 + "%";
var stop;
var ennemieVaincu = 0;
var degats = 2;
var PVmax = 5;
var PV = 5;
var PVtaille = 100;
var PVcss = 100 + "%";
var xp = 0;
var xpmax = 10;
var or = 0;
var orCout = 20;
var orRevenu = 1;
var level = 1;
var PPAuroreMax = 10;
var PPAurore = 10;
var PPBoutefeuMax = 10;
var PPBoutefeu = 10;
var ennemieParStage = 0;
var Stage = 1;
var STORIES;
var STORY_STEP;
var poke;
loadStories(init);
function init() {
	document.getElementById('levelRaise').onclick = levelUp;
	document.getElementById('Aurore').onclick = Aurore;
	document.getElementById('Boutefeu').onclick = Boutefeu;
	document.getElementById('ennemie').onclick = ennemie;
	document.getElementsByClassName('crop')[0].onclick = storyNextStep;
	displayStory();
}
function startTimer() {
	timeRest = 30;
	stop = setInterval(function() {
		timeRest = timeRest - 0.1;
		document.getElementById('timeRest').innerHTML = Math.round(timeRest);
		tailleTime();
		if (timeRest < 0.05) {
			PV = PVmax;
			document.getElementById('PV').innerHTML = PV;
			taillePV();
			timeRest = 30;
		}
	}
	,100);
}
function stopTimer() {
	clearInterval(stop)
}
function tailleTime() {
	var tailleTime = document.getElementById('Timecolor');
	timeTaille = timeRest / 30 * 100;
	Timecss = timeTaille + "%";
	tailleTime.style.width = Timecss;
}
function Aurore() {
	if (PPAurore > 0) {
		if (timeRest <= 15) {
			timeRest = timeRest + 15;
		} else {
			timeRest = 30;
		}
	PPAurore--;
	document.getElementById('PPAurore').innerHTML = PPAurore;
	}
}
function Boutefeu() {
	if (PPBoutefeu > 0) {
		PV = PV - degats * 8;
		taillePV();
		timeRest = timeRest - 7;
		PPBoutefeu--;
		document.getElementById('PPBoutefeu').innerHTML = PPBoutefeu;
		xp++;
		or++;
		document.getElementById('OR').innerHTML = or;
		document.getElementById('PV').innerHTML = PV;
		win();
	}
}
function taillePV() {
	var taillePVElem = document.getElementById('PVcolor');
	PVtaille = PV / PVmax * 100;
	PVcss = PVtaille + "%";
	taillePVElem.style.width = PVcss;
}
function levelUp() {
	if (or >= orCout) {
		or = or - orCout;
		document.getElementById('OR').innerHTML = or;
		degats++;
		level++;
		document.getElementById('level').innerHTML = level;
		animation();
		orCout = orCout + 5;
		orRevenu++;
		console.log("xpmax avant : " + xpmax);
		xpmax = xpmax + 3;
		console.log("xpmax apres : " + xpmax);
		console.log("Up degats : " + degats);
		console.log("or restant : " + or);
	}
}
function displayStory() {
	stopTimer();
	STORY_STEP = 0;
	document.getElementsByClassName('crop')[0].style.display = "block";
	document.getElementsByClassName('story')[0].src = 'image/Kanto.jpg';
	document.getElementsByClassName('arcanin')[0].src = STORIES[Stage].orientation;
	document.getElementsByClassName('arcanin')[0].style.top = STORIES[Stage].positionTop;
	document.getElementsByClassName('arcanin')[0].style.left = STORIES[Stage].positionLeft;
	if (STORIES[Stage].text) {
		document.getElementsByClassName('storyText')[0].innerHTML = STORIES[Stage].text;
	} else {
		document.getElementsByClassName('storyText')[0].innerHTML = '';
	}
	document.getElementsByClassName('poke')[0].innerHTML = "";
	document.getElementsByClassName('img')[0].style.display = 'none';
	PPAurore = PPAuroreMax;
	document.getElementById('PPAurore').innerHTML = PPAurore;
	PPBoutefeu = PPBoutefeuMax;
	document.getElementById('PPBoutefeu').innerHTML = PPBoutefeu;
}
function storyNextStep() {
	if (poke) {
		stopTimer();
		document.getElementsByClassName('crop')[0].style.display = "none";
		startTimer();
	} else {
		poke = STORIES[Stage].script[STORY_STEP].imgFight;
		stopTimer();
		document.getElementsByClassName('crop')[0].style.display = "block";
		setTimeout(function() {
			displayStoryStep(function() {
				++ STORY_STEP;
			});
		}, 100);
	}
}
function displayStoryStep(callback, skipStart) {
	if (STORIES[Stage].script[STORY_STEP].startPosition && !skipStart) {
		var startChangePosition = document.getElementsByClassName('arcanin')[0];
		startChangePosition.style.transition = 'none';
		startChangePosition.style.top = STORIES[Stage].script[STORY_STEP].startPosition.positionTop;
		startChangePosition.style.left = STORIES[Stage].script[STORY_STEP].startPosition.positionLeft;
		setTimeout(function(){
			displayStoryStep(callback, true);
		}, 100);
		return;
	}
	document.getElementsByClassName('arcanin')[0].style.transition = STORIES[Stage].script[STORY_STEP].transition;
	document.getElementsByClassName('story')[0].src = STORIES[Stage].script[STORY_STEP].imgSrc;
	document.getElementsByClassName('story')[0].onload = function() {
		document.getElementsByClassName('img-container')[0].style.width = document.getElementsByClassName('story')[0].width + 'px';
	};
	document.getElementsByClassName('arcanin')[0].style.top = STORIES[Stage].script[STORY_STEP].positionTop;
	document.getElementsByClassName('arcanin')[0].style.left = STORIES[Stage].script[STORY_STEP].positionLeft;
	if (STORIES[Stage].script[STORY_STEP].text) {
		if (STORIES[Stage].script[STORY_STEP].text.text) {
			document.getElementsByClassName('storyText')[0].innerHTML = STORIES[Stage].script[STORY_STEP].text.text;
		} else {
			document.getElementsByClassName('storyText')[0].innerHTML = '';
		}
		if (STORIES[Stage].script[STORY_STEP].text.img) {
			document.getElementsByClassName('img')[0].onload = function() {
				document.getElementsByClassName('img')[0].style.display = 'inline';
			};
			document.getElementsByClassName('img')[0].src = STORIES[Stage].script[STORY_STEP].text.img;
		} else {
			document.getElementsByClassName('img')[0].style.display = 'none';
		}
	} else {
		document.getElementsByClassName('storyText')[0].innerHTML = '';
		document.getElementsByClassName('img')[0].style.display = 'none';
	}
	if (STORIES[Stage].orientation) {
		document.getElementsByClassName('arcanin')[0].src = STORIES[Stage].orientation;
	}
	if (STORIES[Stage].script[STORY_STEP].orientation) {
		document.getElementsByClassName('arcanin')[0].src = STORIES[Stage].script[STORY_STEP].orientation;
	}
	document.getElementsByClassName('poke')[0].innerHTML = "";
	var poke = STORIES[Stage].script[STORY_STEP].poke;
	if (poke) {
		poke.forEach(function(pokeEntry) {
			var node = document.createElement("img");
			node.src = pokeEntry.imgMap;
			node.style.top = pokeEntry.positionTop;
			node.style.left = pokeEntry.positionLeft;
			document.getElementsByClassName('poke')[0].appendChild(node);
		})
	}
	if (STORIES[Stage].script[STORY_STEP].imgFight) {
		document.getElementById('ennemie').src = STORIES[Stage].script[STORY_STEP].imgFight;
	}
	if (STORIES[Stage].script[STORY_STEP].end) {
		setTimeout(function(){
			document.getElementById('end').style.display = 'block';
		},5000);
	}
	callback();
}
function win() {
	if (PV <= 0) {
		console.log("ennemie vaincu");
		ennemieParStage++;
		document.getElementById('ennemieKill').innerHTML = ennemieParStage;
		if (ennemieParStage === 5) {
			PVmax = PVmax / 2;
			Stage++;
			document.getElementById('Stage').innerHTML = Stage;
			ennemieParStage = 0;
			document.getElementById('ennemieKill').innerHTML = ennemieParStage;
			displayStory();
		}
		xp = Math.floor(xp + (PVmax / degats));
		or = or + orRevenu;
		document.getElementById('OR').innerHTML = or;
		orRevenu++;
			if (xp >= xpmax) {
				xp = xp - xpmax;
				xpmax = xpmax + 5;
				degats++;
			}
		console.log("xp : " + xp);
		console.log("degats :" + degats);
		console.log("or :" + or);
		PVmax = PVmax + 15;
		if (ennemieParStage != 4) {
			PV = PVmax;
		} else {
			PVmax = PVmax * 2;
			PV = PVmax;
		}
		document.getElementById('PV').innerHTML = PV;
		taillePV();
		timeRest = 30;
		poke = null;
		if (STORY_STEP != 0) {
		storyNextStep();
		}
	}
}
function ennemie() {
	PV = PV - degats;
	taillePV();
	timeRest--;
	xp++;
	or++;
	document.getElementById('OR').innerHTML = or;
	document.getElementById('PV').innerHTML = PV;
	win();
}
function animation() {
	var animation = document.getElementById('ArcaninGold');
	animation.style.visibility = "visible";
	animation.style.marginBottom = "0.5px";
	setTimeout(function() {animation.style.marginBottom = "1px";},75);
	setTimeout(function() {animation.style.marginBottom = "1.5px";},150);
	setTimeout(function() {animation.style.marginBottom = "2px";},225);
	setTimeout(function() {animation.style.marginBottom = "2.5px";},300);
	setTimeout(function() {animation.style.marginBottom = "3px";},375);
	setTimeout(function() {animation.style.marginBottom = "3.5px";},450);
	setTimeout(function() {animation.style.marginBottom = "4px";},525);
	setTimeout(function() {animation.style.marginBottom = "4.5px";},600);
	setTimeout(function() {animation.style.marginBottom = "5px";},675);
	setTimeout(function() {animation.style.visibility = "hidden";},1000);
}
function loadStories(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'stories.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			STORIES = JSON.parse(xobj.responseText);
			callback();
		}
	};
	xobj.send(null);  
}