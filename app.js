


(function () {
	function bullet(x,y) {
		this.x = x;
		this.y = y;
		this.draw = function (ctx) {
			ctx.beginPath();
			ctx.arc(x, y, 10, 0, Math.PI*2, false);
			ctx.fillStyle = "green";
			ctx.fill();
			ctx.closePath();
			y-=20;
		}
		return this;
	}
	var bulletList = [];
	function draw() {
		a++;
		if(a % 5 == 0){
			console.log("?");
			bulletList.push(new bullet(x,y));
		}
		// bulletList.push(new bullet(x,y));
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawBall();
		// console.log('right '+rightPressed);
		// console.log('left '+leftPressed);
		for(var i = 0; i < bulletList.length; i++){
			bulletList[i].draw(ctx);
		}
		if(rightPressed && !leftPressed){
			x += dx;
		} else if(!rightPressed && leftPressed){
			x -= dx;
		}
	}
	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, 20, 0, Math.PI*2, false);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();
	}
	window.setInterval(function () {
		draw();
	},20)
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');
	var x = canvas.width / 2;
	var y = canvas.height - 30;
	var dx = 5;
	var a = 0;
	// var dy = -2;

	var rightPressed = false;
	var leftPressed = false;
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	function keyDownHandler(e) {
		if(e.keyCode == 39){
			rightPressed = true;
		} else if(e.keyCode == 37){
			leftPressed = true;
		}
	}
	function keyUpHandler(e) {
		if(e.keyCode == 39){
			rightPressed = false;
		} else if(e.keyCode == 37){
			leftPressed = false;
		}
	}
}())