<?php

//require our files, remember should be relative to index.php
require '../app/core/Router.php';
require '../app/models/Model.php';
require '../app/controllers/Controller.php';
require '../app/controllers/MainController.php';
require '../app/controllers/UserController.php';
require '../app/models/User.php';
require '../app/models/QuizRecord.php';

 
if ($_SERVER['SERVER_NAME'] === 'localhost') {
    // Local environment: Load configuration from .env file
    $env = parse_ini_file('../.env');
    /** Database configuration **/
    define('DBNAME', $env['DBNAME']);
    define('DBHOST', $env['DBHOST']);
    define('DBUSER', $env['DBUSER']);
    define('DBPASS', $env['DBPASS']);
    define('DBPORT', $env['DBPORT']);
} else {
    // Production environment: Use Heroku Config Vars
    /** Database configuration **/
    define('DBNAME', getenv('DBNAME'));
    define('DBHOST', getenv('DBHOST'));
    define('DBUSER', getenv('DBUSER'));
    define('DBPASS', getenv('DBPASS'));
    define('DBPORT', getenv('DBPORT'));
    
    // Set the root URL for production
    define('ROOT', 'https://rocky-tor-10358-918df2480069.herokuapp.com/');
}
//set up other configs
define('DEBUG', true);