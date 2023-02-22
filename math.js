var answer;
var score = 0;
var backgroundImages = [];

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5)
    const n2 = Math.floor(Math.random() * 6)
    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;
    answer = n1 + n2;
}

function checkAnswer() {
    const prediction = predictImage();
    console.log(`answer: ${answer}, prediction: ${prediction}`);

    if (prediction == answer) {
        score += 1;
        if (score <= 6) {
            backgroundImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundImages;
            console.log(backgroundImages.length);
        } else {
            alert('Well done! Time to shave your bush and start over.');
            score = 0;
            backgroundImages = [] 
        }
    } else {
        if (score != 0) {
            score -= 1;
            alert('Wrong');
            setTimeout(() => {
                backgroundImages.pop();
                document.body.style.backgroundImage = backgroundImages;
                console.log(backgroundImages.length);
            }, 1000)
        } else {
            alert('Wrong');
            setTimeout(() => {
                document.body.style.backgroundImage = backgroundImages;
                console.log('zero');
            }, 1000)
        }
    }
    
    console.log(`Score: ${score}`);
}