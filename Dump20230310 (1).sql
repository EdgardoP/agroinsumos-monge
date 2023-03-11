CREATE DATABASE  IF NOT EXISTS `agroinsumos_monge` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `agroinsumos_monge`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: agroinsumos_monge
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `bitacoras`
--

DROP TABLE IF EXISTS `bitacoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacoras` (
  `bitacora_id` int NOT NULL AUTO_INCREMENT,
  `bitacora_usuario_fk` int DEFAULT NULL,
  `bitacora_modulo` varchar(25) NOT NULL,
  `bitacora_accion` varchar(25) NOT NULL,
  `bitacora_fecha` date NOT NULL,
  `bitacora_hora` time NOT NULL,
  PRIMARY KEY (`bitacora_id`),
  KEY `bitacora_usuario_fk_idx` (`bitacora_usuario_fk`),
  CONSTRAINT `bitacora_usuario_fk` FOREIGN KEY (`bitacora_usuario_fk`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacoras`
--

LOCK TABLES `bitacoras` WRITE;
/*!40000 ALTER TABLE `bitacoras` DISABLE KEYS */;
/*!40000 ALTER TABLE `bitacoras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `categoria_nombre` varchar(75) NOT NULL,
  `categoria_descripcion` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (6,'Insumos','Comidas'),(7,'Abonos de Tierra','Abono de todo tipo'),(8,'Insumos','Insumos Agricolas'),(15,'','');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `cliente_id` int NOT NULL AUTO_INCREMENT,
  `cliente_nombre` varchar(45) NOT NULL,
  `cliente_apellido` varchar(45) DEFAULT NULL,
  `cliente_referencia` varchar(100) DEFAULT NULL,
  `cliente_estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`cliente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (30,'Jose Edgardo','Portillo','1234','Activo'),(31,'','','','Activo'),(32,'as','','','Activo'),(33,'as','as','1234','Activo'),(34,'as','as','ds','Activo'),(35,'','','','Activo'),(36,'','','','Activo'),(37,'','','','Activo'),(38,'','','dadas','Activo'),(39,'','','','Activo'),(40,'','','','Activo');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entradas`
--

DROP TABLE IF EXISTS `entradas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entradas` (
  `entradas_id` int NOT NULL AUTO_INCREMENT,
  `entradas_fecha` date NOT NULL,
  `entradas_lote_fk` int DEFAULT NULL,
  `entrada_stock_antiguo` int DEFAULT NULL,
  `entrada_cantidad_ingresar` int NOT NULL,
  `entrada_tipo_pago` varchar(50) NOT NULL,
  `entrada_otros_gastos` int DEFAULT NULL,
  `entrada_usuario_fk` int DEFAULT NULL,
  `entrada_num_serie` double DEFAULT NULL,
  PRIMARY KEY (`entradas_id`),
  KEY `entradas_lote_fk_idx` (`entradas_lote_fk`),
  KEY `entradas_usuario_fk_idx` (`entrada_usuario_fk`),
  CONSTRAINT `entradas_lote_fk` FOREIGN KEY (`entradas_lote_fk`) REFERENCES `lotes` (`lote_id`),
  CONSTRAINT `entradas_usuario_fk` FOREIGN KEY (`entrada_usuario_fk`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=447 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entradas`
--

LOCK TABLES `entradas` WRITE;
/*!40000 ALTER TABLE `entradas` DISABLE KEYS */;
INSERT INTO `entradas` VALUES (421,'2023-02-28',92,0,10,'Contado',20,1,6439.329080088446),(422,'2023-02-28',93,0,100,'Contado',0,1,1607.2067139415255),(423,'2023-02-28',92,0,10,'Contado',0,1,9634.8274690485),(424,'2023-03-01',92,10,10,'Contado',0,1,5776.3072498805095),(425,'2023-03-01',92,10,10,'Contado',0,1,5776.3072498805095),(426,'2023-03-01',92,30,10,'Contado',0,1,6211.472176244978),(427,'2023-03-01',92,40,10,'Contado',0,1,8396.866182094484),(428,'2023-03-01',92,50,12,'-1',0,1,8933.608624119779),(429,'2023-03-01',92,62,10,'Contado',0,1,5315.1807389396845),(430,'2023-03-01',92,72,12,'Contado',0,1,8019.2491849758335),(431,'2023-03-01',92,84,10,'Contado',0,1,6148.769247184982),(432,'2023-03-01',96,20,10,'Contado',0,1,7380.598155731688),(433,'2023-03-01',92,94,10,'Contado',0,1,2314.3937676557152),(434,'2023-03-01',92,104,0,'Contado',0,1,1088.167295344181),(435,'2023-03-02',99,0,100,'Contado',0,1,8233.589388386514),(436,'2023-03-05',96,10,12,'Deposito',12,1,4787.600726375063),(437,'2023-03-05',97,12,12,'Contado',0,1,4787.600726375063),(438,'2023-03-05',93,68,69,'Contado',0,1,4787.600726375063),(439,'2023-03-06',96,22,12,'Contado',0,1,7379.3686364727255),(440,'2023-03-06',96,22,100,'Contado',100,1,7379.3686364727255),(441,'2023-03-06',103,0,60,'Deposito',0,1,1758.6241994989796),(442,'2023-03-07',93,137,12,'Contado',0,1,4366.771280064073),(443,'2023-03-07',93,149,10,'Contado',0,1,5651.683045440155),(444,'2023-03-08',96,134,100,'Deposito',0,1,4832.546125798865),(445,'2023-03-08',107,12,40,'Deposito',0,1,4832.546125798865),(446,'2023-03-09',96,234,200,'Credito',0,1,8366.247601312101);
/*!40000 ALTER TABLE `entradas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_clientes`
--

DROP TABLE IF EXISTS `historial_clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_clientes` (
  `historial_cliente_id` int NOT NULL AUTO_INCREMENT,
  `historial_cliente_fk` int DEFAULT NULL,
  `historial_cliente_fecha` date DEFAULT NULL,
  `historial_cliente_detalle` varchar(100) DEFAULT NULL,
  `historial_cliente_saldo_anterior` double DEFAULT NULL,
  `historial_cliente_aportacion` double DEFAULT NULL,
  `historial_cliente_saldo_nuevo` double DEFAULT NULL,
  `historial_cliente_tipo_aportacion` varchar(45) DEFAULT NULL,
  `historial_cliente_usuario_fk` int DEFAULT NULL,
  KEY `historial_cliente_usuario_fk_idx` (`historial_cliente_usuario_fk`),
  KEY `historial_cliente_fk_idx` (`historial_cliente_id`),
  KEY `historial_cliente_fk_idx1` (`historial_cliente_fk`),
  CONSTRAINT `historial_cliente_fk` FOREIGN KEY (`historial_cliente_fk`) REFERENCES `clientes` (`cliente_id`),
  CONSTRAINT `historial_cliente_usuario_fk` FOREIGN KEY (`historial_cliente_usuario_fk`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_clientes`
--

LOCK TABLES `historial_clientes` WRITE;
/*!40000 ALTER TABLE `historial_clientes` DISABLE KEYS */;
INSERT INTO `historial_clientes` VALUES (58,30,'2023-02-28','Cliente Agregado Exitosamente',0,0,0,'0',1),(64,31,'2023-03-03','Cliente Agregado Exitosamente',0,0,0,'0',1),(65,32,'2023-03-03','Cliente Agregado Exitosamente',0,0,0,'0',1),(66,33,'2023-03-03','Cliente Agregado Exitosamente',0,0,0,'0',1),(67,34,'2023-03-06','Cliente Agregado Exitosamente',0,0,0,'0',1),(68,35,'2023-03-08','Cliente Agregado Exitosamente',0,0,0,'0',1),(69,36,'2023-03-08','Cliente Agregado Exitosamente',0,0,0,'0',1),(70,37,'2023-03-09','Cliente Agregado Exitosamente',0,0,0,'0',1),(71,38,'2023-03-09','Cliente Agregado Exitosamente',0,0,0,'0',1),(72,39,'2023-03-09','Cliente Agregado Exitosamente',0,0,0,'0',1),(73,40,'2023-03-09','Cliente Agregado Exitosamente',0,0,0,'0',1),(74,30,'2023-03-09','Pago',0,-123,-123,'Contado',NULL),(75,30,'2023-03-09','pago',-123,-1200,-1323,'Contado',NULL),(76,30,'2023-03-09','as',-1323,-1234,-2557,'Contado',NULL),(77,30,'2023-03-09','asdads',-2557,-23213,-25770,'Contado',NULL),(78,30,'2023-03-09','sadads',-25.77,-2333,-2358,'Deposito',NULL),(79,30,'2023-03-09','fdfd',-2358,-4000,-6358,'Contado',NULL),(80,30,'2023-03-09','assa',-6358,6350,-8,'Contado',NULL),(81,30,'2023-03-09','as',-8,8,0,'Contado',NULL);
/*!40000 ALTER TABLE `historial_clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_proveedores`
--

DROP TABLE IF EXISTS `historial_proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_proveedores` (
  `historial_proveedor_id` int NOT NULL AUTO_INCREMENT,
  `historial_proveedor_fk` int DEFAULT NULL,
  `historial_proveedor_fecha` date DEFAULT NULL,
  `historial_proveedor_detalle` varchar(100) DEFAULT NULL,
  `historial_proveedor_saldo_anterior` double DEFAULT NULL,
  `historial_proveedor_aportacion` double DEFAULT NULL,
  `historial_proveedor_saldo_nuevo` double DEFAULT NULL,
  `historial_proveedor_tipo_aportacion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`historial_proveedor_id`),
  KEY `historial_proveedor_fk_idx` (`historial_proveedor_fk`),
  CONSTRAINT `historial_proveedor_fk` FOREIGN KEY (`historial_proveedor_fk`) REFERENCES `proveedores` (`proveedor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=296 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_proveedores`
--

LOCK TABLES `historial_proveedores` WRITE;
/*!40000 ALTER TABLE `historial_proveedores` DISABLE KEYS */;
INSERT INTO `historial_proveedores` VALUES (287,28,'2023-02-27','Proveedor Agregado Exitosamente',0,0,0,'0'),(288,29,'2023-03-09','Proveedor Agregado Exitosamente',0,0,0,'0'),(289,30,'2023-03-09','Proveedor Agregado Exitosamente',0,0,0,'0'),(290,28,'2023-03-09','Cafe Libra 10 x 200',0,2000,2000,'Credito'),(291,28,'2023-03-09','sdds',2000,1221,779,'Contado'),(292,28,'2023-03-09','asas',779,799,-20,'Contado'),(293,28,'2023-03-09','wqwq',-20,-20,0,'Contado'),(294,28,'2023-03-09','dsdsds',0,1000,-1000,'Contado'),(295,28,'2023-03-09','sad',-1000,21,-1021,'Contado');
/*!40000 ALTER TABLE `historial_proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lotes`
--

DROP TABLE IF EXISTS `lotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lotes` (
  `lote_id` int NOT NULL AUTO_INCREMENT,
  `lote_producto_fk` int DEFAULT NULL,
  `lote_cantidad` int NOT NULL,
  `lote_valor_unitario_compra` double NOT NULL,
  `lote_valor_unitario_venta` double NOT NULL,
  `lote_presentacion` varchar(20) NOT NULL,
  `lote_ultima_actualizacion` date NOT NULL,
  `lote_fecha_vencimiento` date DEFAULT NULL,
  `lote_estado` varchar(15) NOT NULL,
  PRIMARY KEY (`lote_id`),
  KEY `lote_producto_fk_idx` (`lote_producto_fk`),
  CONSTRAINT `lote_producto_fk` FOREIGN KEY (`lote_producto_fk`) REFERENCES `productos` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='				';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lotes`
--

LOCK TABLES `lotes` WRITE;
/*!40000 ALTER TABLE `lotes` DISABLE KEYS */;
INSERT INTO `lotes` VALUES (90,91,60,20,30,'Botella','2023-02-27','2023-02-27','Activo'),(91,92,100,40,70,'Libra','2023-02-27','2023-02-04','Activo'),(92,94,-5,10,20,'Caja','2023-02-28','2023-02-01','Activo'),(93,94,139,20,30,'Caja','2023-02-28','2023-02-18','Inactivo'),(94,94,0,40,30,'Libra','2023-02-28','2023-02-18','Inactivo'),(95,94,10,8,15,'-1','2023-02-28','2023-02-18','Inactivo'),(96,94,434,10,20,'Libra','2023-02-28','2023-02-18','Activo'),(97,94,0,8.333333333333334,12,'Botella','2023-03-01','2023-02-01','Inactivo'),(98,96,0,10,20,'Lata','2023-03-01','2023-03-02','Activo'),(99,99,88,500,700,'Saco','2023-03-02','2023-03-31','Activo'),(100,101,0,12,12,'Libra','2023-03-03','2023-03-01','Activo'),(101,102,0,12,12,'Libra','2023-03-03','2023-03-01','Activo'),(102,94,0,12,12,'Caja','2023-03-03','2023-03-02','Inactivo'),(103,103,60,10.5,15,'Saco','2023-03-06','2023-03-01','Activo'),(104,106,12,12,12,'Saco','2023-03-07','2023-03-17','Activo'),(105,107,2,12,12,'Frasco','2023-03-07','2022-12-11','Inactivo'),(106,94,20,10,30,'Libra','2023-03-08','2023-02-18','Activo'),(107,94,52,8,12,'Unidad','2023-03-08','2023-02-01','Activo');
/*!40000 ALTER TABLE `lotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planillas`
--

DROP TABLE IF EXISTS `planillas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planillas` (
  `planilla_id` int NOT NULL AUTO_INCREMENT,
  `planilla_fecha_ini` date DEFAULT NULL,
  `planilla_fecha_fin` date DEFAULT NULL,
  `planilla_sueldo_base` double DEFAULT NULL,
  `planilla_horas_extras` int DEFAULT NULL,
  `planilla_bonificaciones` double DEFAULT NULL,
  `planilla_deducciones` double DEFAULT NULL,
  `planilla_usuario_fk` int DEFAULT NULL,
  `planilla_nombre_empleado` varchar(100) DEFAULT NULL,
  `planilla_codigo` double DEFAULT NULL,
  PRIMARY KEY (`planilla_id`),
  KEY `planilla_usuario_fk_idx` (`planilla_usuario_fk`),
  CONSTRAINT `planilla_usuario_fk` FOREIGN KEY (`planilla_usuario_fk`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planillas`
--

LOCK TABLES `planillas` WRITE;
/*!40000 ALTER TABLE `planillas` DISABLE KEYS */;
INSERT INTO `planillas` VALUES (6,'2023-02-01','2023-02-09',2000,1,1,1,1,'Jose Edgardo',9369.373555501941),(7,'2023-02-01','2023-02-09',1,1,1,1,1,'Francisco Franco',9369.373555501941),(8,'2023-02-17','2023-02-09',1,1,1,1,1,'sael',2611.1879926746856),(9,'2023-03-01','2023-03-15',7000,0,0,0,1,'Francisco',8070.503673217452),(10,'2023-03-09','2023-03-10',2000,5,1000,500,1,'Jose',5548.641678221485),(11,'2023-03-09','2023-03-10',2000,1,0,0,1,'Jose',9708.71960995803),(12,'2023-03-09','2023-03-10',3000,5,0,0,1,'Medardo',9708.71960995803);
/*!40000 ALTER TABLE `planillas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `producto_id` int NOT NULL AUTO_INCREMENT,
  `producto_nombre` varchar(45) NOT NULL,
  `producto_descripcion` varchar(70) DEFAULT NULL,
  `producto_proveedor_fk` int DEFAULT NULL,
  `producto_color` varchar(15) DEFAULT NULL,
  `producto_categoria_fk` int DEFAULT NULL,
  PRIMARY KEY (`producto_id`),
  KEY `producto_proveedor_fk_idx` (`producto_proveedor_fk`),
  KEY `producto_categoria_fk_idx` (`producto_categoria_fk`),
  CONSTRAINT `producto_categoria_fk` FOREIGN KEY (`producto_categoria_fk`) REFERENCES `categorias` (`categoria_id`),
  CONSTRAINT `producto_proveedor_fk` FOREIGN KEY (`producto_proveedor_fk`) REFERENCES `proveedores` (`proveedor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (91,'Dectomax','Dectomax',28,'Amarillo',6),(92,'Doggy','Doggy Adulto',28,'Amarillo',6),(93,'Cafe','Cafe en bolsa',28,'Azul',6),(94,'Cafe','Cafe en bolsa',28,'NN',6),(95,'Arroz','Arroz Largo',28,'Verde',7),(96,'Arroz','Arroz Largo',28,'Verde',7),(99,'Doggy','Doggy Morad',28,'NN',8),(101,'as','sa',28,'Azul',6),(102,'ds','sd',28,'NN',6),(103,'Ariel','Jabon Liquido',28,'Azul',8),(104,'Semillas Girasol','Semillas de palo',28,'Azul',7),(105,'as','as',28,'Verde',6),(106,'as','as',28,'Amarillo',6),(107,'Botones','botones de precision',28,'Azul',7);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `proveedor_id` int NOT NULL AUTO_INCREMENT,
  `proveedor_nombre` varchar(45) NOT NULL,
  `proveedor_numero` bigint DEFAULT NULL,
  `proveedor_estado` varchar(45) NOT NULL,
  PRIMARY KEY (`proveedor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (28,'Casa Ferco',95129812,'Activo'),(29,'Jose',12121212,'Activo'),(30,'asdasd',1212,'Activo');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salidas`
--

DROP TABLE IF EXISTS `salidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salidas` (
  `salida_id` int NOT NULL AUTO_INCREMENT,
  `salida_fecha` date NOT NULL,
  `salida_lote_fk` int DEFAULT NULL,
  `salida_cantidad` int NOT NULL,
  `salida_tipo_pago` varchar(50) NOT NULL,
  `salida_usuario_fk` int DEFAULT NULL,
  `salida_num_serie` double DEFAULT NULL,
  PRIMARY KEY (`salida_id`),
  KEY `salida_lote_fk_idx` (`salida_lote_fk`),
  KEY `salida_usuario_fk_idx` (`salida_usuario_fk`),
  CONSTRAINT `salida_lote_fk` FOREIGN KEY (`salida_lote_fk`) REFERENCES `lotes` (`lote_id`),
  CONSTRAINT `salida_usuario_fk` FOREIGN KEY (`salida_usuario_fk`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salidas`
--

LOCK TABLES `salidas` WRITE;
/*!40000 ALTER TABLE `salidas` DISABLE KEYS */;
INSERT INTO `salidas` VALUES (46,'2023-02-28',94,5,'Deposito',1,4514.893781728044),(47,'2023-02-28',93,5,'Contado',1,5304.448240520524),(48,'2023-02-28',92,10,'Contado',1,6122.6254932994725),(49,'2023-03-01',92,4,'Credito',1,2184.1805226306938),(50,'2023-03-02',92,10,'Contado',1,6945.940787979748),(51,'2023-03-02',90,40,'Contado',1,1174.5892543840703),(52,'2023-02-28',92,10,'Contado',1,8977.168485355498),(53,'2023-02-27',92,55,'Deposito',1,6076.094718553813),(54,'2023-03-02',92,10,'Credito',1,8918.81161870027),(55,'2023-02-27',92,10,'Credito',1,4008.9281196585775),(56,'2023-02-27',99,10,'Contado',1,7949.792286808806),(57,'2023-03-02',96,10,'Credito',1,2860.2675915381737),(58,'2023-02-27',96,10,'Credito',1,3750.5647879251073),(59,'2023-02-27',99,2,'Credito',1,3778.4265062645686),(60,'2023-03-07',97,12,'Deposito',1,865.3584304822267),(61,'2023-03-07',93,10,'Contado',1,4738.734993141249),(62,'2023-03-08',105,10,'Contado',1,4540.956657219949);
/*!40000 ALTER TABLE `salidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `usuario_nombre` varchar(45) NOT NULL,
  `usuario_contraseña` varchar(45) NOT NULL,
  `usuario_ultima_actualizacion` date NOT NULL,
  PRIMARY KEY (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'edgardo','edgardo','2023-01-21');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'agroinsumos_monge'
--
/*!50003 DROP PROCEDURE IF EXISTS `aportacionesDelDia` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `aportacionesDelDia`(fecha date)
BEGIN
	select * from historial_clientes where historial_cliente_fecha = fecha;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `documentos_historial_clientes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `documentos_historial_clientes`(in indice int)
BEGIN
	SELECT 
	cliente_nombre,
    cliente_apellido,
    cliente_referencia,
	cliente_id,
	cliente_estado, 
	historial_cliente_saldo_nuevo,
	historial_cliente_fecha
	FROM historial_clientes
	inner join clientes on historial_cliente_fk = cliente_id 
	where historial_cliente_fk = indice 
	ORDER  BY historial_cliente_id DESC LIMIT 1 ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `documentos_historial_proveedores` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `documentos_historial_proveedores`(in indice int)
BEGIN
	SELECT 
	proveedor_nombre,
	proveedor_id,
	proveedor_estado, 
	historial_proveedor_saldo_nuevo,
	historial_proveedor_fecha
	FROM historial_proveedores
	inner join proveedores on historial_proveedor_fk = proveedor_id 
	where historial_proveedor_fk = indice 
	ORDER  BY historial_proveedor_id DESC LIMIT 1 ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `documento_entrada_historial` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `documento_entrada_historial`(id double)
BEGIN
	select producto_id, lote_id ,entradas_fecha, producto_nombre,lote_presentacion, lote_valor_unitario_compra,entrada_cantidad_ingresar, entrada_stock_antiguo,(entrada_cantidad_ingresar + entrada_stock_antiguo) as stock_actualizado, entrada_otros_gastos,entrada_tipo_pago, 
	((entrada_cantidad_ingresar * lote_valor_unitario_compra) + entrada_otros_gastos) as sub_total 
	from entradas
	inner join lotes on entradas_lote_fk = lote_id
	inner join productos on lote_producto_fk = producto_id
	where entrada_num_serie = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `documento_historial_salidas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `documento_historial_salidas`(id double)
BEGIN
	select producto_id, producto_nombre,lote_presentacion, lote_valor_unitario_venta,salida_cantidad, salida_tipo_pago, salida_fecha,
	salida_cantidad * lote_valor_unitario_venta as sub_total
	from salidas
	inner join lotes on salida_lote_fk = lote_id
	inner join productos on lote_producto_fk = producto_id
	where salida_num_serie = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `historial_clientes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `historial_clientes`(in id int, fechaIni date, fechaFin date)
BEGIN
SELECT cliente_nombre, 
cliente_apellido,
cliente_referencia,
historial_cliente_fecha, 
historial_cliente_detalle,
historial_cliente_saldo_anterior,
historial_cliente_aportacion,
historial_cliente_saldo_nuevo,
historial_cliente_tipo_aportacion
from historial_clientes
inner join clientes on historial_cliente_fk = cliente_id
where cliente_id = id and historial_cliente_fecha between fechaIni and fechaFin order by historial_cliente_id asc
Limit 0,1000;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `historial_de_productos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `historial_de_productos`(in proveedor varchar(40),in presentacion varchar(40),in color varchar(40),in categoria varchar(40))
BEGIN
	select producto_id,lote_id, producto_nombre,producto_descripcion, producto_color,lote_presentacion,lote_cantidad,lote_valor_unitario_compra,lote_valor_unitario_venta,categoria_nombre,proveedor_nombre,lote_fecha_vencimiento from productos 
	inner join lotes on lote_producto_fk = producto_id
	inner join proveedores on producto_proveedor_fk = proveedor_id
	inner join categorias on producto_categoria_fk = categoria_id
	where proveedor_id LIKE proveedor and lote_presentacion LIKE presentacion and producto_color LIKE color and categoria_id LIKE categoria and lote_estado = 'Activo'
    order by producto_id asc ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `historial_entradas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `historial_entradas`(fechaIni date, fechaFin date)
BEGIN
	select distinct entrada_num_serie as numero_serie, (entrada_cantidad_ingresar * lote_valor_unitario_compra) + entrada_otros_gastos as gastos_totales,entradas_fecha
	from entradas inner join lotes on entradas_lote_fk = lote_id
    where entradas_fecha between fechaIni and fechaFin order by entradas_fecha desc
    Limit 0, 1000;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `historial_planillas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `historial_planillas`()
BEGIN
	select distinct planilla_codigo as codigo, planilla_fecha_ini, planilla_fecha_fin
	from planillas 
	order by planilla_fecha_ini desc
	Limit 0, 1000;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `historial_proveedor` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `historial_proveedor`(in id int, fechaIni date, fechaFin date)
BEGIN
SELECT proveedor_id,
proveedor_nombre, 
proveedor_numero,
historial_proveedor_fecha, 
historial_proveedor_detalle,
historial_proveedor_saldo_anterior,
historial_proveedor_aportacion,
historial_proveedor_saldo_nuevo,
historial_proveedor_tipo_aportacion
from historial_proveedores
inner join proveedores on historial_proveedor_fk = proveedor_id 
where proveedor_id = id and historial_proveedor_fecha between fechaIni and fechaFin order by historial_proveedor_id asc
Limit 0, 1000;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `historial_salidas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `historial_salidas`(fechaIni date, fechaFin date)
BEGIN
	select distinct salida_num_serie as numero_serie, salida_fecha
	from salidas inner join lotes on salida_lote_fk = lote_id
	where salida_fecha between fechaIni and fechaFin order by salida_fecha desc
    Limit 0, 1000;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `iniciarSesion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `iniciarSesion`(usuario VARCHAR(50),contraseña VARCHAR(50))
BEGIN
	SELECT * FROM usuarios
    WHERE usuario_nombre = usuario 
    and usuario_contraseña = contraseña;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertar_historial_cliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_historial_cliente`(idCliente int,aportacion int,fecha date,detalles varchar(100),tipo_pago varchar(30),usuario int)
BEGIN
	declare saldo_anterior double;
    declare saldo_nuevo double; 
    set saldo_anterior =  (SELECT historial_cliente_saldo_nuevo FROM historial_clientes where historial_cliente_fk = idCliente ORDER  BY historial_cliente_id DESC LIMIT 1 );
	set saldo_nuevo = saldo_anterior + aportacion;
    INSERT INTO historial_clientes (historial_cliente_fk,historial_cliente_fecha,historial_cliente_detalle,historial_cliente_saldo_anterior,historial_cliente_aportacion,historial_cliente_saldo_nuevo,historial_cliente_tipo_aportacion,historial_cliente_usuario_fk)
    VALUES(idCliente,fecha,detalles,saldo_anterior,aportacion,saldo_nuevo,tipo_pago,usuario);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertar_historial_proveedor` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_historial_proveedor`(idProveedor int,aportacion int,fecha date,detalles varchar(100),tipo_pago varchar(30))
BEGIN
	declare saldo_anterior float;
    declare saldo_nuevo float; 
    set saldo_anterior =  (SELECT  historial_proveedor_saldo_nuevo FROM historial_proveedores where historial_proveedor_fk = idProveedor ORDER  BY historial_proveedor_id DESC LIMIT 1 );
	set saldo_nuevo = saldo_anterior + aportacion;
    INSERT INTO historial_proveedores 
    (historial_proveedor_fk,historial_proveedor_fecha,historial_proveedor_detalle,historial_proveedor_saldo_anterior,historial_proveedor_aportacion,historial_proveedor_saldo_nuevo,historial_proveedor_tipo_aportacion)
    VALUES(idProveedor,fecha,detalles,saldo_anterior,aportacion,saldo_nuevo,tipo_pago);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `lista_de_categorias` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `lista_de_categorias`()
BEGIN
	select * from categorias;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `lista_de_productos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `lista_de_productos`()
BEGIN
select lote_id,producto_id,producto_nombre,producto_descripcion,lote_presentacion,lote_cantidad,lote_valor_unitario_compra,lote_valor_unitario_venta,lote_fecha_vencimiento, proveedor_id,proveedor_nombre from lotes
inner join productos on lote_producto_fk = producto_id
inner join proveedores on producto_proveedor_fk = proveedor_id
where lote_estado = 'Activo';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `mostrar_planilla_documento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `mostrar_planilla_documento`(id double)
BEGIN
	select * from planillas where planilla_codigo = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `obtener_proveedores` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `obtener_proveedores`()
BEGIN
	SELECT * FROM proveedores where proveedor_estado = 'Activo';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `recuperaciones_clientes_dia` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `recuperaciones_clientes_dia`(fecha date)
BEGIN
	select cliente_nombre,cliente_apellido,historial_cliente_detalle, historial_cliente_aportacion, historial_cliente_tipo_aportacion from clientes
	inner join historial_clientes on historial_cliente_fk = cliente_id
	where historial_cliente_fecha = fecha;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `salariosDelMes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `salariosDelMes`(anio int, mes int)
BEGIN
 select sum(planilla_sueldo_base) as total_salarios from planillas
 where YEAR(planilla_fecha_ini) = anio and YEAR(planilla_fecha_fin) = anio and MONTH(planilla_fecha_fin) = mes;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `salidas_del_dia` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `salidas_del_dia`(fecha date)
BEGIN
	select salida_cantidad, producto_id, producto_nombre, lote_valor_unitario_venta, (lote_valor_unitario_venta * salida_cantidad ) as total, salida_tipo_pago
	from salidas
	inner join lotes on salida_lote_fk = lote_id 
	inner join productos on lote_producto_fk = producto_id
	where salida_fecha = fecha;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sumar_cantidad_lotes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sumar_cantidad_lotes`(id int, cantidad int )
BEGIN
	declare cantidad_anterior int;
    declare total int;
    declare cantidad_ingresar int;
    set cantidad_ingresar = cantidad;
    set cantidad_anterior = (select lote_cantidad  from lotes where lote_id = id);
	set total = (cantidad_ingresar) + (cantidad_anterior);
	UPDATE lotes SET lote_cantidad = total where lote_id = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ventasDelDia` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ventasDelDia`(fecha date)
BEGIN
	select producto_id,producto_nombre,salida_fecha,salida_cantidad, 
    lote_valor_unitario_venta,(salida_cantidad * lote_valor_unitario_venta) as total_venta,
    lote_valor_unitario_compra, salida_tipo_pago, salida_num_serie from salidas 
	inner join lotes on salida_lote_fk = lote_id
    inner join productos on lote_producto_fk = producto_id
	where salida_fecha =  fecha;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ventas_mensuales` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ventas_mensuales`(anio int, mes int)
BEGIN
	select * from salidas
	where YEAR(salida_fecha) = anio and MONTH(salida_fecha) = mes;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ventas_mensuales_contado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ventas_mensuales_contado`(anio int, mes int)
BEGIN
	select producto_nombre, lote_id,sum(salida_cantidad) as cantidad_producto,
    sum(salida_cantidad) * lote_valor_unitario_venta as total_ventas,
    lote_valor_unitario_venta, 
    lote_valor_unitario_compra * sum(salida_cantidad) as costo_total_compras,
    sum(salida_cantidad) * lote_valor_unitario_venta - lote_valor_unitario_compra * sum(salida_cantidad) as utilidad_bruta,
    lote_presentacion from salidas
    inner join lotes on salida_lote_fk = lote_id
	inner join productos on lote_producto_fk = producto_id
    where YEAR(salida_fecha) = anio and MONTH(salida_fecha) = mes and not salida_tipo_pago = 'Credito'
	group by lote_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ventas_mensuales_credito` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ventas_mensuales_credito`(anio int, mes int)
BEGIN
	select producto_nombre, lote_id,sum(salida_cantidad) as cantidad_producto,
    sum(salida_cantidad) * lote_valor_unitario_venta as total_ventas,
    lote_valor_unitario_venta, 
    lote_valor_unitario_compra * sum(salida_cantidad) as costo_total_compras,
    sum(salida_cantidad) * lote_valor_unitario_venta - lote_valor_unitario_compra * sum(salida_cantidad) as utilidad_bruta,
    lote_presentacion from salidas
    inner join lotes on salida_lote_fk = lote_id
	inner join productos on lote_producto_fk = producto_id
    where YEAR(salida_fecha) = anio and MONTH(salida_fecha) = mes and salida_tipo_pago = 'Credito'
	group by lote_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ventas_mensuales_credito_contado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ventas_mensuales_credito_contado`(anio int, mes int)
BEGIN
	select producto_nombre, 
    sum(salida_cantidad) as cantidad_producto, 
    sum(salida_cantidad) * lote_valor_unitario_venta as total_ventas,
    lote_valor_unitario_venta, lote_valor_unitario_compra * sum(salida_cantidad) as costo_total_compras,
    sum(salida_cantidad) * lote_valor_unitario_venta - lote_valor_unitario_compra * sum(salida_cantidad) as utilidad_bruta,
    lote_presentacion, salida_tipo_pago from salidas
	inner join lotes on salida_lote_fk = lote_id
	inner join productos on lote_producto_fk = producto_id
	where YEAR(salida_fecha) = anio and MONTH(salida_fecha) = mes
	group by lote_id, salida_tipo_pago;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-10 20:57:52
