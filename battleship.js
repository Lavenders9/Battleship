var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) { //location是根据行号和例号生成的，它是一个<td>元素的id
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");//class的特性设置为hit，显示战舰图像
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");//class的特性设置为miss，显示Miss图像
  }
};
// var ship1 = {
//   location:["10","20","30"],//这个对象包含属性location（是一个数组） & hits(也是)
//   hits:["","",""]
// };
// var ship1 = { locations:["10","20","30"],hits:["","",""]};//指出战舰的位置以及被击中的部位
// var ship2 = { locations:["32","33","34"],hits:["","",""]};
// var ship3 = { locations:["63","64","65"],hits:["","","hit"]};
// //储存的全部三艘战舰
// var ships = [{locations:["10","20","30"],hits:["","",""]},
//              {locations:["32","33","34"],hits:["","",""]},
//              {locations:["63","64","65"],hits:["","","hit"]}];
//             //  boardSize:游戏板网格的大小
//             //  numShips:游戏包含的战舰数
//             //  ships:战舰所处的位置及被击中的部位
//             //  shipSunk:多少战舰被击沉
//             //  shipLength:每艘战舰占据多少单元格
var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: [0, 0,0], hits: ["", "", ""] },
    { locations: [0, 0,0], hits: ["", "", ""] },
    { locations: [0, 0,0], hits: ["", "", ""] }],

  fire: function (guess) {
    for (var i = 0; i<this.numShips; i++) {//选数组ships，每次检查一艘战舰/遍历每艘战舰
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);//在数组中查找指定值，找到就返回相应的索引，否则返回-1
      if (index >= 0) {//如果返回的索引大于或等于零，就意味着玩家猜测的值包含在数组location中，因此击中
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {//确定战舰被击中后，执行这个检查，如果击沉，则战舰数（存储在model对象属性shipSunk中）加1
          view.displayMessage("You sank my battleship!");//让玩家知道击沉了战舰
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);//告诉视图，没击中
    view.displayMessage("You missed.")
    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },


  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
 
    if (direction ===1) {
      row = Math.floor(Math.random()* this.boardSize);
      col = Math.floor(Math.random()*(this.boardSize - this.shipLength));
    }else {
      row = Math.floor(Math.random()*(this.boardSize - this.shipLength));
      col = Math.floor(Math.random()* this.boardSize);
    }
     
    var newShipLocations = [];
    for (var i = 0 ; i<this.shipLength; i++) {
      if (direction === 1){
        newShipLocations.push(row + ""+(col+i));//用于生成水平的战舰
      }else {
        newShipLocations.push((row + i)+""+col);//用于生成竖直的战舰
      }
    }
    return newShipLocations;//返回给这个数组
  },

  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j=0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("Oops,please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {//使用函数isNaN检查row和column是否都是数字
      alert("Oops,that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize ||
      column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;//至此都有效所以返回他们
    }
  }
  return null;//如果执行到了这里 说明检查是失败的，因此返回null
}
var controller = {
  guesses: 0,

  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships,in " +
          this.guesses + "guesses");
      }
    }
  }
};
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}
function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
window.onload = init;