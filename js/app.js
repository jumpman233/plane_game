/**
	created by lzh at 2017/1/11
*/


(function () {
		var img = new Image();
		img.src = 'plane.png';
		img.width = '10px';
		img.height = '10px';
		img.onload = function () {
		ctx.drawImage(img,x-15,y+15,30,30);	
	};
	function Bullet(x,y) {
		this.x = x;
		this.y = y;
		this.draw = function (ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, 5, 0, Math.PI*2, false);
			ctx.fillStyle = "green";
			ctx.fill();
			ctx.closePath();
			this.y-=20;
		};
		return this;
	}

	function draw() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		a++;
		if(a % 30 == 0){
			bulletList.push(new Bullet(x,y));
		}
		if(a % 40 == 0){
			var rx = Math.random()*200;
			var ry = Math.random()*200;
			enermyList.push({
				x: rx,
				y: ry,
				center:{
					x: rx + 5,
					y: ry + 5
				}
			});
		}
		for(var j = 0;j<enermyList.length;j++){
			ctx.beginPath();
			ctx.rect(enermyList[j].x,enermyList[j].y,10,10);
			ctx.fillStyle = "blue";
			ctx.fill();
			ctx.closePath();
		}
		for(var j = 0;j<enermyList.length;j++){
			for(var k = 0;k<bulletList.length;k++){
				if(Math.abs(bulletList[k].x - enermyList[j].center.x) < 10 &&
					Math.abs(bulletList[k].y - enermyList[j].center.y) < 10){
					enermyList[j].x = -10;
					enermyList[j].y = -10;
					enermyList[j].center.x = -10;
					enermyList[j].center.y = -10;
					bulletList[k].x = -10;
					bulletList[k].y = -10;
				}
			}
		}
		drawBall();
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
		ctx.drawImage(img,x-15,y+15,30,30);	
	}

	window.setInterval(function () {
		draw();
	},20);

	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');
	var x = canvas.width / 2;
	var y = canvas.height - 30;
	var dx = 5;
	var a = 0;
	var bulletList = [];
	var enermyList = [];

	// var dy = -2;

	var rightPressed = false;
	var leftPressed = false;
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false);

	// ctx.beginPath();
	// ctx.rect(30,25,30,40);
	// //3是x值
	// //25是y值
	// //30是宽度
	// //40是高度
	// ctx.stroke();
	// ctx.closePath();
	function mouseMoveHandler(e) {
		x = e.pageX;
		y = e.pageY;
		// console.log(e.pageX+','+e.pageY);
	}
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
//}());
});