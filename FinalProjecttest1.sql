-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Dec 04, 2024 at 03:12 AM
-- Server version: 8.0.35
-- PHP Version: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `FinalProjecttest1`
--

-- --------------------------------------------------------

--
-- Table structure for table `quiz_records`
--

CREATE TABLE `quiz_records` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `category` varchar(50) NOT NULL,
  `score` int NOT NULL,
  `total_questions` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quiz_records`
--

INSERT INTO `quiz_records` (`id`, `user_id`, `category`, `score`, `total_questions`, `created_at`) VALUES
(1, 2, 'Entertainment: Film', 3, 10, '2024-11-30 15:44:09'),
(2, 2, 'Entertainment: Video Games', 1, 10, '2024-11-30 15:47:52'),
(3, 2, 'Art', 3, 10, '2024-11-30 15:54:07'),
(4, 2, 'General Knowledge', 3, 10, '2024-11-30 15:55:22'),
(5, 3, 'Entertainment: Video Games', 1, 10, '2024-12-02 02:06:27'),
(6, 4, 'Entertainment: Video Games', 8, 10, '2024-12-02 23:18:08'),
(7, 4, 'Entertainment: Video Games', 6, 10, '2024-12-02 23:18:40'),
(8, 4, 'General Knowledge', 1, 10, '2024-12-04 02:18:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(2, 'test1', 'test1@gmail.com', '$2y$10$X7v5crs2FcULWgU/ACrM3ur2tTg8nqhM94IsIPosT5/OZZj7JAaPm', '2024-11-30 15:30:41'),
(3, 'test', 'test@gmail.com', '$2y$10$Tp0KC2D4l./CXj/hK435zOI5OcJ/cYJVCMhvI/IK2kla7udSPLupa', '2024-12-01 05:44:53'),
(4, 'user1', 'user1@asd.com', '$2y$10$GN2wx75UvHJbHHKYUBDtAukn84AXVB4BXeoQZvFqpfZ4zWaORv0Ky', '2024-12-02 23:15:22'),
(6, 'thisisatest', 'thisisatest@gmail.com', '$2y$10$WfQ1OjK4kXqLKfPj/9JLA.XtGIDqxWHvjnlRoNDIMXx.eKGyfeqTa', '2024-12-04 02:44:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `quiz_records`
--
ALTER TABLE `quiz_records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `quiz_records`
--
ALTER TABLE `quiz_records`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;