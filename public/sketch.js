var socket;
var bwidth;
window.onload = function() {
	bwidth = document.getElementById('brush-width').value;
};

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

	document.getElementById('brush-width').addEventListener('input', () => {
		bwidth = document.getElementById('brush-width').value;

		if (parseInt(bwidth) > 100) {
			bwidth = 100;
			document.getElementById('brush-width').value = 100;
		} else if (parseInt(bwidth) <= 0) {
			bwidth = 1;
			document.getElementById('brush-width').value = 1;
		};
		if (Number.isInteger(parseInt(bwidth)) == False) {
			bwidth = 36;
			document.getElementById('brush-width').value = 36;
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

	var canvas = createCanvas(800, 700);
	canvas.parent('subContainer');
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
		brushWidth: bwidth
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