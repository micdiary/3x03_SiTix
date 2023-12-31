CREATE DATABASE  IF NOT EXISTS `3x03_sitix` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `3x03_sitix`;

DROP TABLE IF EXISTS `order`;

DROP TABLE IF EXISTS `user`;

DROP TABLE IF EXISTS `event_seat_type`;

DROP TABLE IF EXISTS `seat_type`;

DROP TABLE IF EXISTS `request`;

DROP TABLE IF EXISTS `event`;

DROP TABLE IF EXISTS `venue`;

DROP TABLE IF EXISTS `admin`;

DROP TABLE IF EXISTS `role`;

-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: 3x03_sitix
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` varchar(191) NOT NULL,
  `role_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` INT NOT NULL,
  `updated_at` INT DEFAULT NULL,
  PRIMARY KEY (`admin_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('80995877-2d63-4c1b-bd2e-ab4eed46137d',2,'michael.chandiary@hotmail.com','sitixsuperadmin','$2b$10$7wO5qzUkqj/k8aWxsSJzkuRoQttCyMpGNr07FyZWSeQmLvGka8g7y',UNIX_TIMESTAMP('2023-10-25 12:00:00'),NULL);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `event_id` varchar(191) NOT NULL,
  `venue_id` varchar(191) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `date` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `banner_img` varchar(255) NOT NULL,
  `created_at` int not null,
  `updated_at` int NULL,
  `updated_by` varchar(255) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`event_id`,`venue_id`),
  KEY `venue_id_idx` (`venue_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`),
  CONSTRAINT `event_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_seat_type`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_seat_type` (
  `event_id` varchar(191) NOT NULL,
  `seat_type_id` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `available_seats` int NOT NULL,
  PRIMARY KEY (`event_id`,`seat_type_id`),
  KEY `seat_type_idx` (`seat_type_id`),
  CONSTRAINT `event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`),
  CONSTRAINT `seat_type_id` FOREIGN KEY (`seat_type_id`) REFERENCES `seat_type` (`seat_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `event_id` varchar(191) NOT NULL,
  `seat_type_id` int NOT NULL,
  `venue_id` varchar(191) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` int NOT NULL,
  `updated_at` int DEFAULT NULL,
  PRIMARY KEY (`order_id`,`user_id`,`event_id`,`seat_type_id`,`venue_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `event_id_idx` (`event_id`),
  KEY `sit_type_id_idx` (`seat_type_id`),
  KEY `order_ibfk_4` (`venue_id`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event_seat_type` (`event_id`),
  CONSTRAINT `order_ibfk_3` FOREIGN KEY (`seat_type_id`) REFERENCES `event_seat_type` (`seat_type_id`),
  CONSTRAINT `order_ibfk_4` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request` (
  `request_id` varchar(191) NOT NULL,
  `admin_id` varchar(191) NOT NULL,
  `event_id` varchar(191) NOT NULL,
  `approval_num` int NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`request_id`),
  KEY `admin_id` (`admin_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `request_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `request_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'ADMIN'),(2,'SUPER_ADMIN');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_type`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_type` (
  `seat_type_id` int NOT NULL AUTO_INCREMENT,
  `venue_id` varchar(191) NOT NULL,
  `type_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`seat_type_id`,`venue_id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `seat_type_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(191) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` int NOT NULL,
  `updated_at` int DEFAULT NULL,
  `is_verified` tinyint NOT NULL,
  `failed_tries` int NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('c32d8b45-92fe-44f6-8b61-42c2107dfe87','micdiary','mic','chan','michael.chandiary@gmail.com','$2b$10$Ir8MaqpTYwZ7g/w5FXjJzOdfVNve2R5GApdZ8flMGRxwX3likkRYC',UNIX_TIMESTAMP('2023-09-05 22:07:35'),NULL,1,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue` (
  `venue_id` varchar(191) NOT NULL,
  `venue_name` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `created_at` int NOT NULL,
  `updated_at` int DEFAULT NULL,
  `updated_by` varchar(255) NOT NULL,
  PRIMARY KEY (`venue_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `venue_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-23 21:25:22
