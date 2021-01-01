var socket;

function setup() {
	createCanvas(400, 300);
	background(51);

	socket = io.connect('https://websocket-drawing-louis.herokuapp.com/')
	socket.on('mouse', (data) => {
		noStroke();
		fill(255, 0, 100);
		ellipse(data.x, data.y, 36, 36);
	});

}

function mouseDragged() {
	console.log("Sending: " + mouseX + ", " + mouseY);

	//Creating a message to send to server
	//name and data

	var data = {
		x: mouseX,
		y: mouseY
	}

	socket.emit('mouse', data);


	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, 36, 36);
}

function draw() {

}