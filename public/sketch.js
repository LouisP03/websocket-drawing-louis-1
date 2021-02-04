var socket;
var bwidth;

bwidth = document.getElementById('brush-width').value;

var redval = document.getElementById('redc').value;
var greenval = document.getElementById('greenc').value;
var blueval = document.getElementById('bluec').value;

chosenColour = {
	R: redval,
	G: greenval,
	B: blueval
};

function setup() {
	frameRate(60);
	const elements = document.querySelectorAll(".colourSlider");
	elements.forEach(element => {
	  element.addEventListener('input', (e) => {
		var redval = document.getElementById('redc').value;
		var greenval = document.getElementById('greenc').value;
		var blueval = document.getElementById('bluec').value;

		document.getElementById('colourBlock').style.background = 'rgb(' + String(redval) + ',' + String(greenval) + ',' + String(blueval) + ')';
		document.getElementById('subContainer').style['border-left'] = String(bwidth) + 'px solid ' + 'rgb(' + String(redval) + ',' + String(greenval) + ',' + String(blueval) + ')';
		document.getElementById('subContainer').style['border-right'] = String(bwidth) + 'px solid ' + 'rgb(' + String(redval) + ',' + String(greenval) + ',' + String(blueval) + ')';

		//console.log('rgb(' + String(redval) + ',' + String(greenval) + ',' + String(blueval) + ')');
	   
		chosenColour = {
		  R: String(redval),
		  G: String(greenval),
		  B: String(blueval)
		}

	  });
	});


	document.getElementById('brush-width').addEventListener('input', () => {
		bwidth = document.getElementById('brush-width').value;
		document.getElementById('subContainer').style['border-left'] = String(bwidth) + "px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";
		document.getElementById('subContainer').style['border-right'] = String(bwidth) + "px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";


		if (parseInt(bwidth) > 100) {
			bwidth = 100;
			document.getElementById('brush-width').value = 100;
			document.getElementById('subContainer').style['border-left'] = "100px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";
			document.getElementById('subContainer').style['border-right'] = "100px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";
		} else if (parseInt(bwidth) <= 0) {
			bwidth = 1;
			document.getElementById('brush-width').value = 1;
			document.getElementById('subContainer').style['border-left'] = "1px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";
			document.getElementById('subContainer').style['border-right'] = "1px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";

		};
		if (Number.isInteger(parseInt(bwidth)) == false) {
			bwidth = 36;
			document.getElementById('brush-width').value = 36;
			document.getElementById('subContainer').style['border-left'] = "36px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";
			document.getElementById('subContainer').style['border-right'] = "36px solid " + "rgb(" + chosenColour.R + "," + chosenColour.G + "," + chosenColour.B + ")";
			alert('Invalid entry. Using default width value of 36px.');
		};
	});

	
	socket = io.connect('https://websocket-drawing-louis.herokuapp.com/')
	//socket = io.connect('127.0.0.1:3000')
	//socket.emit('requestCanvasData');
/*
	socket.on('requestCanvasData', (canvasData) => {
		noStroke();
		fill(parseInt(data.redvalue), parseInt(data.greenvalue), parseInt(data.bluevalue));
		
		ellipse(data.x, data.y, data.brushWidth, data.brushWidth);
		strokeWeight(parseInt(data.brushWidth));
		stroke(parseInt(data.redvalue), parseInt(data.greenvalue), parseInt(data.bluevalue));
		line(parseInt(data.x), parseInt(data.y), parseInt(data.px), parseInt(data.py));

	});*/
/*	
	socket.on('requestCanvasData', (canvasData) => {
		console.log(canvasData);
	});
*/
	socket.on('mouse', (data) => {
		noStroke();
		fill(parseInt(data.redvalue), parseInt(data.greenvalue), parseInt(data.bluevalue));
		
		ellipse(data.x, data.y, data.brushWidth, data.brushWidth);
		strokeWeight(parseInt(data.brushWidth));
		stroke(parseInt(data.redvalue), parseInt(data.greenvalue), parseInt(data.bluevalue));
		line(parseInt(data.x), parseInt(data.y), parseInt(data.px), parseInt(data.py));

	});

	socket.on('onReset', (resetData) => {
		background(parseInt(resetData.bgColor));
	});

	document.getElementById('resetButton').addEventListener('click', () => {
		var resetData = {
			bgColor: '51'
		}
		background(parseInt(resetData.bgColor));
		//alert('Reset event detected.');
		socket.emit('onReset', resetData);
	})

	var canvas = createCanvas(1000, 700);
	canvas.parent('containerDiv');
	background(51);
}

