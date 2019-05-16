-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ticketing_service
-- ------------------------------------------------------
-- Server version	5.6.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `administrators` (
  `admin_index` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` varchar(45) NOT NULL,
  `admin_pw` varchar(45) NOT NULL,
  `admin_email` varchar(100) DEFAULT NULL,
  `admin_contact` int(11) DEFAULT NULL,
  `admin_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`admin_index`),
  UNIQUE KEY `admin_id_UNIQUE` (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` VALUES (1,'admin','admin','admin@admin.com',123123,NULL);
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bidding`
--

DROP TABLE IF EXISTS `bidding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`bidding_index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bidding`
--

LOCK TABLES `bidding` WRITE;
/*!40000 ALTER TABLE `bidding` DISABLE KEYS */;
INSERT INTO `bidding` VALUES (1,'2019-05-09 19:47:41','2019-05-08 15:00:00','1078842445',100,99,'1078842445','1',0,'2019-05-10 10:00:00');
/*!40000 ALTER TABLE `bidding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buyers`
--

DROP TABLE IF EXISTS `buyers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buyers` (
  `buyer_index` int(11) NOT NULL AUTO_INCREMENT,
  `buyer_id` varchar(45) NOT NULL,
  `buyer_pw` varchar(45) NOT NULL,
  `buyer_email` varchar(100) DEFAULT NULL,
  `buyer_contact` int(11) DEFAULT NULL,
  `buyer_account` int(11) DEFAULT NULL,
  `buyer_name` varchar(45) DEFAULT NULL,
  `buyer_notificatoin` varchar(300) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`buyer_index`),
  UNIQUE KEY `b_id_UNIQUE` (`buyer_id`),
  UNIQUE KEY `b_index_UNIQUE` (`buyer_index`),
  UNIQUE KEY `b_contact_UNIQUE` (`buyer_contact`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buyers`
--

LOCK TABLES `buyers` WRITE;
/*!40000 ALTER TABLE `buyers` DISABLE KEYS */;
INSERT INTO `buyers` VALUES (24,'1078842445','1078842445','yhye1997@gmail.com',10,111,NULL,NULL,NULL);
/*!40000 ALTER TABLE `buyers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gigs`
--

DROP TABLE IF EXISTS `gigs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
INSERT INTO `gigs` VALUES (1,1,'Kyunghee Univ','Spectrum','2019-10-03 10:00:00',200,1,'http://tkfile.yes24.com/upload2/PerfBlog/201805/20180510/20180510-29476_12.jpg','best music festival!','');
/*!40000 ALTER TABLE `gigs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `notification_index` int(11) NOT NULL AUTO_INCREMENT,
  `notice_buyer_id` varchar(45) NOT NULL,
  `notice_buyer_text` varchar(300) NOT NULL,
  PRIMARY KEY (`notification_index`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'1078842445','notice1'),(3,'-1','overbid ??????!'),(4,'1078842445','you have been overbid!');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizers`
--

DROP TABLE IF EXISTS `organizers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organizers` (
  `organizer_index` int(11) NOT NULL AUTO_INCREMENT,
  `organizer_id` varchar(45) NOT NULL,
  `organizer_pw` varchar(45) NOT NULL,
  `organizer_email` varchar(45) DEFAULT NULL,
  `organizer_contact` int(11) DEFAULT NULL,
  `organizer_account` int(11) DEFAULT NULL,
  `organizer_name` varchar(45) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`organizer_index`),
  UNIQUE KEY `organizer_id_UNIQUE` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizers`
--

LOCK TABLES `organizers` WRITE;
/*!40000 ALTER TABLE `organizers` DISABLE KEYS */;
INSERT INTO `organizers` VALUES (1,'og1','pw','og1@og.com',123123,11111,'organizer1',NULL);
/*!40000 ALTER TABLE `organizers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat`
--

DROP TABLE IF EXISTS `seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seat` (
  `seat_index` int(11) NOT NULL AUTO_INCREMENT,
  `gig_index` int(11) NOT NULL,
  `section_id` varchar(45) DEFAULT NULL,
  `seat_row_index` int(11) DEFAULT NULL,
  PRIMARY KEY (`seat_index`),
  KEY `gig_index_idx` (`gig_index`),
  KEY `section_index_idx` (`section_id`),
  KEY `gig_idx` (`gig_index`),
  KEY `section_idx` (`section_id`),
  KEY `gig_index` (`gig_index`),
  KEY `section_index` (`section_id`),
  CONSTRAINT `gig_index_idx` FOREIGN KEY (`gig_index`) REFERENCES `gigs` (`gig_index`) ON DELETE CASCADE ON UPDATE CASCADE
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `section` (
  `section_index` int(11) NOT NULL AUTO_INCREMENT,
  `gig_index` int(11) NOT NULL,
  `seat_index` int(11) DEFAULT NULL,
  `seat_price` int(11) NOT NULL,
  `section_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`section_index`),
  KEY `gig_index_idx` (`gig_index`),
  CONSTRAINT `gig_index` FOREIGN KEY (`gig_index`) REFERENCES `gigs` (`gig_index`) ON DELETE CASCADE ON UPDATE CASCADE
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

-- Dump completed on 2019-05-16 11:15:48
