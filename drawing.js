const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 10;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;

function prepareCanvas() {
    // console.log('Preparing Canvas');
    canvas = document.querySelector('.canvas');
    context = canvas.getContext('2d');
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    var isDrag = false;

    document.addEventListener('mousedown', function (event) {
        // console.log('Mouse pressed');
        isDrag = true;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    });

    document.addEventListener('mousemove', function (event) {
        if (isDrag) {
            previousX = currentX;
            currentX = event.clientX - canvas.offsetLeft;

            previousY = currentY;
            currentY = event.clientY - canvas.offsetTop;

            draw();
        }
    });

    document.addEventListener('mouseup', function (event) {
        // console.log('Mouse released');
        isDrag = false;
    });
    canvas.addEventListener('mouseleave', function (event) {
        isDrag = false;
    });

    // Touch Events
    canvas.addEventListener('touchstart', function (event) {
        isDrag = true;
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
        // console.log('Touchdown!');
    });

    canvas.addEventListener('touchmove', function (event) {
        if (isDrag) {
            previousX = currentX;
            currentX = event.touches[0].clientX - canvas.offsetLeft;
            previousY = currentY;
            currentY = event.touches[0].clientY - canvas.offsetTop;
            draw();
        }
    });

    canvas.addEventListener('touchend', function (event) {
        isDrag = false;
        // console.log('Touch end!');
    });

    canvas.addEventListener('touchcancel', function (event) {
        isDrag = false;
        // console.log('Touch cancel!');
    });
}

function draw() {
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

}