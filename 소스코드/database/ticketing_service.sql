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
  `admin_email` varchar(100) NOT NULL,
  `admin_contact` int(11) NOT NULL,
  `admin_name` varchar(45) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_index`),
  UNIQUE KEY `admin_id_UNIQUE` (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` VALUES (1,'ticketadmin','a3be3a7769cdfd5f27dce90c7f57f031fd656f332f1bb7428fec366904cfe2325ead2adbc0ce79c332561394ab9b0c0dc07a8154ffbff3c9e8e1403d68a53903','admin@admin.com',1012341234,'administrator','900138784785','2019-05-22 08:20:02','2019-05-22 08:20:02');
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biddings`
--

DROP TABLE IF EXISTS `biddings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `biddings` (
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biddings`
--

LOCK TABLES `biddings` WRITE;
/*!40000 ALTER TABLE `biddings` DISABLE KEYS */;
/*!40000 ALTER TABLE `biddings` ENABLE KEYS */;
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
  `buyer_email` varchar(100) NOT NULL,
  `buyer_contact` int(11) NOT NULL,
  `buyer_account` bigint(20) NOT NULL,
  `buyer_name` varchar(45) NOT NULL,
  `buyer_notification` varchar(300) DEFAULT NULL,
  `salt` varchar(100) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`buyer_index`),
  UNIQUE KEY `b_id_UNIQUE` (`buyer_id`),
  UNIQUE KEY `b_index_UNIQUE` (`buyer_index`),
  UNIQUE KEY `b_contact_UNIQUE` (`buyer_contact`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buyers`
--

LOCK TABLES `buyers` WRITE;
/*!40000 ALTER TABLE `buyers` DISABLE KEYS */;
INSERT INTO `buyers` VALUES (1,'buyer','e70ac409c6431a4f9af5beefa5a13c58179226fa31817d8b305815a990455595c7098d9687c390b171a80514c779567bccd4ba9b0de86ebdcc547a831ba8635f','buyer@buyer.com',1012341234,1234234243,'buyer',NULL,'1182351900085','2019-05-21 22:56:57','2019-05-21 22:56:57');
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
  `gig_venue` varchar(200) NOT NULL,
  `gig_name` varchar(200) NOT NULL,
  `gig_date_time` datetime NOT NULL,
  `gig_total_seatnum` int(11) NOT NULL,
  `pending` int(11) NOT NULL,
  `gig_image` varchar(30000) NOT NULL,
  `gig_description` varchar(300) NOT NULL,
  `gig_type` varchar(45) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`gig_index`),
  KEY `gig_organizer_index_idx` (`gig_organizer_index`),
  CONSTRAINT `gig_organizer_index` FOREIGN KEY (`gig_organizer_index`) REFERENCES `organizers` (`organizer_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gigs`
--

LOCK TABLES `gigs` WRITE;
/*!40000 ALTER TABLE `gigs` DISABLE KEYS */;
INSERT INTO `gigs` VALUES (1,1,'KHU','KHU Music Festival','2019-05-30 07:00:00',9,1,'https://image.freepik.com/free-vector/modern-music-event-poster-template_1361-1292.jpg','This is a KHU music festival.','Music','2019-05-22 08:27:30','2019-05-22 08:27:30'),(2,1,'Seoul','Classic Music Concert','2019-06-01 06:00:00',6,1,'https://image.freepik.com/free-vector/classic-music-poster_1284-13572.jpg','This is a classic music conert.','Classic','2019-05-22 08:29:51','2019-05-22 08:29:51'),(3,2,'Busan','Busan Music Festival','2019-06-03 08:00:00',6,1,'https://image.freepik.com/free-vector/modern-music-poster-with-glitch-shapes_1361-1025.jpg','This is a Busan music festival.','Music','2019-05-22 08:31:16','2019-05-22 08:31:16');
/*!40000 ALTER TABLE `gigs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `notifications` (
  `notification_index` int(11) NOT NULL AUTO_INCREMENT,
  `notice_buyer_id` varchar(45) NOT NULL,
  `notice_buyer_text` varchar(300) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`notification_index`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
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
  `organizer_email` varchar(45) NOT NULL,
  `organizer_contact` int(11) NOT NULL,
  `organizer_account` bigint(20) NOT NULL,
  `organizer_name` varchar(45) NOT NULL,
  `salt` varchar(100) NOT NULL,
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
INSERT INTO `organizers` VALUES (1,'organizer','d4d92bf035bbe15e88f6d3345ac0fccb870ee89aded6469f0b24880fc42ea5d5d90a8b162d1027855c040f5e12ca77ed15bf476521de63a7b8e7e2ac7618b350','organizer@organizer.com',1043214321,2342431234,'organizer','235808721963','2019-05-21 22:58:15','2019-05-21 22:58:15'),(2,'organizer1','49fb21832ac3327640d1456084ca0de4057e9cc8aafb29343bdca37a18dd12ab5a259fa39b8faf798597ecc302ba7f81bf7f31f68dbbcc83e51207c1ffcc80a1','organizer1@organizer1.com',1012351235,23425235535,'organizer1','1109841638337','2019-05-22 08:28:24','2019-05-22 08:28:24');
/*!40000 ALTER TABLE `organizers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `seats` (
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
  KEY `section_index` (`section_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,1,'A',1,NULL,NULL),(2,1,'A',2,NULL,NULL),(3,1,'A',3,NULL,NULL),(4,1,'A',4,NULL,NULL),(5,1,'A',5,NULL,NULL),(6,1,'A',6,NULL,NULL),(7,1,'B',1,NULL,NULL),(8,1,'B',2,NULL,NULL),(9,1,'B',3,NULL,NULL),(10,2,'A',1,NULL,NULL),(11,2,'A',2,NULL,NULL),(12,2,'A',3,NULL,NULL),(13,2,'B',1,NULL,NULL),(14,2,'B',2,NULL,NULL),(15,2,'B',3,NULL,NULL),(16,3,'A',1,NULL,NULL),(17,3,'A',2,NULL,NULL),(18,3,'A',3,NULL,NULL),(19,3,'B',1,NULL,NULL),(20,3,'B',2,NULL,NULL),(21,3,'B',3,NULL,NULL);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sections` (
  `section_index` int(11) NOT NULL AUTO_INCREMENT,
  `gig_index` int(11) NOT NULL,
  `seat_index` int(11) DEFAULT NULL,
  `seat_price` int(11) NOT NULL,
  `section_id` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`section_index`),
  KEY `gig_index_idx` (`gig_index`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES (1,1,1,30000,'A',NULL,NULL),(2,1,7,50000,'B',NULL,NULL),(3,2,10,20000,'A',NULL,NULL),(4,2,13,30000,'B',NULL,NULL),(5,3,16,50000,'A',NULL,NULL),(6,3,19,70000,'B',NULL,NULL);
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-02 16:18:11
