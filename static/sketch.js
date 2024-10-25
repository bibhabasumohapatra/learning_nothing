let settings = {
  arcs: 30,
  radius: { min: 1, max: 360 },
  gap: { min: 15, max: 25 },
  weight: { min: 2, max: 15 },
  arcsColor: "#dbf7ff",
  gradient: "tints",
  background: "#012d3a",
  speed: { min: 0, max: 0.003 },
  directions: "both",
};

let curves = [];
let targetBackground;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  pixelDensity(1);
  targetBackground = color(settings.background);
  createRadialStrokes();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createRadialStrokes();
}

function createRadialStrokes() {
  curves = [];
  for (let i = 0; i < settings.arcs; i++) {
    let angleStart = int(random(settings.radius.min, settings.radius.max));
    let angleFinish = int(random(settings.radius.min, settings.radius.max));
    let movementDirection = random() > 0.5 ? 1 : 0;
    let movementSpeed = random(settings.speed.min, settings.speed.max);
    let curveWeight = random(settings.weight.min, settings.weight.max);
    let gap = random(settings.gap.min, settings.gap.max);

    curves.push(new RadialStroke(
      width / 2,
      height / 2,
      i * gap,
      angleStart,
      angleFinish,
      color(settings.arcsColor),
      curveWeight,
      movementDirection,
      movementSpeed
    ));
  }
}

function draw() {
  // Smoothly transition to the target background color
  let currentBackground = color(red(settings.background), green(settings.background), blue(settings.background));
  currentBackground = lerpColor(currentBackground, targetBackground, 0.05);
  settings.background = currentBackground;
  
  background(settings.background);
  noFill();

  for (let curve of curves) {
    curve.draw();
  }
}

class RadialStroke {
  constructor(x, y, radius, angleStart, angleEnd, strokeColor, weight, direction, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angleStart = angleStart;
    this.angleEnd = angleEnd;
    this.strokeColor = strokeColor;
    this.weight = weight;
    this.direction = direction;
    this.speed = speed;
  }

  draw() {
    stroke(this.strokeColor);
    strokeWeight(this.weight);
    arc(this.x, this.y, this.radius * 2, this.radius * 2, this.angleStart, this.angleEnd);

    if (this.direction === 0) {
      this.angleStart += this.speed;
      this.angleEnd += this.speed;
    } else {
      this.angleStart -= this.speed;
      this.angleEnd -= this.speed;
    }

    if (this.angleStart > TWO_PI) this.angleStart -= TWO_PI;
    if (this.angleEnd > TWO_PI) this.angleEnd -= TWO_PI;
    if (this.angleStart < 0) this.angleStart += TWO_PI;
    if (this.angleEnd < 0) this.angleEnd += TWO_PI;
  }
}

// Function to update settings from outside the sketch
function updateSketchSettings(newSettings) {
  Object.assign(settings, newSettings);
  targetBackground = color(settings.background);
  createRadialStrokes();
}
