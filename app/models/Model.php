<?php

namespace app\models;

abstract class Model
{
    protected $table; // Table name must be set in child classes

    private function connect()
    {
        try {
            $string = "mysql:host=" . DBHOST . ";dbname=" . DBNAME . ";port=" . DBPORT;
            $con = new \PDO($string, DBUSER, DBPASS);
            $con->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            return $con;
        } catch (\PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    public function query($query, $data = [])
    {
        try {
            $con = $this->connect();
            $stm = $con->prepare($query);
            $check = $stm->execute($data);
            if ($check) {
                $result = $stm->fetchAll(\PDO::FETCH_OBJ);
                if (is_array($result) && count($result)) {
                    return $result;
                }
            }
        } catch (\PDOException $e) {
            error_log("Query error: " . $e->getMessage());
            throw $e;
        }
        return false;
    }

    public function findAll()
    {
        $query = "SELECT * FROM $this->table";
        return $this->query($query);
    }

    public function insert($data)
    {
        $keys = array_keys($data);
        $columns = implode(',', $keys);
        $placeholders = ':' . implode(', :', $keys);

        $query = "INSERT INTO $this->table ($columns) VALUES ($placeholders)";
        return $this->query($query, $data);
    }
}
