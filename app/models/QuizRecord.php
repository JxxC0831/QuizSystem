<?php

namespace app\models;

class QuizRecord extends Model {
    protected $table = 'quiz_records';

    public function saveRecord($userId, $category, $score, $totalQuestions) {
        $query = "INSERT INTO quiz_records (user_id, category, score, total_questions) 
                 VALUES (:user_id, :category, :score, :total_questions)";
        
        return $this->query($query, [
            'user_id' => $userId,
            'category' => $category,
            'score' => $score,
            'total_questions' => $totalQuestions
        ]);
    }

    public function getRankings() {
        $query = "SELECT 
                    u.username,
                    qr.score,
                    qr.total_questions,
                    qr.category,
                    qr.created_at
                  FROM quiz_records qr
                  JOIN users u ON qr.user_id = u.id
                  ORDER BY qr.score DESC, qr.created_at DESC
                  LIMIT 100";
         
        return $this->query($query);
    }

    public function getUserStats($userId) {
        // get user overall stats
        $statsQuery = "SELECT 
            COUNT(*) as total_quizzes,
            SUM(score) as total_correct,
            SUM(total_questions) as total_questions,
            ROUND(SUM(score) * 100.0 / SUM(total_questions), 2) as accuracy
        FROM quiz_records 
        WHERE user_id = :user_id";

        // get user recent quiz records
        $historyQuery = "SELECT 
            category,
            score,
            total_questions,
            created_at
        FROM quiz_records 
        WHERE user_id = :user_id 
        ORDER BY created_at DESC 
        LIMIT 10";

        $stats = $this->query($statsQuery, ['user_id' => $userId])[0];
        $history = $this->query($historyQuery, ['user_id' => $userId]) ?: [];

        return [
            'stats' => $stats,
            'history' => $history
        ];
    }
} 