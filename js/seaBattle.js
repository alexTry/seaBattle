// Хак убирающий выделение нужного элемента см. (*) ниже
$.fn.extend({ 
    disableSelection: function() { 
        this.each(function() { 
            if (typeof this.onselectstart != 'undefined') {
                this.onselectstart = function() { return false; };
            } else if (typeof this.style.MozUserSelect != 'undefined') {
                this.style.MozUserSelect = 'none';
            } else {
                this.onmousedown = function() { return false; };
            }
        }); 
    } 
});
$('*').disableSelection(); 
$(document).ready(function(){

	function Plate(parent) {
		this.parent = parent;
		this.toEnd = 0;
		this.toKill();
		this.killEmAll();
		this.addDefaultPic();
		this.shipArray = {};
		return this;
	}
	
	Plate.prototype.addDefaultPic = function() {
		var defs = new SVG({'el':'defs'});
		var dot = new SVG({
			'el':'circle',
			'content':{
				'id':'dot',
				'cx':'15',
				'cy':'15',
				'r':'3.2',
				'fill':'#000796'
			}
		});
		var crest = new SVG({
			'el':'path',
			'content':{
				'id':'crest',
				'd':'M2 2 l26 26 m-26 0 l26 -26',
				'fill':'none',
				'stroke':'#000796',
				'stroke-width': '2'
			}
		});
		$(this.parent).children('svg').append(defs);
		$(this.parent).children('svg').children('defs').append(dot);
		$(this.parent).children('svg').children('defs').append(crest);
		
	}
	Plate.prototype.addDot = function(x, y, show) {
		var visibility = show || 'visible';
		var realX = x * 30;
		var realY = y * 30;
		var use = new SVG({
			'el': 'use', 
			'content': {
				href: '#dot', 
				x: realX, 
				y: realY,
				'class': visibility
				}
			});
		$(this.parent).children('svg').append(use);
	}
	Plate.prototype.addCrest = function(x, y, show) {
		var visibility = show || 'hide';
		var realX = x * 30;
		var realY = y * 30;
		var use = new SVG({
			'el': 'use', 
			'content': {
				href: '#crest', 
				x: realX, 
				y: realY,
				'class': visibility
				}
			});
			this.toEnd = this.toEnd + 1;
		$(this.parent).children('svg').append(use);
	}
	Plate.prototype.clearDots = function() {
		for (key in this.battleArray){
			if (this.battleArray.hasOwnProperty(key)){
				var i, j = this.battleArray[key].length;
				for (i = 0; i < j; i += 1 ){
					if (this.battleArray[key][i] === -1){
				   		this.battleArray[key][i] = 0;
				   	}
				}
			}
		};
	}
	Plate.prototype.checkToEnd = function () {
		if (this.toEnd === 20) {
			return false;
		} else {
			return true;
		}
	}
	Plate.prototype.toKill = function() {
		this.four = 4;
		this.three = [3, 3];
		this.threeLength = this.three.length;
		this.two = [2, 2, 2];
		this.twoLength = this.two.length;
		this.one = [1,1,1,1];
		this.oneLength = this.one.length;
		return this;
	}
	Plate.prototype.killEmAll = function(start) {
		this.search = start || false;
		this.oldCoord;
		this.lastCoord;
		this.killPos;
		this.cashKillPos;
	}
	// Проверка ранен/убит  
	Plate.prototype.checkToKill = function(n) {
		if (n === 4) {
			this.four = this.four - 1;		
			if (this.four === 0) {
				return 2;
			} else {
				return 1;
			}
			
		} 
		if (n >= 3 && n < 4){
			var nArray = (+(n-parseInt(n)).toFixed(1))*10;
			this.three[nArray] = this.three[nArray] - 1;
				if (this.three[nArray] === 0 ) {
					return 2;	
				} else {
					return 1;
				}
				
		} 
		if (n >= 2 && n < 3) {
			var nArray = (+(n-parseInt(n)).toFixed(1))*10;
			this.two[nArray] = this.two[nArray] - 1;
				if (this.two[nArray] === 0 ) {
					return 2;	
				} else {
					return 1;
				}
		} 
		if (n >= 1 && n < 2) {
			var nArray = (+(n-parseInt(n)).toFixed(1))*10;
			this.one[nArray] = this.one[nArray] - 1;
				if (this.one[nArray] === 0 ) {
					return 2;	
				} else {
					return 1;
				}
		}
	}
	Plate.prototype.canRun = function(x, y) {
		var realX = x * 30;
		var realY = y * 30;
		var x = true;

		$(this.parent).children('svg').children('use').each(function(){
			if ($(this).attr('href') === '#crest' ) {
				if ($(this).attr('x') == realX && $(this).attr('y') == realY) {
					x = false;
				}
			}
			if ($(this).attr('href') === '#dot' ) {
				if ($(this).attr('x') == realX && $(this).attr('y') == realY) {
					x = false;
				}
			}
			
		});
		return x;
	}
	Plate.prototype.create = function() {
		
		var newbattleArea = function() {
			function matrixArray(rows,columns){
				var arr = new Array();
				
				for(var i=0; i<columns; i++){
					arr[i] = new Array();
					
					for(var j=0; j<rows; j++){
						arr[i][j] = 0;
    				}
  				}
  				return arr;
			}
			return matrixArray(10, 10);
		}

		this.battleArray = newbattleArea();
		this.killBattleArray = newbattleArea();
// 		alert(this.battleArray +' \n '+ this.killBattleArray);	
		return this;
	}
	Plate.prototype.display = function() {
		alert(this.battleArray);
		return this;
	}
	Plate.prototype.addShip = function(hide) {
		
		var show = hide || 'visible';
  		this.changeBattleArray();
//   		alert(this.battleArray);
  		var element = new Ship({x: this.x, y: this.y, pos: this.shipPos, size: this.shipSize});
  		$(element).attr('class',($(element).attr('class'))+' '+show);
  		$(this.parent).children('svg').append(element);
  		var nam = ''+this.battleArray[this.y/30][this.x/30];
  		this.shipArray[nam] = element;
  		

  		return this;
	}
	Plate.prototype.changeBattleArray = function() {
		var ind = 0;
		if (this.shipSize === 3) {
// 			alert(this.threeLength)
			this.threeLength = this.threeLength -1;
			ind = this.threeLength;
		}
		if (this.shipSize === 2) {
			this.twoLength = this.twoLength -1;
			ind = this.twoLength;
		}
		if (this.shipSize === 1) {
			this.oneLength = this.oneLength -1;
			ind = this.oneLength;
		}
		for (var i = 0, j = this.shipSize; i < j; i += 1 ){
			 
			if (this.shipPos === 'h') {
				var x = this.x/30+i;
				var y = this.y/30;
				this.battleArray[y][x] = this.shipSize + ind/10;
// 				left - horizontal				
				if (i === 0) {
					if (y > 0) {
						this.battleArray[y-1][x] = -1; 
// 						this.addDot(x, y-1)
						if ((x-i) > 0) {
							this.battleArray[y-1][x-1] = -1;
// 							this.addDot(x-1, y-1)
						}
					}						
					if (y < 9) {
						this.battleArray[y+1][x] = -1;
// 						this.addDot(x, y+1)
						if ((x-i) > 0) {
							this.battleArray[y+1][x-1] = -1;
// 							this.addDot(x-1, y+1)
						}
					}
					if ((x-i) > 0) {
						this.battleArray[y][x-1] = -1;
// 						this.addDot(x-1, y)
					}
				} 
				 if (i === j-1) {
					if (y > 0) {
						this.battleArray[y-1][x] = -1; 
// 						this.addDot(x, y-1)
						if (x < 9) {
							this.battleArray[y-1][(x)+1] = -1;
// 							this.addDot(x+1, y-1)
						}
					}						
					if (y < 9) {
						this.battleArray[y+1][x] = -1;
// 						this.addDot(x, y+1)
						if (x < 9) {
							this.battleArray[y+1][ x+1 ] = -1;
// 							this.addDot(x+1, y+1)
						}
					}
					if (x < 9) {
						this.battleArray[y][x+1] = -1;
// 						this.addDot(x+1, y)
					}
				} 
				
				if (i > 0 && i < 9)
				 {
					if (y > 0) {
						this.battleArray[y-1][x] = -1; 
// 						this.addDot(x, y-1)
					}						
					if (y < 9) {
						this.battleArray[y+1][x] = -1;
// 						this.addDot(x, y+1)
					}
				}
				
			} else if (this.shipPos === 'v') {
				var x = this.x/30;
				var y = this.y/30+i;
				this.battleArray[y][x] = this.shipSize + ind/10;
				if (i === 0) {
					if (x > 0) {
						this.battleArray[y][x-1] = -1;
// 						this.addDot(x-1, y);
						if (y > 0) {
							this.battleArray[y-1][x-1] = -1;
// 							this.addDot(x-1, y-1);
						}
					}
					if (x < 9) {
						this.battleArray[y][x+1] = -1;
// 						this.addDot(x+1, y);
						if (y > 0) {
							this.battleArray[y-1][x+1] = -1;
// 							this.addDot(x+1, y-1);
						}
					}
					if (y > 0) {
						this.battleArray[y-1][x] = -1;
// 						this.addDot(x, y-1);
					}
				}
				if (i === j - 1) {
					if (x > 0) {
						this.battleArray[y][x-1] = -1;
// 						this.addDot(x-1, y);
						if (y < 9) {
							this.battleArray[y+1][x-1] = -1;
// 							this.addDot(x-1, y+1);
						}
					}
					if (x < 9) {
						this.battleArray[y][x+1] = -1;
// 						this.addDot(x+1, y);
						if (y < 9) {
							this.battleArray[y+1][x+1] = -1;
// 							this.addDot(x+1, y+1);
						}
					}
					if (y < 9) {
						this.battleArray[y+1][x] = -1;
// 						this.addDot(x, y+1);
					}
				}
				if (i > 0 && i < 9)
				 {
					if (x > 0) {
						this.battleArray[y][x-1] = -1; 
// 						this.addDot(x-1, y)
					}						
					if (x < 9) {
						this.battleArray[y][x+1] = -1;
// 						this.addDot(x+1, y)
					}
				}
				
			}
		}
	}
	Plate.prototype.createShipParametr = function(size) {
		var p = ['v','h'];
		
			function randomInteger(min, max) {
				var rand = min - 0.5 + Math.random() * (max - min + 1)
				rand = Math.round(rand);
				return rand;
	  		}
	  		
			this.shipSize = size;
			this.shipPos = p[randomInteger(0, 1)];
			
			if (this.shipPos === 'v'){
				this.x = randomInteger(0, 9)*30;
				this.y = randomInteger(0, (9 - size +1) )*30;
			} else if (this.shipPos === 'h') {
				this.x = randomInteger(0, (9 - size +1) )*30;
				this.y = randomInteger(0, 9)*30;
			}
		if (!this.checkToAdd()){
// 	Если позиция корабля нарушает правила расстановки то задаем новые парраметры для корабля
			this.createShipParametr(size);
		} 
			
	}
	Plate.prototype.checkToAdd = function(ship) {
		var bool = true;
		
		for (var i = 0, j = this.shipSize; i < j; i += 1) {
			
				if (this.shipPos === 'h') {
					var ar = this.battleArray[this.y/30][(this.x/30 + i)];
					
					if (ar !== 0) {
						bool = false;
					}
					 
				} else if (this.shipPos === 'v') {
					var ar = this.battleArray[this.y/30+i][this.x/30];
					
					if (ar != 0) {
						bool = false;
					} 
				}
		}
		return bool;
		
	}
	Plate.prototype.addDotsToDeadShip = function(ship) {
		for (var i = 0, j = ship.size; i < j; i += 1 ){
			 
			if (ship.pos === 'h') {
				var x = ship.x/30+i;
				var y = ship.y/30;
// 				this.battleArray[y][x] = this.shipSize + ind/10;
// 				left - horizontal				
				if (i === 0) {
					if (y > 0) {
						if (this.battleArray[y-1][x] != -1){
							this.battleArray[y-1][x] = -1; 
							this.addDot(x, y-1);
						}
						if ((x-i) > 0) {
							if (this.battleArray[y-1][x-1] != -1){
								this.battleArray[y-1][x-1] = -1;
								this.addDot(x-1, y-1);
							}
						}
					}						
					if (y < 9) {
						if (this.battleArray[y+1][x] != -1){
							this.battleArray[y+1][x] = -1;
							this.addDot(x, y+1);
						}
						if ((x-i) > 0) {
							if (this.battleArray[y+1][x-1] != -1){
								this.battleArray[y+1][x-1] = -1;
								this.addDot(x-1, y+1);
							}
						}
					}
					if ((x-i) > 0) {
						if (this.battleArray[y][x-1] != -1){
							this.battleArray[y][x-1] = -1;
							this.addDot(x-1, y);
						}
					}
				} 
				 if (i === j-1) {
					if (y > 0) {
						if (this.battleArray[y-1][x] != -1){	
							this.battleArray[y-1][x] = -1; 
							this.addDot(x, y-1)
						}
						if (x < 9) {
							if (this.battleArray[y-1][x+1] != -1){
								this.battleArray[y-1][x+1] = -1;
								this.addDot(x+1, y-1);
							}
						}
					}						
					if (y < 9) {
						if (this.battleArray[y+1][x] != -1){
							this.battleArray[y+1][x] = -1;
							this.addDot(x, y+1);
						}
						if (x < 9) {
							if (this.battleArray[y+1][x+1] != -1){
								this.battleArray[y+1][ x+1 ] = -1;
								this.addDot(x+1, y+1);
							}
						}
					}
					if (x < 9) {
						if (this.battleArray[y][x+1] != -1){						
							this.battleArray[y][x+1] = -1;
							this.addDot(x+1, y);
						}
					}
				} 
				
				if (i > 0 && i < 9) {
					if (y > 0) {
						if (this.battleArray[y-1][x] != -1){
							this.battleArray[y-1][x] = -1; 
							this.addDot(x, y-1);
						}
					}						
					if (y < 9) {
						if (this.battleArray[y+1][x] != -1){
							this.battleArray[y+1][x] = -1;
							this.addDot(x, y+1);
						}
					}
				}
				
			} else if (ship.pos === 'v') {
				var x = ship.x/30;
				var y = ship.y/30+i;
// 				this.battleArray[y][x] = this.shipSize + ind/10;
				if (i === 0) {
					if (x > 0) {
						if (this.battleArray[y][x-1] != -1){
							this.battleArray[y][x-1] = -1;
							this.addDot(x-1, y);
						}
						if (y > 0) {
							if (this.battleArray[y-1][x-1] != -1){
								this.battleArray[y-1][x-1] = -1;
								this.addDot(x-1, y-1);
							}
						}
					}
					if (x < 9) {
						if (this.battleArray[y][x+1] != -1){
							this.battleArray[y][x+1] = -1;
							this.addDot(x+1, y);
						}
						if (y > 0) {
							if (this.battleArray[y-1][x+1] != -1){
								this.battleArray[y-1][x+1] = -1;
								this.addDot(x+1, y-1);
							}
						}
					}
					if (y > 0) {
						if (this.battleArray[y-1][x] != -1){
							this.battleArray[y-1][x] = -1;
							this.addDot(x, y-1);
						}
					}
				}
				if (i === j - 1) {
					if (x > 0) {
						if (this.battleArray[y][x-1] != -1){
							this.battleArray[y][x-1] = -1;
							this.addDot(x-1, y);
						}
						if (y < 9) {
							if (this.battleArray[y+1][x-1] != -1){
								this.battleArray[y+1][x-1] = -1;
								this.addDot(x-1, y+1);
							}
						}
					}
					if (x < 9) {
						if (this.battleArray[y][x+1] != -1){
							this.battleArray[y][x+1] = -1;
							this.addDot(x+1, y);
						}
						if (y < 9) {
							if (this.battleArray[y+1][x+1] != -1){
								this.battleArray[y+1][x+1] = -1;
								this.addDot(x+1, y+1);
							}
						}
					}
					if (y < 9) {
						if (this.battleArray[y+1][x] != -1){
							this.battleArray[y+1][x] = -1;
							this.addDot(x, y+1);
						}
					}
				}
				if (i > 0 && i < 9)
				 {
					if (x > 0) {
						if (this.battleArray[y][x-1] != -1){
							this.battleArray[y][x-1] = -1; 
							this.addDot(x-1, y);
						}
							
					}						
					if (x < 9) {
						if (this.battleArray[y][x+1] != -1){
							this.battleArray[y][x+1] = -1;
							this.addDot(x+1, y);
						}
					}
				}
				
			}
		}
	}
	Plate.prototype.cpuTurn = function() {
		var ar = this.battleArray;
		var killArray = this.killBattleArray;
		var that = this;
		function randomInteger(min, max) {
				var rand = min - 0.5 + Math.random() * (max - min + 1);
				rand = Math.round(rand);
				return rand;
	  	}
	  	function go(min,max) {
		  	var resultatMin = min || 0;
		  	var resultatMax = max || 9;
		  	return randomInteger(resultatMin, resultatMax);
		} 
		function searchToKill() {
			if (!that.oldCoord){
				that.oldCoord = that.lastCoord;
			} 
			var xCoord = that.lastCoord.x;
			var yCoord = that.lastCoord.y;
			var oneStepTo = [
				{x: xCoord-1, y: yCoord},
				{x: xCoord+1, y: yCoord},
				{x: xCoord, y: yCoord-1},
				{x: xCoord, y: yCoord+1}
			]; 
			
			var num = go(0,3);
			var rnd = oneStepTo[num];
// 			console.log(that.cashKillPos);
			var old = ar[that.lastCoord.y][that.lastCoord.x];



// 			console.log('y='+rnd.y+'x='+rnd.x);
			if ( (rnd.x >= 0 && rnd.x <= 9) && (rnd.y >= 0 && rnd.y <= 9) ){
				
				
				var newTurn;

				if (num === 0){
					if (that.cashKillPos === 'v') {

						return searchToKill();
					}
					var ghostTurn;
					newTurn = ar[rnd.y][rnd.x];
					if (that.lastCoord.x === 9) {
						ghostTurn = undefined;
					} else {
						ghostTurn = ar[yCoord][xCoord+1];
					}

					if (newTurn === -1 && ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
						return searchToKill();
					}
					that.killPos = 'h';
				}
				if (num === 1){
					if (that.cashKillPos === 'v') {

						return searchToKill();
					}
					var ghostTurn;
					newTurn = ar[rnd.y][rnd.x];
					if (that.lastCoord.x === 0){
						ghostTurn = undefined;
					} else {
						ghostTurn = ar[yCoord][xCoord-1];
					}

					if (newTurn === -1 && ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
						return searchToKill();
					}
					that.killPos = 'h';
				}
				if (num === 2){
					if (that.cashKillPos === 'h') {

						return searchToKill();
					}
					var ghostTurn;

						newTurn = ar[rnd.y][rnd.x];

					
					if (that.lastCoord.y === 9){

						ghostTurn = undefined;
					} else {
						ghostTurn = ar[yCoord+1][xCoord];
					}

					if (newTurn === -1 && ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
						return searchToKill();
					}
					that.killPos = 'v';
				}
				if (num === 3){
					if (that.cashKillPos === 'h') {

						return searchToKill();
					}
					var ghostTurn;
					newTurn = ar[rnd.y][rnd.x];
					if (that.lastCoord.y === 0 || that.lastCoord.x === 0 ){
						ghostTurn = undefined;
					} else {
						ghostTurn = ar[yCoord-1][xCoord];
					}

					if (newTurn === -1 && ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
						return searchToKill();
					}
					that.killPos = 'v';
				}
			
			return rnd;
			
			
			} else {
				
				if (num === 0){
					
						ghostTurn = ar[yCoord][xCoord+1];

					if ( ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
					}
				}
				if (num === 1){
					ghostTurn = ar[yCoord][xCoord-1];

					if ( ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
					}
					}
				if (num === 2){
					ghostTurn = ar[yCoord+1][xCoord];

					if ( ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
					}
				}
				if (num === 3){
					ghostTurn = ar[yCoord-1][xCoord];

					if ( ghostTurn === old ) {
						that.lastCoord = that.oldCoord;
					}
				}
				
				return searchToKill();
			}
		}
	  	
	  	function nextTurnCPU() {
		  	var x = go();
		  	var y = go();
		  	if (that.search === true){
			  	 var rnd = searchToKill();
			  	 x = rnd.x;
			  	 y = rnd.y;
// 			  	 console.log('y='+rnd.y+'x='+rnd.x);
		  	}
// 		  	console.log('y='+y+'x='+x); 
		  	if (ar[y][x] >= 0) {
			  	
			  	if (ar[y][x] === 0) {
				  	ar[y][x] = -1;
				  	
			  	} else {
			  		for (key in killArray){
			  			if (killArray.hasOwnProperty(key)){
			  			    for(var i = 0, j = killArray[key].length; i < j; i += 1) {
				  			    if (killArray[key][i] > 0) {

					  			    if(key == y && i == x){
						  			    
					  			    	return nextTurnCPU();// Если компьютер ткнёт в крестик то задается ход по новой
					  			    }
				  			    }
			  			    }
			  			}
			  		};
			  		if(that.killPos){
				  		that.cashKillPos = that.killPos;
			  		};
			  		killArray[y][x] = 5; // Ранен
			  		that.lastCoord = {x: x, y: y};
			  	} 
			  	
			  	return {x: x, y: y}
		  	} else {
			  	return nextTurnCPU();
		  	}
	  	}
	  	var obj = nextTurnCPU();
	  	return obj;
		
	}
		
	function Rule() {
		this.numShips = {
			'4': 1,
			'3': 2,
			'2': 3,
			'1': 4
		}
		return this;
	}
	
	Rule.prototype.check = function(n){
		for (key in this.numShips){
			if (this.numShips.hasOwnProperty(key)){
			    if (n == key) {
				   return this.numShips[n]; 
			    }
			}
		};
		return 'Error';
	}
	
	function SVG(obj) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", obj.el);
		var content = obj.content;
		for (key in content){
			if (content.hasOwnProperty(key)){
				if (key === 'href'){
					svg.setAttributeNS('http://www.w3.org/1999/xlink', key, content[key]);
				} else {
			    	svg.setAttribute( key, content[key]);
			    }
			}
		}
		this.element = svg;
		return this.element;
	}
	function Text(obj) {
		var newText = document.createElementNS("http://www.w3.org/2000/svg","text");
		for (key in obj){
			if (obj.hasOwnProperty(key)){
			    if (key === 'content') {
				    var textNode = document.createTextNode(obj.content);
					newText.appendChild(textNode);
			    } else {
					newText.setAttributeNS(null,key,obj[key]);  
			    }
			}
		}
		
		return newText;
	}

 	function Ships() {
 	    
 	    this.quatro = 1;
	    this.trio = 2;
	    this.duo = 3;
	    this.uno = 4;
	    
 	    return this;
 	}
 	
 	Ships.prototype.addShip = function(num, size) {
	 	
	 	if (size === 4 && this.quatro !== 0) {
		 	this.quatro = this.quatro - 1;
		 	return true;
	 	} else if (size === 3 && this.trio !== 0) {
		 	this.trio = this.trio - 1;
		 	return true;
	 	} else if (size === 2 && this.duo !== 0) {
		 	this.duo = this.duo - 1;
		 	return true;
	 	} else if (size === 1 && this.uno !== 0) {
		 	this.uno = this.uno - 1;
		 	return true;
	 	} else {
		 	
		 	if (size === 4){
// 		 		alert('Четырёхпалубные закончились!');
		 		return false;
		 	} else if (size === 3) {
// 			 	alert('Трёхпалубные закончились!');
			 	return false;	
		 	} else if (size === 2) {
// 			 	alert('Двухпалубные закончились!');	
			 	return false;
		 	} else if (size === 1) {
// 			 	alert('Однопалубные закончились!');	
			 	return false;
		 	}
		 	
	 	}
 	}
 	Ships.prototype.display = function() {
	 	
	 	this.info = [ this.quatro, this.trio, this.duo,  this.uno];
	 	
 		return this.info; 	
 	}
 	
	function Ship(ship) {
		
		this.size = ship.size || 1;
		this.x = ship.x || 0;
		this.y = ship.y || 0;
		this.pos = ship.pos || 'v';

		var width = 30, height = 30;
		
		if (this.pos === 'v') {
			height = 30 * this.size;
		} else {
			width = 30 * this.size;
		}
		
		var element = new SVG({
			"el": "rect", 
			content: {
				'x': this.x,
				'y': this.y,
				'width': width,
				'height': height,
				'stroke-opacity': '1',
				'class': 'tShip',
				'fill': "rgba(233,233,233,0)",
				'stroke-width': "3",
				'stroke': "#000796",
				'transform': "scale(1)"
			}
		});
		
		return element;
			
	}
	
	function Table(parent) {
		
		this.parent = parent || '.table';
		this.timeToStart = 10;
		return this;		
	}
	
	Table.prototype.showButton = function() {
		$('.go').attr({'visibility':'visible','opacity':'1'});
	}
	Table.prototype.letsGo = function() {
		if ( this.timeToStart < 2 ) {
				this.showButton();
		} else {
			this.timeToStart = this.timeToStart - 1;
		};
	}
	Table.prototype.nextStep = function() {
		var alertMessage = ['\"Ваш ход\"','\"Ход противника\"'];
		var alertPos = [500,450];
		if (this.step === 0) {
			this.step = 1;
		} else {
			this.step = 0;
		}

		var alert = {
			step: alertMessage[this.step], 
			pos: alertPos[this.step]
		}
		return alert;
	}
	Table.prototype.finalyMessage = function(text) {
		this.finMes = text || '...?';
		$('.finalyMessage').text(this.finMes);
		return this;
	}
	Table.prototype.createFirstStep = function() {
/*
		function randomInteger(min, max) {
				var rand = min - 0.5 + Math.random() * (max - min + 1)
				rand = Math.round(rand);
				return rand;
	  		}
	  	this.step = randomInteger(0, 1);
*/		
		this.step = 1;  
		return this;
	} 
	Table.prototype.create = function() {
		var that = this;
		var parent = this.parent;
		var sizeTableHeight = parseInt($(parent).css('height'));
		var sizeTableWidth = parseInt($(parent).css('width'));
		
		var svg = new SVG({
			"el": "svg", 
			'content': {
				'height': sizeTableHeight, 
				'width': sizeTableWidth
			}
		});
		var svgBottom = new SVG({
			"el": "svg", 
			'content': {
				'height': sizeTableHeight, 
				'width': sizeTableWidth
			}
		});
		var svgBottomBottom = new SVG({
			'el': 'svg',
			'content': {
				'height': sizeTableHeight, 
				'width': sizeTableWidth
			}
		})
		var arowToGo = new SVG({
			'el':'path',
			'content':{
				d: 'M690 75 l20 0 l-10 -10 m10 10 l-10 10',
				'fill':'none',
				'stroke':'rgba(255,255,255,0.6)',
				'stroke-width':'2',
				'class': 'go ar',
				'opacity':'0',
				'visibility':'hidden'
			}
		})
		
		var goButton = new Text({
				x: 730, 
				y: 84, 
				'content': 'Начать бой',
				'class':'go te', 
				'font-family': 'sans-serif', 
				'opacity':'0',
				'visibility':'hidden',
				'fill':'rgba(255,255,255,1)',
				'font-size':'28px',
				'font-weight':'400',
			});
		var alertForNextStep = new Text({
			x: 400,
			y: 44,
			class: 'nextStep'
		});
		var message = new Text({
			x: 388,
			y: 94,
			class: 'nextStepMessage'
		});
		var finalMessage = new Text({
			x: 320,
			y: 74,
			class: 'finalyMessage'
		})
		$(svgBottomBottom).append(finalMessage);

		$(svgBottom).append(alertForNextStep);
		$(svgBottom).append(message);
		$(svg).append(arowToGo);
		$(svg).append(goButton);
		

			 
		var g = new SVG({
			"el": "g",
			content:{
				'stroke': "white"
			}
		});
		var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		var scale = 12
		var x = new SVG({
			"el": "path", 
			content: {	
					'id': 'x',
					'stroke-opacity': '1',
					'fill': "none",
					'stroke-width': "2",
					'transform': "scale(1)",
					'd': 'M0 0 L'+scale+' '+scale+' Z M0 '+scale+' L'+scale+' 0 Z'
			}
		});
			
		$(defs).append(x);
		$(g).append(defs);
		
// 		Параметры СТОЛА
		var yShip = 15, xShip = 80, content = 1, xx = 126, sizeShip = 4, xText = 148, move = 164; 
		
		for (var i = 0, l = 4; i < l; i += 1){
			$(g).append(new Ship({x: xShip, y: yShip, size: sizeShip}));
			$(g).append(new SVG({
				'el':'use', 
				'content': { 
					'href':'#x', 
					'x': xx, 
					'y':'70' 
				} 
			}) );
			$(g).append(new Text({
				x: xText, 
				y: 86, 
				'content': new Rule().check(l-i),
				'class':'text t'+(l-i), 
				'font-family': 'monospace', 
				'stroke':'none',
				'fill':'rgba(255,255,255,0.8)',
				'font-size':'36px',
				'font-weight':'100'}) 
			);
			yShip += 15;
			xShip += move;
			xx += move;
			xText += move;
			content += 1;
			sizeShip -= 1;
		}
		$(svg).append(g);
		$(parent).append(svg);
		$(parent).append(svgBottom);
		$(parent).append(svgBottomBottom);
		
		return this;
	}
	Table.prototype.display = function(ships) {
		for (var i = 0, j = $('.text').length; i < j; i += 1) {
			$('.text').eq(i).text(ships[i]);
		}
	}
	Table.prototype.onTouchAnimyTable = function(af) {
		this.afirm;
		af === 'on'? this.afirm = true: this.afirm = false;
	}
	
	function Grid(parent,klass) {
		
		var xSizeGrid = parseInt($(parent).css('width'));
		
		var newObj =  new SVG({
			'el':"svg",
			'content': {
				'class': klass,
				'width': xSizeGrid, 
				'height': xSizeGrid
			}
		});
		var grid = new SVG({
			'el':"g",
			'content': {
				'stroke-opacity': '1', 
				'fill': "none", 
				'stroke-width': "0.5", 
				'stroke': "#afaffb", 
				'transform': "scale(1)"
			}
		});
		
		
		var stringX = '', stringY = '';
		for (var i = xSizeGrid/10, l =  xSizeGrid; i < l; i += (l/10) ) {
			stringX = stringX + 'M'+i+ ' 0 L'+i+' '+l+' Z ';
			stringY = stringY + 'M0 '+i+ ' L' +l+' '+i+' Z ';
		}
		
		var xGrid = new SVG({"el": "path",'content': {'class':'xGrey', 'd': stringX}});
		var yGrid = new SVG({"el": "path",'content':{'class':'yGrey', 'd': stringY}});
		
		
		$(grid).append(xGrid);
		$(grid).append(yGrid);
		$(newObj).append(grid);
		
		return newObj;	
	}

	function GameSB() {
		
		var rule = new Rule();
	
		var myPlateGrid = new Grid('.myPlate','my');
		var animyPlateGrid = new Grid('.animyPlate','animy');
		$('.myPlate').append(myPlateGrid);
		$('.animyPlate').append(animyPlateGrid);
		
		var myPlate = new Plate('.myPlate').create(); 
		$('.myPlate').addClass('showPlate');
		var table = new Table().create();
		var myShips = new Ships();
		
		var animyPlate = new Plate('.animyPlate').create();
		var animyShips = new Ships();
		
		$('.text').prev().prev().click(function(e){
			
			var ev = $(e.target).next().next();
			var size = parseInt(ev.attr('class').substring(ev.attr('class').length-1))
			
			if(myShips.addShip(1, size)) {
				myPlate.createShipParametr(size);
				myPlate.addShip();
				table.letsGo();
			}
			
			table.display(myShips.display());
			
			if(animyShips.addShip(1, size)) {
				animyPlate.createShipParametr(size);
				animyPlate.addShip('hide');
			}

		});
		
// 		Костыль 
// 		START BUTTON
// **************************

		$('.go').click(function(){
			
			$('.nextStep').text(table.createFirstStep().nextStep().step);
			table.onTouchAnimyTable('on');
			myPlate.clearDots();
			animyPlate.clearDots();
			$('.animyPlate').addClass('showPlate');
			$('.myPlate').removeClass('showPlate');

			$('.table').children('svg').eq(0).animate({opacity: 0, marginTop: '-200px'}, 500, function() {
				$(this).css('visibility','hidden');
			});
		});
		
	// 	Костыли
		var c = 0;
		
		$('h1').click(function(){
			if (c === 0) {
			$('.hide').attr('class','visible');
			c += 1;
			} else {
				$('.visible').attr('class','hide');
				c=0;
			}
		});

	// Клик по полю противника
			
		$('.animy').click(function(e){
			
				// разрешение на вывод результатов только когда нажата кнопка
				if(table.afirm){ 
// 					Положение мыши в системе игры 10/10
					var xClick = parseInt((e.pageX - $(this).offset().left)/30); 
					var yClick = parseInt((e.pageY - $(this).offset().top)/30);
// 					alert(xClick+':'+ yClick)
					var ab = "АБВГДЕЖЗИК"
					var nu = [1,2,3,4,5,6,7,8,9,10];
					var res = ['Мимо','Ранен','Убит'];
					if (animyPlate.canRun(xClick, yClick)) {
					// Вывод результата
					var resul = ab[xClick]+':'+ nu[yClick] + ' - ';
					var fromArray = animyPlate.battleArray[yClick][xClick];
					var kill;
						if (fromArray > 0) {
							if ( fromArray === 4 ) {
								kill = animyPlate.checkToKill(fromArray);
// 								Если убит показываем корабль
								if (kill === 2) {
									var arSh = $(animyPlate.shipArray[fromArray]);
									arSh.attr('class','tship visible');
									var shipX = arSh.attr('x');
									var shipY = arSh.attr('y');
									var shipPos = 'h'; 
									var shipSize = 4;
									
									if (arSh.attr('width')>arSh.attr('height')) {
										shipPos = 'v';
									} 
									var shipObj = {pos: shipPos, size: shipSize, x: shipX, y:  shipY};
									animyPlate.addDotsToDeadShip(shipObj);
								}
								resul = resul + res[kill];	
							} else {
								kill = animyPlate.checkToKill(fromArray);
// 								Если убит показываем корабль
								if (kill === 2) {
									var arSh = $(animyPlate.shipArray[fromArray]);
									arSh.attr('class','tship visible');
									var shipX = arSh.attr('x');
									var shipY = arSh.attr('y');
									var shipPos = 'h'; 
									var shipSize;
// 									animyPlate.size = Math.abs(arSh.attr('width') / arSh.attr('height'));
									if (arSh.attr('width')>arSh.attr('height')) {
										shipSize = arSh.attr('width')/30
									} else {
										shipPos = 'v';
										shipSize = arSh.attr('height')/30
									}
									var shipObj = {pos: shipPos, size: shipSize, x: shipX, y:  shipY};
									animyPlate.addDotsToDeadShip(shipObj);
								}
								resul = resul + res[kill];
							}
						} else {
							resul = resul + res[0];
						}
					
					$('.nextStepMessage').text(resul).attr('class','nextStepMessage showMess');

						var gotIt = true;
						
						if (animyPlate.battleArray[yClick][xClick] <= 0) {
							
							animyPlate.addDot(xClick, yClick, 'visible');
						} else {
							
							gotIt = false;
							animyPlate.addCrest(xClick, yClick, 'visible'); 
						}
						
						if (!animyPlate.checkToEnd()) { 
							
							table.onTouchAnimyTable('off');
							table.finalyMessage('\"Вы победили!\"');
							
							$('.table').children('svg').eq(1).animate({opacity: 0, marginTop: '-200px'}, 500, function() { 
								
								$(this).css('visibility','hidden');
								$('.finalyMessage').attr('class','finalyMessage flash');
								$('.animyPlate').addClass('showPlate');	
								$('.myPlate').removeClass('showPlate');	
							});	
						} else {
							
							if (gotIt){
								table.afirm = false;
								function goCPU() {
									var timMy = setTimeout( function() {
	
									$('.nextStep').attr('x',350).attr('class','nextStep').text(table.nextStep().step);
									$('.nextStepMessage').attr('class','nextStepMessage  showMess hideMess');
									
									$('.animyPlate').removeClass('showPlate');
									$('.myPlate').addClass( 'showPlate' );
									
									var kill;
									var myBattleArray = myPlate.battleArray;
									var myKillBattleArray = myPlate.killBattleArray;
									
									var resul = '';
									var turn = myPlate.cpuTurn();
// 									console.log(turn.y+'-'+turn.x+' / '+ myPlate.cashKillPos);
									
										turn.now = myBattleArray[turn.y][turn.x];
										turn.killNow = myKillBattleArray[turn.y][turn.x];
// 										console.log(turn.now.toFixed(0));
										
									if (turn.now === -1) {
										
											myPlate.addDot(turn.x, turn.y,'visible' );
											resul = ab[turn.x]+':'+ nu[turn.y] + ' - ';
											resul = resul + res[0];
											
									} else {
											
										if (turn.now === 4) {
												
												kill = myPlate.checkToKill(turn.now);
												myPlate.search = true;
												myPlate.addCrest(turn.x, turn.y, 'visible'); 
												
												if (kill === 2) {
													
													var arSh = $(myPlate.shipArray[turn.now]);
													arSh.attr('class','tship visible');
													var shipX = arSh.attr('x');
													var shipY = arSh.attr('y');
													var shipPos = 'h'; 
													var shipSize = 4;
												
													if (arSh.attr('width')>arSh.attr('height')) {
														shipPos = 'v';
													}	
													var shipObj = {pos: shipPos, size: shipSize, x: shipX, y:  shipY};
													myPlate.addDotsToDeadShip(shipObj);
													myPlate.search = false;
													myPlate.oldCoord = undefined;
													myPlate.killPos = undefined;
													myPlate.cashKillPos = undefined;
												}
												resul = ab[turn.x]+':'+ nu[turn.y] + ' - ';
												resul = resul + res[kill];
												
											} 
										else if (turn.now.toFixed(0) == 1 || turn.now.toFixed(0) == 3 || turn.now.toFixed(0) == 2) { 
												kill = myPlate.checkToKill(turn.now);
// 												console.log(myPlate.oldCoord)
												myPlate.search = true;
												myPlate.addCrest(turn.x, turn.y, 'visible'); 
// 												console.log(kill +'-'+ turn.now);
												if (kill === 2) {
													var arSh = $(myPlate.shipArray[turn.now]);
													arSh.attr('class','tship visible');
													var shipX = arSh.attr('x');
													var shipY = arSh.attr('y');
													var shipPos = 'h'; 
													var shipSize;
				
													if (arSh.attr('width')>arSh.attr('height')) {
														
														shipSize = arSh.attr('width')/30
														
													} else {
														
														shipPos = 'v';
														shipSize = arSh.attr('height')/30
													}
													
													var shipObj = {pos: shipPos, size: shipSize, x: shipX, y:  shipY};
													myPlate.addDotsToDeadShip(shipObj);
													myPlate.search = false;
													myPlate.oldCoord = undefined;
													myPlate.killPos = undefined;
													myPlate.cashKillPos = undefined;
												}
												resul = ab[turn.x]+':'+ nu[turn.y] + ' - ';
												resul = resul + res[kill];
											}

										gotIt = false;	
										goCPU()	
									}
									if (!myPlate.checkToEnd()) { 
										table.onTouchAnimyTable('off');
										table.finalyMessage('\"Вы проиграли!\"');
										$('.table').children('svg').eq(1).animate({opacity: 0, marginTop: '-200px'}, 500, function() { 
												
											$(this).css('visibility','hidden');
											$('.finalyMessage').attr('class','finalyMessage flash');
											$('.myPlate').addClass('showPlate');
											setTimeout( function() {
											$('.hide').attr('class','visible');
											}, 1000);
												
										});	
									} else {
								
									var tim = setTimeout(function(){
	// 									alert('ход противника');
	
										$('.nextStep').attr('x',400).attr('class','nextStep').text(table.nextStep().step);
										table.afirm = true;
										$('.myPlate').removeClass('showPlate');
									$('.animyPlate').addClass( 'showPlate' );
									
									}, 100);
									}
								},100);	
	 
								};
								
							goCPU();	
							} ;
						};
						
					} else {
						
						alert( 'Вы так уже ходили' );
					}
				}
				
			});
	
	}
	var seaBattle = new GameSB();
});

	