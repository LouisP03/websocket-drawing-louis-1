var socket;
var width;
width = document.getElementById('brush-width').value;

function setup() {
	width = document.getElementById('brush-width').value;

	document.getElementById('brush-width').addEventListener('input', () => {
		width = document.getElementById('brush-width').value;
	});

	createCanvas(800, 700);
	background(51);

	socket = io.connect('https://websocket-drawing-louis.herokuapp.com/')
	socket.on('mouse', (data) => {
		noStroke();
		fill(255, 0, 100);
		ellipse(data.x, data.y, data.brushWidth, data.brushWidth);
	});

}

function mouseDragged() {
	console.log("Sending: " + mouseX + ", " + mouseY);

	//Creating a message to send to server
	//name and data

	var data = {
		x: mouseX,
		y: mouseY,
		brushWidth: width
	}

	socket.emit('mouse', data);


	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, width, width);
}

function draw() {

}