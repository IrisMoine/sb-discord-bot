const { ipcRenderer } = require("electron");
const robot = require("robotjs");

// let mouse = robot.getMousePos();
// console.log(mouse.x);
// console.log(mouse.y);

let delay = async function (millis = 0) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, millis);
  });
};

let setColor = function (
  r = Math.random() * 255,
  g = Math.random() * 255,
  b = Math.random() * 255
) {
  return `rgb(${r}, ${g}, ${b})`;
};

let lerp = function (start, stop, amt) {
  return amt * (stop - start) + start;
};

let dist = function (x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
};

class AppRobot {
  constructor() {
    console.log("LOG depuis page html");
    this.initListeners();

    for (let i = 0; i < 3000; i++) {
      //   const button = document.createElement("button");
      //   button.textContent = ".";
      //   document.body.appendChild(button);
      const circle = document.createElement("div");
      // circle.textContent = ".";
      circle.className = "circle";
      document.body.appendChild(circle);
      circle.addEventListener("mouseenter", () => {
        if (circle.classList.contains("hide")) {
          circle.classList.remove("hide");
          circle.classList.add("violet");
          circle.textContent = this.chartodraw;
          // circle.classList.add("chartToDraw");
        } else {
          circle.classList.add("hide"); //hide, remove, toggle
        }
      });
    }

    const screenSize = robot.getScreenSize();
    this.height = screenSize.height;
    this.width = screenSize.width;
    this.targetPos = robot.getMousePos();
    console.log("getMousePos");
    this.currentPos = { x: 0, y: 0 };
    this.currentPos.x = this.targetPos.x;
    this.currentPos.y = this.targetPos.y;
  }

  initListeners() {
    ipcRenderer.on("messageDiscord", this.onMessage.bind(this));

    // écouter la souris :
    document.addEventListener("mousemove", (e) => {
      console.log(`Mouse X : ${e.x}, Mouse Y : ${e.y}`);
    });
  }

  updateMovements(resolve, speed) {
    // const currentPos = robot.getMousePos();

    const d = dist(
      this.currentPos.x,
      this.currentPos.y,
      this.targetPos.x,
      this.targetPos.y
    );

    if (d >= 2) {
      let x = (this.currentPos.x = lerp(
        this.currentPos.x,
        this.targetPos.x,
        speed
      ));
      let y = (this.currentPos.y = lerp(
        this.currentPos.y,
        this.targetPos.y,
        speed
      ));

      robot.moveMouse(x, y);
      console.log();
      requestAnimationFrame(() => this.updateMovements(resolve, speed));
    } else {
      robot.moveMouse(this.targetPos.x, this.targetPos.y);
      this.currentPos.x = this.targetPos.x;
      this.currentPos.y = this.targetPos.y;
      resolve();
    }

    // robot.screenCapture(0, 0, this.width, this.height);
  }

  async playMovements() {
    await this.moveTo(900, 80, 0.5);
    await delay(20);
    await this.moveTo(500, 400, 0.05);
    await this.moveTo(500, 300);
    await this.moveTo(900, 300);
    await this.moveTo(900, 700);
    await this.moveTo(700, 700);
    await this.moveTo(500, 700);
    await this.moveTo(500, 800);
    await this.moveTo(300, 800);
    await this.moveTo(300, 600);
    await this.moveTo(400, 600);
    await this.moveTo(400, 300);
    await this.moveTo(300, 300);
    await this.moveTo(300, 800);
    await this.moveTo(1000, 800);
    await this.moveTo(1000, 200);
    await this.moveTo(1300, 200);
    await this.moveTo(1300, 400);
    await this.moveTo(1300, 400);
    await this.moveTo(1300, 50);
    await this.moveTo(10, 50);
    await this.moveTo(10, 100);
    await this.moveTo(10, 1000);
    console.log("movement finished");
  }

  async playDrawing2() {
    await this.moveTo(630, 660, 0.05);
    await delay(20);
    await this.moveTo(630, 590);
    await this.moveTo(730, 590);
    await this.moveTo(730, 700);
    await this.moveTo(560, 700);
    await this.moveTo(560, 500);
    await this.moveTo(900, 500);
    await this.moveTo(900, 860);
    await this.moveTo(400, 860);
    await this.moveTo(400, 400);
    await this.moveTo(1000, 400);
    await this.moveTo(1000, 200);
    await this.moveTo(1200, 200);
    await this.moveTo(1200, 500);
    await this.moveTo(1100, 500);
    await this.moveTo(1100, 300);
    await this.moveTo(1060, 300);
    await this.moveTo(1060, 400);
    await this.moveTo(1060, 700);
    await this.moveTo(990, 700);
    await this.moveTo(990, 890);
    await this.moveTo(100, 890);
    await this.moveTo(100, 400);
    await this.moveTo(300, 400);
    await this.moveTo(100, 60);
    await this.moveTo(200, 500);

    console.log("Drawing2 finished");
  }

  async takeScreenshotOfWindow() {
    await this.moveTo(this.width / 2, this.height / 2, 0.5);
    console.log("hey");
    robot.setKeyboardDelay(50);
    robot.keyTap(4, ["shift", "command"]);
    // await delay(200);
    robot.keyTap("space");
    await delay(500);
    robot.mouseClick();
    // await this.robot.screenCapture();
    // console.log("movement for pic finished");
  }

  // backgroundImage() {
  //   // document.body.add.classList("image");
  // }

  turnCircles(angle) {
    let bodyStyle = document.body.style;
    let currAngle = parseInt(bodyStyle.getPropertyValue("--angle")) || 0;
    bodyStyle.setProperty("--angle", currAngle + angle + "deg");
  }

  scaleCircles() {
    const touslesviolets = document.getElementsByClassName("violet");
    Array.from(touslesviolets).forEach((item, index) => {
      item.classList.add("scale");
    });
  }

