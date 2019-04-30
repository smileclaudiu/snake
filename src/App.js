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
  direction: 1,
  isRunning: false,
  level: 1,
  streak: 0,
  foodBody: initialFood()
};
class App extends React.Component {
  constructor() {
    super();
    this.state = {...initialState};
  }

  componentDidMount() {
    document.addEventListener("keydown", this.changeDirection);
  }

  move = () => {
    let snakeBody = [...this.state.snakeBody];
    const head = { ...snakeBody[snakeBody.length - 1] };
    this.advance(head);
    this.dontLeave(head);
    if (this.getCellType(head.x, head.y) === "snakeBody") {
      this.endGame();
      return;
    } else snakeBody = [...snakeBody, head];

    if (this.getCellType(head.x, head.y) === "foodBody") {
      this.generateFood();
      const [level, streak] = this.processLevel();
      this.setState({ snakeBody, level, streak });
    } else {
      snakeBody.splice(0, 1);
      this.setState({ snakeBody });
    }
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
    return [level, streak];
  };

  advance = head => {
    if (this.state.isRunning) {
      this.state.direction === 1
        ? head.y++
        : this.state.direction === 2
        ? head.x++
        : this.state.direction === 3
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
    if (e.repeat) return;
    if ((e.key === "w" || e.key === "ArrowUp") && this.state.direction !== 2) {
      this.setState({ direction: 0 });
    } else if (
      (e.key === "d" || e.key === "ArrowRight") &&
      this.state.direction !== 3
    ) {
      this.setState({ direction: 1 });
    } else if (
      (e.key === "s" || e.key === "ArrowDown") &&
      this.state.direction !== 0
    ) {
      this.setState({ direction: 2 });
    } else if (
      (e.key === "a" || e.key === "ArrowLeft") &&
      this.state.direction !== 1
    ) {
      this.setState({ direction: 3 });
    }
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

  getCellType = (x, y) => {
     var isSnakeCell = this.state.snakeBody.some(cell => {
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
    this.setState(prev => {
      return { isRunning: !prev.isRunning };
    });
    if (this.state.isRunning) clearInterval(this.timer);
    else this.timer = setInterval(this.move, (11 - this.state.level) * 30);
  };

  restart = () => {
    this.setState({
      ...initialState,
      isRunning: true,
      foodBody: initialFood()
    });
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
