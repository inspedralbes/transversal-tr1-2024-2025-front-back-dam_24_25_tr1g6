-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 25-10-2024 a las 08:18:49
-- Versión del servidor: 8.0.39-0ubuntu0.22.04.1
-- Versión de PHP: 8.2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Base de datos: `a21rublormar_TR1_GR6`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
    `idCategoria` int NOT NULL,
    `nom` varchar(100) NOT NULL,
    `descripcio` text,
    `imatge` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comandes`
--

CREATE TABLE `comandes` (
    `idComanda` int NOT NULL,
    `idUsuari` int NOT NULL,
    `Productes` text NOT NULL,
    `PreuTotal` decimal(10, 2) NOT NULL,
    `Estat` enum(
        'Pendent de preparar',
        'En preparació',
        'Preparat per recollir',
        'Recollit'
    ) CHARACTER SET utf8mb4 NOT NULL,
    `data` date NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producte`
--

CREATE TABLE `producte` (
    `idProducte` int NOT NULL,
    `nomProducte` varchar(100) NOT NULL,
    `Descripcio` text,
    `Preu` decimal(10, 2) NOT NULL,
    `Stock` int NOT NULL,
    `Activat` tinyint(1) DEFAULT '1',
    `Imatge` varchar(255) DEFAULT NULL,
    `categoria_id` int DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Volcado de datos para la tabla `producte`
--

INSERT INTO
    `producte` (
        `idProducte`,
        `nomProducte`,
        `Descripcio`,
        `Preu`,
        `Stock`,
        `Activat`,
        `Imatge`,
        `categoria_id`
    )
VALUES (
        1,
        'Orange Juicereajdnajkdn',
        'Freshly squeezed orange juice',
        3.50,
        100,
        1,
        'orange_juice.jpg',
        NULL
    ),
    (
        2,
        'Apple Juice',
        '100% pure apple juice',
        2.75,
        150,
        1,
        'apple_juice.jpg',
        NULL
    ),
    (
        3,
        'Grape Juice',
        'Organic grape juice',
        4.00,
        80,
        1,
        'grape_juice.jpg',
        NULL
    ),
    (
        4,
        'Pineapple Juice',
        'Tropical pineapple juice',
        3.25,
        120,
        1,
        'pineapple_juice.jpg',
        NULL
    ),
    (
        5,
        'prueba1',
        'prueba1',
        3.68,
        60,
        1,
        '',
        NULL
    ),
    (
        6,
        'prueba2',
        'prueba2',
        45.80,
        2,
        1,
        '',
        NULL
    ),
    (
        7,
        'prueba3',
        'prueba3',
        2.00,
        2,
        1,
        '',
        NULL
    ),
    (
        8,
        'prueba4',
        'prueba4',
        4.00,
        45,
        1,
        '',
        NULL
    ),
    (
        9,
        'prueba5',
        'prueba5',
        4.50,
        56,
        1,
        '',
        NULL
    ),
    (
        10,
        'prueba7',
        'prueba7',
        2.50,
        2,
        1,
        '',
        NULL
    );

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuari`
--

CREATE TABLE `usuari` (
    `idUser` int NOT NULL,
    `Nom` varchar(100) NOT NULL,
    `Correu` varchar(100) NOT NULL,
    `Contrasenya` varchar(255) NOT NULL,
    `Targeta` varchar(16) DEFAULT NULL,
    `admin` int NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Volcado de datos para la tabla `usuari`
--

INSERT INTO
    `usuari` (
        `idUser`,
        `Nom`,
        `Correu`,
        `Contrasenya`,
        `Targeta`,
        `admin`
    )
VALUES (
        1,
        'User1',
        'a21rublormar@inspedralbes.cat',
        'password1',
        '1234567812345678',
        1
    ),
    (
        2,
        'User2',
        'a23marclacas@inspedralbes.cat',
        'password2',
        '2345678923456789',
        1
    ),
    (
        3,
        'User3',
        'a18marcastru@inspedralbes.cat',
        'password3',
        '3456789034567890',
        1
    ),
    (
        4,
        'User4',
        'a22arnmaljoa@inspedralbes.cat',
        'password4',
        '4567890145678901',
        1
    );

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories` ADD PRIMARY KEY (`idCategoria`);

--
-- Indices de la tabla `comandes`
--
ALTER TABLE `comandes`
ADD PRIMARY KEY (`idComanda`),
ADD KEY `idUsuari` (`idUsuari`);

--
-- Indices de la tabla `producte`
--
ALTER TABLE `producte`
ADD PRIMARY KEY (`idProducte`),
ADD KEY `fk_categoria` (`categoria_id`);

--
-- Indices de la tabla `usuari`
--
ALTER TABLE `usuari`
ADD PRIMARY KEY (`idUser`),
ADD UNIQUE KEY `Correu` (`Correu`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
MODIFY `idCategoria` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comandes`
--
ALTER TABLE `comandes`
MODIFY `idComanda` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producte`
--
ALTER TABLE `producte`
MODIFY `idProducte` int NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 11;

--
-- AUTO_INCREMENT de la tabla `usuari`
--
ALTER TABLE `usuari`
MODIFY `idUser` int NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comandes`
--
ALTER TABLE `comandes`
ADD CONSTRAINT `comandes_ibfk_1` FOREIGN KEY (`idUsuari`) REFERENCES `usuari` (`idUser`);

--
-- Filtros para la tabla `producte`
--
ALTER TABLE `producte`
ADD CONSTRAINT `fk_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categories` (`idCategoria`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;