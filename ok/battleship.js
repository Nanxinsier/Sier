var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayHitHead: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hitHead");
	},
	displayHitBody: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hitBody");
	},
	displayHitAfterBody: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hitAfterBody");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	},
	displaySunk: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "sunk");
	}
};


//  view.displayMessage("Tap tap, is this things on?");

//  model是一个对象，boardSize（游戏板网格的大小），numShips（游戏包含的战舰数），shipLength（每艘战舰占据多少个单元格）
var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	// shipsSunk: 0,
	ships: [{
			locations: [0, 0, 0],
			hits: ["", "", ""],
			sunk:""
		}, //  依次获取战舰
		{
			locations: [0, 0, 0],
			hits: ["", "", ""],
			sunk:""
		},
		{
			locations: [0, 0, 0],
			hits: ["", "", ""],
			sunk:""
		}
	],



	//六个格子一艘战舰的代码
	// 	           boardSize: 7,
	//						numShips: 3,
	//						shipLength: 6,
	//						shipsSunk: 0,
	//						ships: [{
	//								locations: [0, 0, 0,0,0,0],
	//								hits: ["", "", "", "", "", ""]
	//						},{
	//								locations: [0, 0, 0,0,0,0],
	//								hits: ["", "", "", "", "", ""]
	//						},{
	//								locations: [0, 0, 0,0,0,0],
	//								hits: ["", "", "", "", "", ""]
	//							}
	//						],



	//  是否击中战舰，并返回true||false
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess); //  获取guess索引
			if (index >= 0) {
				ship.hits[index] = "hit";
				if(i===2){
					if (index == 0) {
						view.displayHitHead(guess);
					} else if (index == 1) {
						view.displayHitBody(guess);
					} else if (index == 2) {
						view.displayHitAfterBody(guess);
					}
				}else{
					view.displayHit(guess);
				}
				view.displayMessage("哦吼？你真厉害！击中啦！");
				if (this.isSunk(ship)) {
					view.displayMessage("鸭吼！你击沉了我的战舰！下面可不会那么容易呦！");
					// this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("哎呀，很遗憾，它跑掉了呢，你未击中！");
		return false;
	},




	//三分之二击沉更改后代码
	isSunk: function(ship) {
		var j = 0;
		var k = 0;
		var guess = '';
		for (var i = 0; i < (this.shipLength); i++) {
			if (ship.hits[i] === "hit") {
				j++;
			} 
			// else {
			// 	k = i;
			// 	guess = ship.locations[k];
			// }
		}
		if (j >= (this.shipLength)*2/3) {
			// if (k == 0) {
			// 	view.displaySunk(guess);
			// 	// view.displayHitHead(guess);
			// } else if (k == 1) {
			// 	view.displaySunk(guess);
			// 	// view.displayHitBody(guess);
			// } else if (k == 2) {
			// 	view.displaySunk(guess);
			// 	// view.displayHitAfterBody(guess);
			// }
			
			for (var i = 0; i < (this.shipLength); i++) {
				guess = ship.locations[i];
				view.displaySunk(guess);
			}
			ship.sunk = "sunk";
			
			return true;
		} else {
			return false;
		}
	},



	//  do while循环
	generateShipLocations: function() { //  主方法，创建model对象的ships数组，（属性）numShips指定战舰
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() { //  创建一艘战舰并指定其所在位置
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) { //横向
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else { //竖向
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

};

//     自动类型转换
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("嘿！伙计，输入一个字母和一个数字组合才行。");
	} else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		if (isNaN(row) || isNaN(column)) {
			alert("笨蛋，你要打的战舰还在外太空遛弯呢！");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
};


//三分之二击沉更改后代码
var controller = {
	guesses: 0,
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			var shipsSunk = 0;
			for (var i = 0; i < model.numShips; i++) {
				if(model.ships[i].sunk === "sunk"){
					shipsSunk++;
				}
			}
			if (hit && shipsSunk === model.numShips) {
				//  view.displayMessage("You sank all my battleships, in " + this.guesses + "guesses");
				//         view.displayMessage("天啦噜！你实在是太棒啦！你击败了我所有的战舰， 经过了" + this.guesses + "次猜测，游戏结束！");
				alert("天啦噜！你实在是太棒啦！你击败了我所有的战舰， 经过了" + this.guesses + "次猜测，游戏结束！");
			}
		}
	}
};

function init() {
	//  绑定页面中的fireButton元素到变量fireButton
	var fireButton = document.getElementById("fireButton");
	//  绑定onclick事件，执行handleFireButton函数
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}
window.onload = init;

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	//   	console.log(model.ships)  //  控制台输出
	guessInput.value = "";
};

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) { //  回车键
		fireButton.click();
		return false;
	}
};

view.displayMessage("来啦老弟？欢迎来到我的战舰游戏！");

var tds = document.getElementsByTagName("td");
for (var i = 0; i < tds.length; i++) {
	tds[i].onclick = (function(x) {
		return function() {
			handleFireButtonByOnclick(tds[x].getAttribute("location"));
		}
	})(i)
}

function handleFireButtonByOnclick(place) {
	controller.processGuess(place);
};
