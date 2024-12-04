<?php

namespace app\controllers;

class MainController extends Controller {

    public function homepage() {
        //remember to route relative to index.php
        //require page and exit to return an HTML page
        $this->returnView('./assets/views/main/homepage.html');
    }

    public function notFound() {
        $this->returnView('./assets/views/main/404.html');
    }

    public function quizView() {
        $this->returnView('./assets/views/quiz/quizView.html');
    }
 
}