  changeColor(r, g, b) {
    const touslesgrands = document.getElementsByClassName("scale");
    Array.from(touslesgrands).forEach((item, index) => {
      item.classList.add("color");
      document.body.style.setProperty("--color", setColor(r, g, b));
    });
  }

  moveTo(x, y, speed = 0.05) {
    return new Promise((resolve) => {
      this.targetPos.x = x;
      this.targetPos.y = y;
      this.updateMovements(resolve, speed);
    });
  }

  draw() {
    //while (counter < 2) {
    this.angle += 0.05;
    const x = this.width / 3 + Math.cos(this.angle) * this.radius;
    const y = this.height / 2 + Math.sin(this.angle) * this.radius;
    robot.moveMouse(x, y);
    if (this.angle < Math.PI * 2) {
      requestAnimationFrame(this.draw.bind(this));
    }
    //}
  }

  moveCursorToRight() {
    // console.log("moveCursorToRight");
    if (this.counter < this.goal) {
      const position = robot.getMousePos();
      // ici vitesse de déplacement
      const p = position.x + 2;
      robot.moveMouse(p, position.y);
      this.counter++;
      requestAnimationFrame(this.moveCursorToRight.bind(this));
    }
  }

  moveCursorToLeft() {
    // console.log("moveCursorToLeft");
    if (this.counter < this.goal) {
      const position = robot.getMousePos();
      // ici vitesse de déplacement
      const p = position.x - 2;
      robot.moveMouse(p, position.y);
      this.counter++;
      requestAnimationFrame(this.moveCursorToLeft.bind(this));
    }
  }

  specialMOVETO(x, y, vitesseX = 1, vitesseY = 1) {
    const position = robot.getMousePos();
    let newX = position.x;
    let newY = position.y;
    if ((vitesseX >= 0 && position.x < x) || (vitesseX < 0 && position.x > x)) {
      newX = position.x + vitesseX;
    }
    if ((vitesseY >= 0 && position.y < y) || (vitesseY < 0 && position.y > y)) {
      newY = position.y + vitesseY;
    }
    robot.moveMouse(newX, newY);

    if (newX >= x && newY >= y) {
    } else {
      requestAnimationFrame(() => {
        this.specialMOVETO(x, y, vitesseX, vitesseY).bind(this);
      });
    }
  }

  moveCursorToUp() {
    console.log("moveCursorToUp");
    if (this.counter < this.goal) {
      const position = robot.getMousePos();
      // ici vitesse de déplacement
      const p = position.y - 2;
      robot.moveMouse(position.x, p);
      this.counter++;
      requestAnimationFrame(this.moveCursorToUp.bind(this));
    }
  }

  moveCursorToDown() {
    console.log("moveCursorToDown");
    if (this.counter < this.goal) {
      const position = robot.getMousePos();
      // ici vitesse de déplacement
      const p = position.y + 2;
      robot.moveMouse(position.x, p);
      this.counter++;
      requestAnimationFrame(this.moveCursorToDown.bind(this));
    }
  }

  onMessage(event, message) {
    if (message === "round") {
      // robot.setMouseDelay(4);
      this.radius = this.height / 3 - 10;
      this.angle = 0;
      this.draw();
    }

    if (message.includes("play1")) {
      const tableau = message.split(" ");
      this.chartodraw = tableau[1];
      this.playMovements();
    }

    if (message === "pic") {
      this.takeScreenshotOfWindow();
    }

    // if (message === "up") {
    //   this.playMovementsOnArrowUp();
    // }

    if (message === "turn") {
      this.turnCircles(45);
    }

    if (message === "new") {
      const urls = [
        'url("backgrounds/plante.png")',
        'url("backgrounds/arabe.png")',
        'url("backgrounds/spirales.png")',
        'url("backgrounds/vois-rien.png")',
      ];
      const bodyStyle = document.body.style;
      const currImage = bodyStyle.backgroundImage || urls[0];
      const currIndex = urls.indexOf(currImage);
      const nextIndex = (currIndex + 1) % urls.length;
      bodyStyle.backgroundImage = urls[nextIndex];
    }

    if (message === "play2") {
      this.playDrawing2();
    }

    if (message.includes("right")) {
      const tableau = message.split(" ");
      console.log(tableau);
      this.counter = 0;
      this.goal = parseInt(tableau[1]);
      this.moveCursorToRight();
    }

    if (message.includes("left")) {
      const tableau = message.split(" ");
      console.log(tableau);
      this.counter = 0;
      this.goal = parseInt(tableau[1]);
      this.moveCursorToLeft();
    }

    if (message.includes("up")) {
      const tableau = message.split(" ");
      console.log(tableau);
      this.counter = 0;
      this.goal = parseInt(tableau[1]);
      this.moveCursorToUp();
    }

    if (message.includes("down")) {
      const tableau = message.split(" ");
      console.log(tableau);
      this.counter = 0;
      this.goal = parseInt(tableau[1]);
      this.moveCursorToDown();
    }

    // if (message === "changeColor") {
    //   this.changeColor();
    // }

    if (message === "scale") {
      this.scaleCircles();
    }

    if (message === "color") {
      this.changeColor();
    }

    if (message === "red") {
      this.changeColor(255, 0, 64);
    }

    if (message === "yellow") {
      this.changeColor(255, 255, 102);
    }

    if (message === "grey") {
      this.changeColor(123, 123, 124);
    }

    if (message.includes("xy")) {
      const tableau = message.split(" ");
      this.specialMOVETO(parseInt(tableau[1]), parseInt(tableau[2]));
    }

    // if (message === "image") {
    //   this.backgroundImage();
    // }
  }
}

window.onload = () => {
  new AppRobot();
};