function mouseDragged() {
	console.log("Sending: " + mouseX + ", " + mouseY + ' -- ' + width);
	console.log("Previous mouse pos: -------- : " + pmouseX + ", " + pmouseY);
	//Creating a message to send to server
	//name and data

	var data = {
		x: mouseX,
		y: mouseY,
		px: pmouseX,
		py: pmouseY,
		brushWidth: bwidth,
		redvalue: chosenColour.R,
		greenvalue: chosenColour.G,
		bluevalue: chosenColour.B
	};

	noStroke();
	fill(parseInt(data.redvalue), parseInt(data.greenvalue), parseInt(data.bluevalue));
	ellipse(data.x, data.y, data.brushWidth, data.brushWidth);
	strokeWeight(parseInt(data.brushWidth));
	stroke(parseInt(data.redvalue), parseInt(data.greenvalue), parseInt(data.bluevalue));
	line(parseInt(data.x), parseInt(data.y), parseInt(data.px), parseInt(data.py));


	socket.emit('mouse', data);
}

function mousePressed() {
	console.log("Sending: " + mouseX + ", " + mouseY + ' -- ' + width);

	var clickData = {
		x: mouseX,
		y: mouseY,
		brushWidth: bwidth,
		redvalue: chosenColour.R,
		greenvalue: chosenColour.G,
		bluevalue: chosenColour.B
	};

	var c = document.getElementById('dropperStatus');
	if (c.checked) {
		var dropperColour = get(parseInt(clickData.x), parseInt(clickData.y));

		document.getElementById('redc').value = dropperColour[0];
		document.getElementById('greenc').value = dropperColour[1];
		document.getElementById('bluec').value = dropperColour[2];

		c.checked = false;

		chosenColour = {
			R: String(dropperColour[0]),
			G: String(dropperColour[1]),
			B: String(dropperColour[2])
		  }

		document.getElementById('subContainer').style['border-left'] = String(bwidth) + 'px solid ' + 'rgb(' + chosenColour.R + ',' + chosenColour.G + ',' + chosenColour.B + ')';
		document.getElementById('subContainer').style['border-right'] = String(bwidth) + 'px solid ' + 'rgb(' + chosenColour.R + ',' + chosenColour.G + ',' + chosenColour.B + ')';
  

	} else {
		noStroke();
		fill(parseInt(clickData.redvalue), parseInt(clickData.greenvalue), parseInt(clickData.bluevalue));
		ellipse(clickData.x, clickData.y, clickData.brushWidth, clickData.brushWidth);
		socket.emit('click', clickData);
	}

}

function saveToFile() {
	var currentDate = new Date();
	var cDay = currentDate.getDay();
	var cMonth = currentDate.getMonth() + 1;
	var cYear = currentDate.getFullYear();
	var cHour = currentDate.getHours();
	var cMinute = currentDate.getMinutes();
	var cSecond = currentDate.getSeconds();
	console.log(cYear);
	console.log(cMonth);
	console.log(cDay);
	var filename = `LVP_${cYear}-${cMonth}-${cDay}-${cHour}_${cMinute}_${cSecond}_canvas`;
	saveCanvas(filename, 'png');

}