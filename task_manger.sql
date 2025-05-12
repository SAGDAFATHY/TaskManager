-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2025 at 11:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `task_manger`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') DEFAULT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `deadline`, `status`, `assigned_to`, `created_at`, `update_at`) VALUES
(9, 'task', 'task', '2025-05-31 14:59:00', 'IN_PROGRESS', 10, NULL, NULL),
(11, 'task1', 'Description', '2025-05-21 17:10:00', 'IN_PROGRESS', 14, NULL, '2025-05-13 00:12:19.000000'),
(12, 'task3', 'task', '2025-05-21 17:29:00', 'PENDING', 10, NULL, NULL),
(13, 'tasssk ', 'kgcfkgckhyc', '2025-05-30 21:04:00', 'PENDING', 14, NULL, NULL),
(14, 'taassskk', 'xcvbnm', '2025-05-22 21:10:00', 'PENDING', 16, '2025-05-13 00:10:29.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `password`, `created_at`, `update_at`) VALUES
(3, 'text', 'test@gmail.com', 'manager', 'Sagda_2004', NULL, '2025-05-12 23:54:05.000000'),
(8, 'Sagda', 'Sagda.test@gmail.com', 'employee', '123456', NULL, NULL),
(10, 'sara', 'sara@gmail.com', 'employee', '4353568678', NULL, NULL),
(13, 'test10', 'test10@gmail.com', 'employee', 'Sagda_2004', NULL, NULL),
(14, 'SAGDAF', 'SAGDAF@gmail.com', 'employee', 'Sagda_2004', '2025-05-12 23:55:09.000000', NULL),
(15, 'TEST1', 'TEST1@gmail.com', 'employee', 'Sagda_2004', '2025-05-12 23:57:17.000000', NULL),
(16, 'tessst', 'tessssttt@gmail.com', 'employee', '12345678', '2025-05-12 23:59:34.000000', '2025-05-13 00:00:14.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
