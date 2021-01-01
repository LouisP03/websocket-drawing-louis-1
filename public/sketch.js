var socket;
var width;

function setup() {
	document.getElementById('brush-width').addEventListener('input', () => {
		width = document.getElementById('brush-width').value;
	});

	createCanvas(800, 700);
	background(51);

	socket = io.connect('https://websocket-drawing-louis.herokuapp.com/')
	socket.on('mouse', (data) => {
		noStroke();
		fill(255, 0, 100);
		ellipse(data.x, data.y, data.brush-width, data.brush-width);
	});

}

function mouseDragged() {
	console.log("Sending: " + mouseX + ", " + mouseY);

	//Creating a message to send to server
	//name and data

	var data = {
		x: mouseX,
		y: mouseY,
		brush-width: width;
	}

	socket.emit('mouse', data);


	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, width, width);
}

function draw() {

}