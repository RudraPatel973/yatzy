<?php
session_start();

if (!isset($_SESSION['game_state'])) {
    $_SESSION['game_state'] = [
        'dice' => [0, 0, 0, 0, 0],
        'rolls' => 0,
        'scores' => [
            'ones' => null,
            'twos' => null,
            'threes' => null,
            'fours' => null,
            'fives' => null,
            'sixes' => null,
            'threeOfKind' => null,
            'fourOfKind' => null,
            'fullHouse' => null,
            'smallStraight' => null,
            'largeStraight' => null,
            'yahtzee' => null,
            'chance' => null
        ],
        'leaderboard' => []
    ];
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'roll':
        if ($_SESSION['game_state']['rolls'] < 3) {
            $keptDice = json_decode($_POST['kept'], true);
            for ($i = 0; $i < 5; $i++) {
                if (!$keptDice[$i]) {
                    $_SESSION['game_state']['dice'][$i] = rand(1, 6);
                }
            }
            $_SESSION['game_state']['rolls']++;
        }
        break;
    
    case 'score':
        $category = $_POST['category'] ?? '';
        $score = $_POST['score'] ?? 0;
        $_SESSION['game_state']['scores'][$category] = $score;
        $_SESSION['game_state']['rolls'] = 0;
        $_SESSION['game_state']['dice'] = [0, 0, 0, 0, 0];

        // Check if game is over
        $gameOver = true;
        foreach ($_SESSION['game_state']['scores'] as $score) {
            if ($score === null) {
                $gameOver = false;
                break;
            }
        }

        if ($gameOver) {
            $totalScore = array_sum($_SESSION['game_state']['scores']);
            $_SESSION['game_state']['totalScore'] = $totalScore;
        }
        break;

    case 'new_game':
        $_SESSION['game_state'] = [
            'dice' => [0, 0, 0, 0, 0],
            'rolls' => 0,
            'scores' => [
                'ones' => null,
                'twos' => null,
                'threes' => null,
                'fours' => null,
                'fives' => null,
                'sixes' => null,
                'threeOfKind' => null,
                'fourOfKind' => null,
                'fullHouse' => null,
                'smallStraight' => null,
                'largeStraight' => null,
                'yahtzee' => null,
                'chance' => null
            ],
            'leaderboard' => $_SESSION['game_state']['leaderboard']
        ];
        break;

    case 'end_game':
        $playerName = $_POST['playerName'] ?? 'Anonymous';
        $totalScore = $_SESSION['game_state']['totalScore'] ?? 0;
        $_SESSION['game_state']['leaderboard'][] = ['name' => $playerName, 'score' => $totalScore];
        usort($_SESSION['game_state']['leaderboard'], function($a, $b) {
            return $b['score'] - $a['score'];
        });
        $_SESSION['game_state']['leaderboard'] = array_slice($_SESSION['game_state']['leaderboard'], 0, 10);
        break;
}

header('Content-Type: application/json');
echo json_encode($_SESSION['game_state']);
?>