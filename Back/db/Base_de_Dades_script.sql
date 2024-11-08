-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Temps de generació: 08-11-2024 a les 09:39:10
-- Versió del servidor: 10.4.32-MariaDB
-- Versió de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dades: `a21rublormar_tr1_gr6`
--

-- --------------------------------------------------------

--
-- Estructura de la taula `comandes`
--

CREATE TABLE `comandes` (
  `idComanda` int(11) NOT NULL,
  `idUsuari` int(11) NOT NULL,
  `Productes` text NOT NULL,
  `PreuTotal` decimal(10,2) NOT NULL,
  `Estat` enum('PENDENT_DE_PREPARACIO','EN_PREPARACIO','PREPARAT_PER_RECOLLIR','RECOLLIT') NOT NULL,
  `data` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de la taula `producte`
--

CREATE TABLE `producte` (
  `idProducte` int(11) NOT NULL,
  `nomProducte` varchar(100) NOT NULL,
  `Descripcio` text DEFAULT NULL,
  `Preu` decimal(10,2) NOT NULL,
  `Stock` int(11) NOT NULL,
  `Activat` tinyint(1) DEFAULT 1,
  `Imatge` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `producte`
--

INSERT INTO `producte` (`idProducte`, `nomProducte`, `Descripcio`, `Preu`, `Stock`, `Activat`, `Imatge`) VALUES
(1, 'Suc de Taronja', '100% Taronja Natural', 2.99, 40, 1, '1731054288692-195649735.jpg'),
(2, 'Suc de Poma', '100% Poma Natural', 1.99, 70, 1, '1731054498977-728094128.jpg'),
(3, 'Suc de Raïm', '100% Raïm Natural', 3.99, 30, 1, '1731054554345-379940261.jpg'),
(4, 'Suc de Pinya', '100% Pinya Natural', 1.99, 50, 1, '1731054663751-925687697.jpg'),
(5, 'Suc de Maduixa', '100% Maduixa Natural', 2.99, 30, 1, '1731054723574-659375685.jpg');

-- --------------------------------------------------------

--
-- Estructura de la taula `usuari`
--

CREATE TABLE `usuari` (
  `idUser` int(11) NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Correu` varchar(100) NOT NULL,
  `Contrasenya` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `usuari`
--

INSERT INTO `usuari` (`idUser`, `Nom`, `Correu`, `Contrasenya`) VALUES
(1, 'Administrador', 'admin@gmail.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'),
(2, 'Ruben', 'a21rublormar@inspedralbes.cat', '805dbb2eb28966f4e716ff6357dfae13134787abd934a019f0b72a2ba8da939c'),
(3, 'Marti', 'a23marclacas@inspedralbes.cat', '75c5fa09be3f3403de33ae2cd2e5e670bb2d7e448b8091f7a1fde10bc24f8b10'),
(4, 'Marc', 'a18marcastru@inspedralbes.cat', '90b0e227e285a1773f9389284d979da420b7d9fd00335f2d258b91503f455519'),
(5, 'Arnau', 'a22arnmaljoa@inspedralbes.cat', 'fe972e886516974e404e030abfa09deb030fb5df52b97c9020dfabf4ba67514d');

--
-- Índexs per a les taules bolcades
--

--
-- Índexs per a la taula `comandes`
--
ALTER TABLE `comandes`
  ADD PRIMARY KEY (`idComanda`),
  ADD KEY `idUsuari` (`idUsuari`);

--
-- Índexs per a la taula `producte`
--
ALTER TABLE `producte`
  ADD PRIMARY KEY (`idProducte`);

--
-- Índexs per a la taula `usuari`
--
ALTER TABLE `usuari`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `Correu` (`Correu`);

--
-- AUTO_INCREMENT per les taules bolcades
--

--
-- AUTO_INCREMENT per la taula `comandes`
--
ALTER TABLE `comandes`
  MODIFY `idComanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT per la taula `producte`
--
ALTER TABLE `producte`
  MODIFY `idProducte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la taula `usuari`
--
ALTER TABLE `usuari`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restriccions per a les taules bolcades
--

--
-- Restriccions per a la taula `comandes`
--
ALTER TABLE `comandes`
  ADD CONSTRAINT `comandes_ibfk_1` FOREIGN KEY (`idUsuari`) REFERENCES `usuari` (`idUser`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
