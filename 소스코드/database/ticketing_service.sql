CREATE DATABASE  IF NOT EXISTS `ticketing_service` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ticketing_service`;
-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: localhost    Database: ticketing_service
-- ------------------------------------------------------
-- Server version	5.7.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `administrators` (
  `admin_index` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` varchar(45) NOT NULL,
  `admin_pw` varchar(300) NOT NULL,
  `admin_email` varchar(100) DEFAULT NULL,
  `admin_contact` int(11) DEFAULT NULL,
  `admin_name` varchar(45) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_index`),
  UNIQUE KEY `admin_id_UNIQUE` (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` VALUES (2,'admin','3e2dfc9e2bb45c8bb1dc066e1662bbf8b608fc6f1e6e75d5780b4143f662145e5238b1628cd0275543075be05fe4fa8fc714463c5c2498c84a9f017e97812d54','admin@admin.com',1012341234,'administrator','282371275824','2019-05-19 07:31:43','2019-05-19 07:31:43');
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bidding`
--

DROP TABLE IF EXISTS `bidding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bidding` (
  `bidding_index` int(11) NOT NULL AUTO_INCREMENT,
  `current_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `starting_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ticket_owner_id` varchar(45) NOT NULL,
  `max_price` int(11) NOT NULL,
  `current_price` int(11) NOT NULL,
  `bidder_id` varchar(45) DEFAULT NULL,
  `ticket_id` varchar(45) NOT NULL,
  `starting_price` int(11) NOT NULL,
  `end_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`bidding_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bidding`
--

LOCK TABLES `bidding` WRITE;
/*!40000 ALTER TABLE `bidding` DISABLE KEYS */;
INSERT INTO `bidding` VALUES (1,'2019-05-09 19:47:41','2019-05-08 15:00:00','1078842445',100,99,'1078842445','1',0,'2019-05-10 10:00:00',NULL,NULL);
/*!40000 ALTER TABLE `bidding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buyers`
--

DROP TABLE IF EXISTS `buyers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `buyers` (
  `buyer_index` int(11) NOT NULL AUTO_INCREMENT,
  `buyer_id` varchar(100) NOT NULL,
  `buyer_pw` varchar(300) NOT NULL,
  `buyer_email` varchar(100) DEFAULT NULL,
  `buyer_contact` int(11) DEFAULT NULL,
  `buyer_account` bigint(20) DEFAULT NULL,
  `buyer_name` varchar(45) DEFAULT NULL,
  `buyer_notification` varchar(300) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`buyer_index`),
  UNIQUE KEY `b_id_UNIQUE` (`buyer_id`),
  UNIQUE KEY `b_index_UNIQUE` (`buyer_index`),
  UNIQUE KEY `b_contact_UNIQUE` (`buyer_contact`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buyers`
--

LOCK TABLES `buyers` WRITE;
/*!40000 ALTER TABLE `buyers` DISABLE KEYS */;
INSERT INTO `buyers` VALUES (164,'buyer','d6fab7e0f5e417090e64298beaf1b667007706f5b528d01fa48e36a3ba9665370040e4b9aa0354a784f583f87e1de59f2c50f9312a43029251968aedf5df806a','buyer@naver.com',1012341234,1234234234,'buyer',NULL,'583559416743','2019-05-19 07:33:27','2019-05-19 07:33:27');
/*!40000 ALTER TABLE `buyers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gigs`
--

DROP TABLE IF EXISTS `gigs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `gigs` (
  `gig_index` int(11) NOT NULL AUTO_INCREMENT,
  `gig_organizer_index` int(11) NOT NULL,
  `gig_venue` varchar(200) DEFAULT NULL,
  `gig_name` varchar(200) NOT NULL,
  `gig_date_time` datetime NOT NULL,
  `gig_total_seatnum` int(11) NOT NULL,
  `pending` int(11) NOT NULL,
  `gig_image` varchar(500) DEFAULT NULL,
  `gig_description` varchar(300) DEFAULT NULL,
  `gig_type` varchar(45) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`gig_index`),
  KEY `gig_organizer_index_idx` (`gig_organizer_index`),
  CONSTRAINT `gig_organizer_index` FOREIGN KEY (`gig_organizer_index`) REFERENCES `organizers` (`organizer_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gigs`
--

LOCK TABLES `gigs` WRITE;
/*!40000 ALTER TABLE `gigs` DISABLE KEYS */;
INSERT INTO `gigs` VALUES (1,1,'Kyunghee Univ','Spectrum','2019-10-03 10:00:00',200,1,'http://tkfile.yes24.com/upload2/PerfBlog/201805/20180510/20180510-29476_12.jpg','best music festival!','',NULL,NULL);
/*!40000 ALTER TABLE `gigs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `notification` (
  `notification_index` int(11) NOT NULL AUTO_INCREMENT,
  `notice_buyer_id` varchar(45) NOT NULL,
  `notice_buyer_text` varchar(300) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`notification_index`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'1078842445','notice1',NULL,NULL);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizers`
--

DROP TABLE IF EXISTS `organizers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `organizers` (
  `organizer_index` int(11) NOT NULL AUTO_INCREMENT,
  `organizer_id` varchar(45) NOT NULL,
  `organizer_pw` varchar(300) NOT NULL,
  `organizer_email` varchar(45) DEFAULT NULL,
  `organizer_contact` int(11) DEFAULT NULL,
  `organizer_account` int(11) DEFAULT NULL,
  `organizer_name` varchar(45) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`organizer_index`),
  UNIQUE KEY `organizer_id_UNIQUE` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizers`
--

LOCK TABLES `organizers` WRITE;
/*!40000 ALTER TABLE `organizers` DISABLE KEYS */;
INSERT INTO `organizers` VALUES (2,'organizer','aa4b4bf9a7dfc6ba603a2ec7b30dbf435079264027cae80bce4b13056084dc961390b35a3d7820031aac7c90c2d09ce01900304d397a354965ccad555c4b2b99','organizer@naver.com',1012341234,1234234,'organizer','967943688979','2019-05-19 07:32:28','2019-05-19 07:32:28');
/*!40000 ALTER TABLE `organizers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat`
--

DROP TABLE IF EXISTS `seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `seat` (
  `seat_index` int(11) NOT NULL AUTO_INCREMENT,
  `gig_index` int(11) NOT NULL,
  `section_id` varchar(45) DEFAULT NULL,
  `seat_row_index` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`seat_index`),
  KEY `gig_index_idx` (`gig_index`),
  KEY `section_index_idx` (`section_id`),
  KEY `gig_idx` (`gig_index`),
  KEY `section_idx` (`section_id`),
  KEY `gig_index` (`gig_index`),
  KEY `section_index` (`section_id`),
  CONSTRAINT `gig_index_idx` FOREIGN KEY (`gig_index`) REFERENCES `gig` (`gig_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat`
--

LOCK TABLES `seat` WRITE;
/*!40000 ALTER TABLE `seat` DISABLE KEYS */;
/*!40000 ALTER TABLE `seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `section` (
  `section_index` int(11) NOT NULL AUTO_INCREMENT,
  `gig_index` int(11) NOT NULL,
  `seat_index` int(11) DEFAULT NULL,
  `seat_price` int(11) NOT NULL,
  `section_id` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`section_index`),
  KEY `gig_index_idx` (`gig_index`),
  CONSTRAINT `gig_index` FOREIGN KEY (`gig_index`) REFERENCES `gig` (`gig_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-19 16:36:11
