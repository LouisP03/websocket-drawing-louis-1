var socket;
var width;
window.onload = () => {
	width = document.getElementById('brush-width').value;
}

function setup() {
	socket = io.connect('https://websocket-drawing-louis.herokuapp.com/')
	socket.on('mouse', (data) => {
		noStroke();
		fill(255, 0, 100);
		
		ellipse(data.x, data.y, data.brushWidth, data.brushWidth);
		strokeWeight(data.brushWidth);
		stroke(255, 0, 100);
		line(parseInt(data.x), parseInt(data.y), parseInt(data.px), parseInt(data.py));
	});
	socket.on('onReset', (resetData) => {
		background(parseInt(resetData.bgColor));
	});

	width = document.getElementById('brush-width').value;

	document.getElementById('brush-width').addEventListener('input', () => {
		width = document.getElementById('brush-width').value;

		if (parseInt(width) > 100) {
			width = 100;
		} else if (parseInt(width) <= 0) {
			width = 1;
		};
		if (Number.isInteger(parseInt(width)) == False) {
			width = 36;
			alert('Invalid entry. Using default width value of 36px.');
		};
	});

	document.getElementById('resetButton').addEventListener('click', () => {
		var resetData = {
			bgColor: '51'
		}
		background(parseInt(resetData.bgColor));
		//alert('Reset event detected.');
		socket.emit('onReset', resetData);
	})

	createCanvas(800, 700);
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
		brushWidth: width
	};

	socket.emit('mouse', data);

	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, data.brushWidth, data.brushWidth);
	strokeWeight(data.brushWidth);
	stroke(255);
	line(parseInt(data.x), parseInt(data.y), parseInt(data.px), parseInt(data.py));
}

function draw() {

}