<?php

namespace app\controllers;

use app\models\User;

class UserController extends Controller
{
    // data validation
    private function validateUserData($data)
    {
        $errors = [];

        // Validate username
        if (empty($data['username'])) {
            $errors['username'] = 'Username is required.';
        } elseif (!preg_match('/^[a-zA-Z0-9_]{3,30}$/', $data['username'])) {
            $errors['username'] = 'Username must be 3-30 characters long and alphanumeric.';
        }

        // Validate email
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required.';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format.';
        }

        // Validate password
        if (empty($data['password'])) {
            $errors['password'] = 'Password is required.';
        } elseif (strlen($data['password']) < 8 || !preg_match('/\d/', $data['password'])) {
            $errors['password'] = 'Password must be at least 8 characters long and include a number.';
        }

        return $errors;
    }

    public function getUsers()
    {
        $userModel = new User();
        $users = $userModel->getAllUsers();
        $this->returnJSON($users);
        exit();
    }
    public function usersView()
    {
        $this->returnView('./assets/views/users/usersView.html');
    }

    public function loginView()
    {
        $this->returnView('./assets/views/users/login.html');
    }

    public function registerView()
    {
        $this->returnView('./assets/views/users/register.html');
    }

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->returnJSON(['error' => 'Invalid request method']);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        // Validate input for login
        if (empty($data['username']) || empty($data['password'])) {
            $this->returnJSON(['error' => 'Username and password are required.']);
            return;
        }

        $userModel = new User();
        $user = $userModel->login($data['username'], $data['password']);

        if ($user) {
            session_start();
            $_SESSION['user'] = $user;
            $this->returnJSON(['success' => true, 'user' => $user]);
        } else {
            $this->returnJSON(['error' => 'Invalid username or password']);
        }
    }

    public function register()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->returnJSON(['error' => 'Invalid request method']);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $errors = $this->validateUserData($data);

        if (!empty($errors)) {
            http_response_code(400);
            $this->returnJSON(['error' => $errors]);
            return;
        }

        $userModel = new User();
        $result = $userModel->register($data);

        if (isset($result['error'])) {
            $this->returnJSON(['error' => $result['error']]);
        } else {
            $this->returnJSON(['success' => true]);
        }
    }

    public function checkAuth()
    {
        session_start();
        $isLoggedIn = isset($_SESSION['user']);
        $this->returnJSON([
            'isLoggedIn' => $isLoggedIn,
            'user' => $isLoggedIn ? $_SESSION['user'] : null,
        ]);
    }

    public function logout()
    {
        session_start();
        session_destroy();
        $this->returnJSON(['success' => true]);
    }

    public function saveQuizScore()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->returnJSON(['error' => 'Invalid request method']);
            return;
        }

        session_start();
        if (!isset($_SESSION['user'])) {
            $this->returnJSON(['error' => 'User not logged in']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['score'], $data['category'], $data['total_questions'])) {
            $this->returnJSON(['error' => 'Missing required data']);
            return;
        }

        $quizRecord = new \app\models\QuizRecord();
        $result = $quizRecord->saveRecord(
            $_SESSION['user']->id,
            $data['category'],
            $data['score'],
            $data['total_questions']
        );

        if ($result) {
            $this->returnJSON(['success' => true]);
        } else {
            $this->returnJSON(['error' => 'Failed to save score']);
        }
    }

    public function getRankings()
    {
        $quizRecord = new \app\models\QuizRecord();
        $rankings = $quizRecord->getRankings();
        $this->returnJSON($rankings ?: []);
    }

    public function rankingsView()
    {
        $this->returnView('./assets/views/rankings/rankingsView.html');
    }

    public function profileView()
    {
        $this->returnView('./assets/views/users/profileView.html');
    }

    public function getUserProfile()
    {
        session_start();
        if (!isset($_SESSION['user'])) {
            $this->returnJSON(['error' => 'Not logged in']);
            return;
        }

        $quizRecord = new \app\models\QuizRecord();
        $stats = $quizRecord->getUserStats($_SESSION['user']->id);
        $this->returnJSON($stats);
    }
}

