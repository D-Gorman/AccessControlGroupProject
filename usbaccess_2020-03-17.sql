# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: usbaccess
# Generation Time: 2020-03-17 22:28:08 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table data_request_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data_request_log`;

CREATE TABLE `data_request_log` (
  `data_req` varchar(50) NOT NULL DEFAULT '',
  `id` varchar(8) NOT NULL DEFAULT '',
  `role` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `association` varchar(50) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `date_begin` char(10) DEFAULT NULL,
  `date_end` char(10) DEFAULT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table login_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `login_info`;

CREATE TABLE `login_info` (
  `user_id` char(8) NOT NULL DEFAULT '',
  `password` varchar(12) DEFAULT NULL,
  `dashboard` varchar(15) DEFAULT NULL,
  `hash` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `login_info` WRITE;
/*!40000 ALTER TABLE `login_info` DISABLE KEYS */;

INSERT INTO `login_info` (`user_id`, `password`, `dashboard`, `hash`)
VALUES
	('Amy','123456','researcher','e10adc3949ba59abbe56e057f20f883e'),
	('Ana','123456','researcher','e10adc3949ba59abbe56e057f20f883e'),
	('Ban','abc','occupant','900150983cd24fb0d6963f7d28e17f72'),
	('Bob','abc','occupant','900150983cd24fb0d6963f7d28e17f72'),
	('Cindy','code','both','c13367945d5d4c91047b3b50234aa7ab'),
	('David','code123','both','7d8c80efaa80676771291f32576479d1');

/*!40000 ALTER TABLE `login_info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table occupant
# ------------------------------------------------------------

DROP TABLE IF EXISTS `occupant`;

CREATE TABLE `occupant` (
  `user_id` char(8) NOT NULL DEFAULT '',
  `location` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `occupant` WRITE;
/*!40000 ALTER TABLE `occupant` DISABLE KEYS */;

INSERT INTO `occupant` (`user_id`, `location`)
VALUES
	('Ban','6.008'),
	('Bob','6.024'),
	('Cindy','6.008'),
	('David','6.024');

/*!40000 ALTER TABLE `occupant` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table policies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `policies`;

CREATE TABLE `policies` (
  `id` char(8) NOT NULL DEFAULT '',
  `location` varchar(50) NOT NULL DEFAULT '',
  `data_req` varchar(50) NOT NULL DEFAULT '',
  `association` varchar(50) DEFAULT NULL,
  `role` varchar(10) DEFAULT NULL,
  `date_begin` char(10) DEFAULT NULL,
  `date_end` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `policies` WRITE;
/*!40000 ALTER TABLE `policies` DISABLE KEYS */;

INSERT INTO `policies` (`id`, `location`, `data_req`, `association`, `role`, `date_begin`, `date_end`)
VALUES
	('Cindy','6.008','co2','university','staff','2020-03-01','2020-03-31'),
	('Cindy','6.008','occupancy-sensor','university','other','2020-03-01','2020-03-02'),
	('Cindy','6.008','relative-humidity','school','staff','2020-03-01','2020-03-31'),
	('Cindy','6.008','room-brightness','university','staff','2020-02-01','2020-03-06');

/*!40000 ALTER TABLE `policies` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table researcher
# ------------------------------------------------------------

DROP TABLE IF EXISTS `researcher`;

CREATE TABLE `researcher` (
  `user_id` char(8) NOT NULL DEFAULT '',
  `role` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `association` varchar(50) DEFAULT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `researcher` WRITE;
/*!40000 ALTER TABLE `researcher` DISABLE KEYS */;

INSERT INTO `researcher` (`user_id`, `role`, `email`, `association`, `first_name`, `last_name`)
VALUES
	('Amy','staff','amy@ncl.ac.uk','school','Amy','James'),
	('Ana','student','ana@ncl.ac.uk','company','Ana','Harden'),
	('Cindy','staff','cindy@ncl.ac.uk','university','Cindy','Kobe'),
	('David','other','david@ncl.ac.uk','','David','Curry');

/*!40000 ALTER TABLE `researcher` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
