document.addEventListener('DOMContentLoaded', (event) => {
    const diceContainer = document.getElementById('dice-container');
    const rollButton = document.getElementById('roll-button');
    const scoresContainer = document.getElementById('scores');
    const leaderboardScores = document.getElementById('leaderboard-scores');

    let keptDice = [false, false, false, false, false];
    let gameOver = false;

    function rollDice() {
        fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'action=roll&kept=' + JSON.stringify(keptDice)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => updateGameState(data))
        .catch(error => console.error('Fetch operation error:', error));
    }

    function updateGameState(data) {
        // Update dice
        diceContainer.innerHTML = '';
        data.dice.forEach((value, index) => {
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

        // Update scores
        scoresContainer.innerHTML = '';
        for (const [category, score] of Object.entries(data.scores)) {
            const scoreEntry = document.createElement('div');
            scoreEntry.classList.add('score-entry');
            const label = document.createElement('span');
            label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = score !== null ? score : '-';
            scoreEntry.appendChild(label);
            scoreEntry.appendChild(scoreSpan);
            if (score === null) {
                const button = document.createElement('button');
                button.textContent = 'Score';
                button.addEventListener('click', () => {
                    if (score === null) {
                        fetch('game.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: `action=score&category=${category}&score=${calculateScore(category, data.dice)}`
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Network response was not ok: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            resetKeptDice();
                            updateGameState(data);
                            checkGameOver(data);
                        })
                        .catch(error => console.error('Fetch operation error:', error));
                    }
                });
                scoreEntry.appendChild(button);
            }
            scoresContainer.appendChild(scoreEntry);
        }

        // Update leaderboard
        leaderboardScores.innerHTML = '';
        data.leaderboard.forEach((entry, index) => {
            const leaderboardEntry = document.createElement('div');
            leaderboardEntry.classList.add('leaderboard-entry');
            leaderboardEntry.textContent = `#${index + 1}: ${entry.name} - ${entry.score}`;
            leaderboardScores.appendChild(leaderboardEntry);
        });
    }

    function calculateScore(category, dice) {
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

    function checkGameOver(data) {
        if (Object.values(data.scores).every(score => score !== null)) {
            gameOver = true;
            const playerName = prompt('Game Over! Enter your name for the leaderboard:');
            fetch('game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `action=end_game&playerName=${encodeURIComponent(playerName)}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                updateGameState(data);
                alert('Game Over! Starting a new game.');
                resetGame();
            })
            .catch(error => console.error('Fetch operation error:', error));
        }
    }

    function resetKeptDice() {
        keptDice.fill(false);
    }

    function resetGame() {
        resetKeptDice();
        gameOver = false;
        fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'action=new_game'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => updateGameState(data))
        .catch(error => console.error('Fetch operation error:', error));
    }

    // Initial load
    fetch('game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=new_game'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => updateGameState(data))
    .catch(error => console.error('Fetch operation error:', error));

    rollButton.addEventListener('click', () => {
        if (!gameOver) {
            rollDice();
        }
    });
});