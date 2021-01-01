var socket;
var width;
width = document.getElementById('brush-width').value;

function setup() {
	socket = io.connect('https://websocket-drawing-louis.herokuapp.com/')
	socket.on('mouse', (data) => {
		noStroke();
		fill(255, 0, 100);
		ellipse(data.x, data.y, data.brushWidth, data.brushWidth);
		//strokeWeight(data.brushWidth);
		line(data.x, data.y, data.px, data.py);
	});
	socket.on('onReset', (resetData) => {
		background(parseInt(resetData.bgColor));
	});

	width = document.getElementById('brush-width').value;

	document.getElementById('brush-width').addEventListener('input', () => {
		width = document.getElementById('brush-width').value;
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
	ellipse(mouseX, mouseY, width, width);
}

function draw() {

}