import React from "react";
import "./App.css";


const initialFood = () => {
  var xx = Math.floor(Math.random() * 29);
  var yy = Math.floor(Math.random() * 29);
  while(xx === 2 || yy === 2 || yy === 3 || yy === 4) {
    xx = Math.floor(Math.random() * 29);
    yy = Math.floor(Math.random() * 29);  
  }
  return { x: xx, y: yy }
}

const initialState = {
  snakeBody: [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }],
  isRunning: false,
  level: 1,
  streak: 0,
  foodBody: initialFood()
};
class App extends React.Component {
  constructor() {
    super();
    this.state = {...initialState};
    this.direction = 1;
    this.directionChanged = false;
    this.timer = null;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.changeDirection);
  }

  move = () => {
    var initialSnakeBody = JSON.parse(JSON.stringify(this.state.snakeBody));
    const head = JSON.parse(JSON.stringify(initialSnakeBody[initialSnakeBody.length - 1]));
    this.advance(head);
    this.dontLeave(head);
    
    if (this.getCellType(head.x, head.y) === "foodBody") {
      this.generateFood();
      this.processLevel();
    } else {
      initialSnakeBody.splice(0, 1);
    }
    
    if (this.getCellType(head.x, head.y, initialSnakeBody) === "snakeBody") {
      this.endGame();
      return;
    }
    this.directionChanged = false;
    this.setState({snakeBody: [...initialSnakeBody, head]})
  };

  processLevel = () => {
    let level = this.state.level;
    let streak = this.state.streak;
    if (streak < 4 && level < 10) streak++;
    else if (level < 10) {
      streak = 0;
      level++;
      clearInterval(this.timer);
      this.timer = setInterval(this.move, (11 - level) * 30);
    }
    this.setState({level, streak})
  };

  advance = head => {
    if (this.state.isRunning) {
      this.direction === 1
        ? head.y++
        : this.direction === 2
        ? head.x++
        : this.direction === 3
        ? head.y--
        : head.x--;
    }
  };

  dontLeave = head => {
    if (head.y > 29) head.y = 0;
    else if (head.y < 0) head.y = 29;
    else if (head.x > 29) head.x = 0;
    else if (head.x < 0) head.x = 29;
  };

  changeDirection = e => {
    if (e.repeat || this.directionChanged) return;
    var initialDirection = this.direction;
    if ((e.key === "w" || e.key === "ArrowUp") && this.direction !== 2) this.direction = 0;
      else if ((e.key === "d" || e.key === "ArrowRight") && this.direction !== 3) this.direction = 1;
      else if ((e.key === "s" || e.key === "ArrowDown") && this.direction !== 0) this.direction = 2;
      else if ((e.key === "a" || e.key === "ArrowLeft") && this.direction !== 1) this.direction = 3;
    if(this.direction !== initialDirection) this.directionChanged = true;
  };

  generateFood = () => {
    var xx = Math.floor(Math.random() * 30);
    var yy = Math.floor(Math.random() * 30);
    while (this.getCellType(xx, yy) === "snakeBody") {
      xx = Math.floor(Math.random() * 30);
      yy = Math.floor(Math.random() * 30);  
    }
    this.setState({foodBody: { x: xx, y: yy }})
  };

  getCellType = (x, y, snakeBody = this.state.snakeBody) => {
     var isSnakeCell = snakeBody.some(cell => {
       return cell.x === x && cell.y === y
     }
    ) 
    if(isSnakeCell){
      return "snakeBody"
    } else if(this.state.foodBody.x === x && this.state.foodBody.y === y){
      return "foodBody"
    }
      else {
        return "cell"
      }
  }

  startGame = () => {
    if (this.state.isRunning) clearInterval(this.timer);
    else this.timer = setInterval(this.move, (11 - this.state.level) * 30);
    this.setState(prev => {
      return { isRunning: !prev.isRunning };
    });
  };

  restart = () => {
    this.setState({
      ...initialState,
      isRunning: true,
      foodBody: initialFood()
    });
    this.direction = 1;
    this.directionChanged = false;
    clearInterval(this.timer);
    this.timer = setInterval(this.move, (11 - initialState.level) * 30);
    document.getElementById("lostMessage").style.display = "none";
  };

  endGame = () => {
    this.setState({ isRunning: false });
    document.getElementById("lostMessage").style.display = "block";
    clearInterval(this.timer)
  };

  snakeField = Array(30).fill(Array(30).fill(null));

  render() {

    return (
      <>
        <div id="info">
          <span>
            Level: {this.state.level < 10 ? this.state.level : "Max (10)"}
          </span>{" "}
          <span>Current streak: {this.state.streak}</span>
          <button id="startButton" onClick={() => this.startGame()}>
            {this.state.isRunning ? "Pause" : "Start"}
          </button>
        </div>
        <div id="lostMessage">
          You lost. Click restart to play again!
          <button onClick={() => this.restart()}>Restart</button>
        </div>
        <div className="field">
          {this.snakeField.map((linie, indexX) => {
            return(
              <div className="linie">
              {linie.map((coloana, indexY) => {
                return(
                  <div className={this.getCellType(indexX, indexY)}>
                    
                  </div>
                );
              })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default App;
