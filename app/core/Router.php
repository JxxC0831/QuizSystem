<?php

namespace app\core;

use app\controllers\MainController;
use app\controllers\UserController;

class Router
{
    public $urlArray;

    function __construct()
    {
        $this->urlArray = $this->routeSplit();
        $this->handleMainRoutes();
        $this->handleUserRoutes();
    }

    protected function routeSplit()
    {
        $removeQueryParams = strtok($_SERVER["REQUEST_URI"], '?');
        return explode("/", $removeQueryParams);
    }

    protected function handleMainRoutes()
    {
        if ($this->urlArray[1] === '' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $mainController = new MainController();
            $mainController->homepage();
        }

        if ($this->urlArray[1] === 'quiz' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $mainController = new MainController();
            $mainController->quizView();
        }

        if ($this->urlArray[1] === 'rankings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $userController = new UserController();
            $userController->rankingsView();
        }
    }

    protected function handleUserRoutes()
    {
        if ($this->urlArray[1] === 'users' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $userController = new UserController();
            $userController->usersView();
        }

        //give json/API requests a api prefix
        if ($this->urlArray[1] === 'api' && $this->urlArray[2] === 'users' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $userController = new UserController();
            $userController->getUsers();
        }

        if ($this->urlArray[1] === 'login' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $userController = new UserController();
            $userController->loginView();
        }
 
        if ($this->urlArray[1] === 'register' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $userController = new UserController();
            $userController->registerView();
        }
 
        if ($this->urlArray[1] === 'api') {
            if ($this->urlArray[2] === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController = new UserController();
                $userController->login();
            }

            if ($this->urlArray[2] === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController = new UserController();
                $userController->register();
            }

            if ($this->urlArray[2] === 'check-auth' && $_SERVER['REQUEST_METHOD'] === 'GET') {
                $userController = new UserController();
                $userController->checkAuth();
            }

            if ($this->urlArray[2] === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController = new UserController();
                $userController->logout();
            }

            if ($this->urlArray[2] === 'save-score' && $_SERVER['REQUEST_METHOD'] === 'POST') {
                $userController = new UserController();
                $userController->saveQuizScore();
            }

            if ($this->urlArray[2] === 'rankings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
                $userController = new UserController();
                $userController->getRankings();
            }
        }

        if ($this->urlArray[1] === 'profile' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $userController = new UserController();
            $userController->profileView();
        }

        if ($this->urlArray[1] === 'api' && $this->urlArray[2] === 'profile' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $userController = new UserController();
            $userController->getUserProfile();
        }
    }
}
