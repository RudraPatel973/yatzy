# Yatzy Game
https://github.com/RudraPatel973/yatzy
## Description

This is a single-player Yatzy game implemented using HTML, CSS, JavaScript, and PHP. The game follows the standard rules of Yatzy, where a player rolls five dice, chooses which to keep, and can reroll up to two times per turn. The player must place a score into an available score box, and the game ends when all score boxes are filled. The game state and leaderboard are managed on the server using PHP.

## How to Play

1. Start a local PHP server from the project directory:
    ```sh
    php -S localhost:8000
    ```
2. Open `http://localhost:8000` in a web browser.
3. Click the "Roll/Reroll Dice" button to roll the dice.
4. Click on any dice to keep it for the next roll.
5. Click the "Roll/Reroll Dice" button again to reroll the remaining dice.
6. Choose a score category and click "Score" to place your score. The kept dice will reset after scoring.
7. Repeat until all score categories are filled.
8. When the game ends, enter your name for the leaderboard.
9. Your final score will be displayed, and you can start a new game.

## Project Structure

- `index.html`: The main HTML file for the game.
- `styles.css`: The CSS file for styling the game.
- `main.js`: The JavaScript file containing the game logic.
- `game.php`: The PHP file managing the game state and leaderboard.

## Technical Outline

This project demonstrates the following technical skills:
- HTML for structuring the game interface.
- CSS for styling the game.
- JavaScript for implementing game logic and interactivity.
- PHP for server-side game state management and leaderboard.
- AJAX for communication between the client and server.