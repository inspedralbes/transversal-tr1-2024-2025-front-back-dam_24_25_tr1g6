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

INSERT INTO `producte` (`idProducte`, `nomProducte`, `Descripcio`, `Preu`, `Stock`, `Activat`, `Imatge`, `categoria_id`) VALUES
(1, 'Suc de Taronja ', 'Suc de taronja natural 100%', 1.50, 96, 1, 'orange-juice.jpg', NULL),
(2, 'Suc de Poma', 'Suc de poma natural 100%', 2.00, 82, 1, 'apple-juice.jpg', NULL),
(3, 'Suc de Raïm', 'Suc de raïm natural 100%', 3.00, 72, 1, 'grape-juice.jpg', NULL),
(4, 'Suc de Pinya', 'Suc de pinya natural 100%', 2.5, 65, 1, 'pineapple-juice.jpg', NULL),
(5, 'Suc de Maduixa', 'Suc de maduixa natural 100%', 2.50, 67, 1, 'strawberry-juice.jpg', NULL),
(6, 'Suc de Mango', 'Suc de mango natural 100%', 2.00, 45, 1, 'mango-juice.jpg', NULL),
(7, 'Suc de Meló', 'Suc de meló natural 100%', 1.50, 10, 1, 'melon-juice.jpg', NULL),
(8, 'Suc de Plàtan', 'Suc de plàtan natural 100%', 2.50, 34, 1, 'banana-juice.jpg', NULL),
(9, 'Suc de Mandarina', 'Suc de mandarina natural 100%', 3.50, 87, 1, 'mandarin-juice.jpg', NULL),
(10, 'Suc de Coco', 'Suc de coco natural 100%', 2.00, 67, 1, 'coconut-juice.jpg', NULL),
(11, 'Suc de Mora', 'Suc de mora natural 100%', 3.00, 0, 0, 'blackberry-juice.jpg', NULL),
(12, 'Suc de Pomelo', 'Suc de pomelo natural 100%', 2.50, 94, 1, 'grapefruit-juice.jpg', NULL),
(13, 'Suc de Lima', 'Suc de lima natural 100%', 2.00, 10, 1, 'lime-juice.jpg', NULL),
(14, 'Suc de Síndria', 'Suc de síndria natural 100%', 3.50, 56, 1, 'watermelon-juice.jpg', NULL);

-- --------------------------------------------------------

--
-- Bolcament de dades per a la taula `comandes`
--

INSERT INTO `comandes` (`idComanda`, `idUsuari`, `Productes`, `PreuTotal`, `Estat`, `data`) VALUES
(1, 2, '[{\"idProducte\":1,\"nomProducte\":\"Suc de Taronja\",\"quantitat\":4,\"preuTotalProducte\":6.00},{\"idProducte\":4,\"nomProducte\":\"Suc de Pinya\",\"quantitat\":4,\"preuTotalProducte\":10},{\"idProducte\":7,\"nomProducte\":\"Suc de Meló\",\"quantitat\":2,\"preuTotalProducte\":3.00}]', 18.00, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(2, 3, '[{\"idProducte\":9,\"nomProducte\":\"Suc de Mandarina\",\"quantitat\":5,\"preuTotalProducte\":17.50},{\"idProducte\":2,\"nomProducte\":\"Suc de Poma\",\"quantitat\":3,\"preuTotalProducte\":6.00},{\"idProducte\":1,\"nomProducte\":\"Suc de Taronja\",\"quantitat\":1,\"preuTotalProducte\":1.50}]', 25.00, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(3, 4, '[{\"idProducte\":3,\"nomProducte\":\"Suc de Raïm\",\"quantitat\":3,\"preuTotalProducte\":9.00},{\"idProducte\":6,\"nomProducte\":\"Suc de Mango\",\"quantitat\":3,\"preuTotalProducte\":6.00},{\"idProducte\":7,\"nomProducte\":\"Suc de Meló\",\"quantitat\":1,\"preuTotalProducte\":1.50}]', 15.50, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(4, 1, '[{\"idProducte\":14,\"nomProducte\":\"Suc de Síndria\",\"quantitat\":4,\"preuTotalProducte\":14.00},{\"idProducte\":12,\"nomProducte\":\"Suc de Pomelo\",\"quantitat\":4,\"preuTotalProducte\":10.00},{\"idProducte\":1,\"nomProducte\":\"Suc de Taronja\",\"quantitat\":4,\"preuTotalProducte\":6.00}]', 30.00, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(5, 2, '[{\"idProducte\":5,\"nomProducte\":\"Suc de Maduixa\",\"quantitat\":4,\"preuTotalProducte\":10.00},{\"idProducte\":10,\"nomProducte\":\"Suc de Coco\",\"quantitat\":3,\"preuTotalProducte\":6.00},{\"idProducte\":2,\"nomProducte\":\"Suc de Poma\",\"quantitat\":2,\"preuTotalProducte\":4.00},{\"idProducte\":7,\"nomProducte\":\"Suc de Meló\",\"quantitat\":1,\"preuTotalProducte\":1.00}]', 21.00, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(6, 3, '[{\"idProducte\":2,\"nomProducte\":\"Suc de Poma\",\"quantitat\":5,\"preuTotalProducte\":10.00},{\"idProducte\":12,\"nomProducte\":\"Suc de Pomelo\",\"quantitat\":5,\"preuTotalProducte\":12.50},{\"idProducte\":7,\"nomProducte\":\"Suc de Meló\",\"quantitat\":2,\"preuTotalProducte\":4.00}]', 26.50, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(7, 2, '[{\"idProducte\":4,\"nomProducte\":\"Suc de Pinya\",\"quantitat\":7,\"preuTotalProducte\":17.43},{\"idProducte\":9,\"nomProducte\":\"Suc de Mandarina\",\"quantitat\":2,\"preuTotalProducte\":7.00},{\"idProducte\":8,\"nomProducte\":\"Suc de Plàtan\",\"quantitat\":2,\"preuTotalProducte\":5.00}]', 29.00, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(8, 3, '[{\"idProducte\":13,\"nomProducte\":\"Suc de Lima\",\"quantitat\":5,\"preuTotalProducte\":10.00},{\"idProducte\":10,\"nomProducte\":\"Suc de Coco\",\"quantitat\":4,\"preuTotalProducte\":8.00},{\"idProducte\":1,\"nomProducte\":\"Suc de Taronja\",\"quantitat\":1,\"preuTotalProducte\":1.50}]', 19.50, 'PENDENT_PER_PREPARACIO', '2024-11-10'),
(9, 2, '[{\"idProducte\":11,\"nomProducte\":\"Suc de Mora\",\"quantitat\":4,\"preuTotalProducte\":12.00},{\"idProducte\":14,\"nomProducte\":\"Suc de Síndria\",\"quantitat\":3,\"preuTotalProducte\":10.50},{\"idProducte\":1,\"nomProducte\":\"Suc de Taronja\",\"quantitat\":1,\"preuTotalProducte\":1.50}]', 23.00, 'PENDENT_PER_PREPARACIO', '2024-11-10');


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

-- --------------------------------------------------------

--
-- Estructura de la taula `usuari`
--
  

-- --------------------------------------------------------

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
