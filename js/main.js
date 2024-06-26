document.addEventListener('DOMContentLoaded', (event) => {
    const diceContainer = document.getElementById('dice-container');
    const rollButton = document.getElementById('roll-button');
    const scoresContainer = document.getElementById('scores');

    let dice = [0, 0, 0, 0, 0];
    let rollsLeft = 3;
    let keptDice = [false, false, false, false, false];
    let scores = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfKind: null,
        fourOfKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null
    };
    let gameOver = false;

    function rollDice() {
        for (let i = 0; i < dice.length; i++) {
            if (!keptDice[i]) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        updateDiceDisplay();
        rollsLeft--;
        if (rollsLeft === 0) {
            rollButton.disabled = true;
        }
    }

    function updateDiceDisplay() {
        diceContainer.innerHTML = '';
        dice.forEach((value, index) => {
            const die = document.createElement('div');
            die.classList.add('die');
            die.textContent = value;
            die.addEventListener('click', () => {
                keptDice[index] = !keptDice[index];
                die.classList.toggle('kept', keptDice[index]);
            });
            if (keptDice[index]) {
                die.classList.add('kept');
            }
            diceContainer.appendChild(die);
        });
    }

    function initializeScores() {
        for (const category in scores) {
            const scoreEntry = document.createElement('div');
            scoreEntry.classList.add('score-entry');
            const label = document.createElement('span');
            label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            const score = document.createElement('span');
            score.textContent = scores[category] !== null ? scores[category] : '-';
            const button = document.createElement('button');
            button.textContent = 'Score';
            button.disabled = scores[category] !== null;
            button.addEventListener('click', () => {
                if (scores[category] === null) {
                    scores[category] = calculateScore(category);
                    score.textContent = scores[category];
                    button.disabled = true;
                    resetTurn();
                    checkGameOver();
                }
            });
            scoreEntry.appendChild(label);
            scoreEntry.appendChild(score);
            scoreEntry.appendChild(button);
            scoresContainer.appendChild(scoreEntry);
        }
    }

    function calculateScore(category) {
        const counts = [0, 0, 0, 0, 0, 0];
        dice.forEach(die => counts[die - 1]++);

        switch (category) {
            case 'ones':
                return counts[0] * 1;
            case 'twos':
                return counts[1] * 2;
            case 'threes':
                return counts[2] * 3;
            case 'fours':
                return counts[3] * 4;
            case 'fives':
                return counts[4] * 5;
            case 'sixes':
                return counts[5] * 6;
            case 'threeOfKind':
                return counts.some(count => count >= 3) ? dice.reduce((a, b) => a + b, 0) : 0;
            case 'fourOfKind':
                return counts.some(count => count >= 4) ? dice.reduce((a, b) => a + b, 0) : 0;
            case 'fullHouse':
                return counts.includes(3) && counts.includes(2) ? 25 : 0;
            case 'smallStraight':
                return (counts.slice(0, 5).filter(count => count > 0).length >= 4) ||
                       (counts.slice(1, 6).filter(count => count > 0).length >= 4) ? 30 : 0;
            case 'largeStraight':
                return (counts.slice(0, 5).every(count => count > 0)) ||
                       (counts.slice(1, 6).every(count => count > 0)) ? 40 : 0;
            case 'yahtzee':
                return counts.some(count => count === 5) ? 50 : 0;
            case 'chance':
                return dice.reduce((a, b) => a + b, 0);
            default:
                return 0;
        }
    }

    function resetTurn(){
        dice = [0, 0, 0, 0, 0];
        keptDice.fill(false);
        rollsLeft = 3;
        rollButton.disabled = false;
        updateDiceDisplay();
        }
    function checkGameOver() {
            if (Object.values(scores).every(score => score !== null)) {
                gameOver = true;
                rollButton.disabled = true;
                alert('Game Over! Your final score is: ' + Object.values(scores).reduce((a, b) => a + b, 0));
            }
        }
        
        rollButton.addEventListener('click', () => {
            if (!gameOver && rollsLeft > 0) {
                rollDice();
            }
        });
        
        updateDiceDisplay();
        initializeScores();
    });