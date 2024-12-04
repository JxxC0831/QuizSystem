<?php

namespace app\models;

class User extends Model {

    protected $table = 'users';

    public function getAllUsers() {
        return $this->findAll();
    }
 
    public function register($data) {
        // verify data
        if(empty($data['username']) || empty($data['password']) || empty($data['email'])) {
            return ['error' => 'All fields are required'];
        }
        
        // check if username already exists
        if($this->where('username', $data['username'])) {
            return ['error' => 'Username already exists'];
        }
        
        // check if email already exists
        if($this->where('email', $data['email'])) {
            return ['error' => 'Email already exists'];
        }
        
        // encrypt password
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // insert data
        $query = "INSERT INTO users (username, password, email) VALUES (:username, :password, :email)";
        return $this->query($query, $data);
    }
    
    public function login($username, $password) {
        $query = "SELECT * FROM users WHERE username = :username LIMIT 1";
        $result = $this->query($query, ['username' => $username]);
        
        if($result && password_verify($password, $result[0]->password)) {
            // remove password and return user info
            unset($result[0]->password);
            return $result[0];
        }
        return false;
    }

    public function where($column, $value) {
        $query = "SELECT * FROM $this->table WHERE $column = :value LIMIT 1";
        return $this->query($query, ['value' => $value]);
    }
}