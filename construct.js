	/**
	* position class
	*	sign a coordinate
	* attributes:
		 x: number
		 y: number
	*/
	function position(x,y) {
		this.x = x;
		this.y = y;
	};
	position.prototype = {
		constructor: position,
		toString: function () {
			return '('+this.x+','+this.y+')';
		}
	}

	/**
	* flyObject
	* a basic obejct which can fly
	* parent of class 'plane' and 'bullet'
	* attributes:
		position: 	position
		speed: 		number
		imgSrc: 	string
		rotate: 	string
	*/
	function flyObject(params) {
		if(params.x && params.y){
			this.position = new position(params.x,params.y);
		}
		if(params.speed){
			this.speed = params.speed;
		}
		if(params.imgSrc){
			this.imgSrc = params.imgSrc;
		}
		if(params.rotate){
			this.rotate = params.rotate;
		}
	};
	flyObject.prototype = {
		className: 'flyObject',
		constructor: flyObject,
		context : null
	};
	/**
	* plane
	* object can shoot
	* child of class 'flyObject'
	* attributes:
		position: 	position
		speed: 		number
		imgSrc: 	string
		rotate: 	string
		type: 		number
		maxHp: 		number
	*/
	function plane(params) {
		flyObject.apply(this,arguments);
		if(params.type){
			this.type = params.type;
		}
		if(params.maxHp){
			this.maxHp = params.maxHp;
		}
	};
	plane.prototype = {
		className: 'plane',
		constructor: plane
	};

	/**
	* bullet
	* object can be shot
	* child of class 'flyObject'
	* attributes:
		position: 	position
		speed: 		number
		imgSrc: 	string
		rotate: 	string
		type: 		number
		damage: 	number
	*/
	function bullet(params) {
		flyObject.apply(this,arguments);
		if(params.type){
			this.type = params.type;
		}
		if(params.damage){
			this.damage = params.damage;
		}
		this.draw = function () {

		}
	};
	bullet.prototype = {
		className: 'bullet',
		constructor: bullet
	};


	function planeGame(params) {
		if(params.backgroundSrc){
			planeGame.backgroundSrc = params.backgroundSrc;
		} 
		if(params.canvasElement){
			this.canvasElement = params.canvasElement;
			this.context = this.canvasElement.getContext('2d');
		}
		if(params.planeDataSrc){
			this.planeDataSrc = params.planeDataSrc;
		}
		if(params.bulletDataSrc){
			this.bulletDataSrc = params.bulletDataSrc;
		}
		this.isInit = false;
	};
	planeGame.prototype = {
		getPlaneData: function () {
			var game = this;
			console.log('开始获取：' + game.planeDataSrc);
			$.ajax({
				url: this.planeDataSrc,
				cache: false,
				async: false,
				type:"POST",
				dataType: 'json',
				success: function (response) {
					console.log('获取成功：'+ game.planeDataSrc);
				},
				error: function (response) {
					console.log('获取失败：'+ game.planeDataSrc);
				}
			})
		},
		getBulletData:function () {
			var game = this;
			console.log('开始获取：' + game.bulletDataSrc);
			$.ajax({
				url: this.bulletDataSrc,
				cache: false,
				async: false,
				type:"POST",
				dataType: 'json',
				success: function (response) {
					console.log(response)
					console.log('获取成功：'+ game.bulletDataSrc);
				},
				error:function () {
					console.log('获取失败：'+ game.bulletDataSrc);
				}
			})
		},
		start: function () {

		},
		init: function () {
			this.getBulletData();
			this.getPlaneData();
		}
	}


	var config = {
		canvasElement: $('#myCanvas')[0],
		planeDataSrc: 'plane.json',
		bulletDataSrc: 'bullet.json'
	}
	var planeGame = new planeGame(config);
	planeGame.init();