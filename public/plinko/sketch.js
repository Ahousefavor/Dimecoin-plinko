let plinkoRadius = 10;
let balls = [];
let pegs = [];
let buckets = [];
let canvasWidth = 600;
let canvasHeight = 800;

const bucketPayouts = [0.5, 0.75, 1, 2, 3, 5]; // Multiplier for each bucket

// Setup function
function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('plinkoCanvas');

    // Initialize pegs
    for (let y = 100; y <= 400; y += 50) {
        for (let x = 50; x <= width - 50; x += 50) {
            pegs.push({ x, y });
        }
    }

    // Initialize buckets
    for (let x = 0; x <= canvasWidth; x += 100) {
        buckets.push({ x, width: 100, multiplier: bucketPayouts[x / 100] });
    }
}

// Draw function
function draw() {
    background(0);
    
    // Draw pegs
    fill(255);
    pegs.forEach(peg => ellipse(peg.x, peg.y, plinkoRadius, plinkoRadius));

    // Draw ball
    if (balls.length > 0) {
        balls.forEach(ball => {
            ball.y += ball.speed;
            ellipse(ball.x, ball.y, plinkoRadius);
        });
    }

    // Draw buckets
    noStroke();
    fill(0, 255, 0);
    buckets.forEach(bucket => rect(bucket.x, 700, bucket.width, 50));
}

// Drop the ball
function dropBall(x) {
    balls.push({ x, y: 0, speed: 3 });
}

// Handle Plinko play event
document.getElementById('playButton').addEventListener('click', async () => {
    const betAmount = parseFloat(document.getElementById('betAmount').value);

    if (betAmount > 0) {
        const response = await fetch('/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ betAmount }),
        });

        const data = await response.json();

        if (response.ok) {
            dropBall(random(width));
            document.getElementById('balance').innerText = data.newBalance.toFixed(2);
            document.getElementById('result').innerText = `You won
${data.reward.toFixed(2)} Dimecoin!`;
        } else {
            alert(data.error);
        }
    } else {
        alert('Please enter a valid bet amount.');
    }
});

// Fetch initial wallet balance
(async function fetchBalance() {
    const response = await fetch('/api/wallet');
    const data = await response.json();
    document.getElementById('balance').innerText = data.balance.toFixed(2);
})();
