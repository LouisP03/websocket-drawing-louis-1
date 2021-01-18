var socket;
var bwidth;
bwidth = document.getElementById('brush-width').value;

var redval = document.getElementById('redc').value;
var greenval = document.getElementById('greenc').value;
var blueval = document.getElementById('bluec').value;



function setup() {

	const elements = document.querySelectorAll(".colourSlider");
	elements.forEach(element => {
	  element.addEventListener('input', (e) => {
		var redval = document.getElementById('redc').value;
		var greenval = document.getElementById('greenc').value;
		var blueval = document.getElementById('bluec').value;

		document.getElementById('colourBlock').style.background = 'rgb(' + String(redval) + ',' + String(greenval) + ',' + String(blueval) + ')';
		//console.log('rgb(' + String(redval) + ',' + String(greenval) + ',' + String(blueval) + ')');
	   
		chosenColour = {
		  R: redval,
		  G: greenval,
		  B: blueval
		}

	  });
	});


	document.getElementById('brush-width').addEventListener('input', () => {
		bwidth = document.getElementById('brush-width').value;

		if (parseInt(bwidth) > 100) {
			bwidth = 100;
			document.getElementById('brush-width').value = 100;
		} else if (parseInt(bwidth) <= 0) {
			bwidth = 1;
			document.getElementById('brush-width').value = 1;
		};
		if (Number.isInteger(parseInt(bwidth)) == false) {
			bwidth = 36;
			document.getElementById('brush-width').value = 36;
			alert('Invalid entry. Using default width value of 36px.');
		};
	});

	
	socket = io.connect('https://websocket-drawing-louis.herokuapp.com/')
	//socket = io.connect('127.0.0.1:3000')
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

	var canvas = createCanvas(800, 700);
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
