-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-03-2025 a las 21:40:37
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` int(11) NOT NULL,
  `id_sesion` varchar(255) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id`, `id_sesion`, `producto_id`, `cantidad`, `fecha_agregado`) VALUES
(10, '01e8r6ok9dpan510vokludp98a', 8, 1, '2025-02-26 01:51:08'),
(16, '90s3l4edajfb7hkmlpc79cengi', 6, 1, '2025-02-27 06:03:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL,
  `cliente_nombre` varchar(100) NOT NULL,
  `tipo_documento` varchar(20) NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` text NOT NULL,
  `tipo_comprobante` varchar(20) NOT NULL,
  `ruc` varchar(11) DEFAULT NULL,
  `razon_social` varchar(100) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(20) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id_compra`, `cliente_nombre`, `tipo_documento`, `numero_documento`, `correo`, `telefono`, `direccion`, `tipo_comprobante`, `ruc`, `razon_social`, `total`, `metodo_pago`, `fecha`) VALUES
(8, 'Diego Chinchay Quispe', 'DNI', '87654321', 'diego10julio@gmail.com', '942322630', 'Direccion1, San Juan Bautista, Ica, Ica', 'factura', '11111111111', 'abcd', 5227.90, 'paypal', '2025-02-28 05:44:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compras`
--

CREATE TABLE `detalle_compras` (
  `id_detalle` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `producto` varchar(100) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compras`
--

INSERT INTO `detalle_compras` (`id_detalle`, `id_compra`, `producto`, `cantidad`, `precio`, `subtotal`) VALUES
(10, 8, 'Zapatilla Y-3 Gendo', 2, 2599.00, 5198.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `categoria` enum('zapatillas','zapatos') NOT NULL,
  `marca` varchar(100) NOT NULL,
  `genero` enum('masculino','femenino') NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `imagen`, `precio`, `categoria`, `marca`, `genero`, `stock`) VALUES
(1, 'Zapatilla Air Force 1', 'recursos/imagen/1.png', 639.90, 'zapatillas', 'nike', 'masculino', 0),
(2, 'Zapatilla Ultraboost', 'recursos/imagen/2.png', 529.90, 'zapatillas', 'adidas', 'masculino', 4),
(3, 'Zapato Mocasín Casual', 'recursos/imagen/3.png', 349.90, 'zapatos', 'darris', 'femenino', 5),
(4, 'Zapatilla Puma Running', 'recursos/imagen/4.png', 229.90, 'zapatillas', 'puma', 'masculino', 7),
(5, 'Zapatilla FENTY AVANTI VL', 'recursos/imagen/5.png', 649.00, 'zapatillas', 'puma', 'femenino', 6),
(6, 'Air Jordan 11 Retro', 'recursos/imagen/6.png', 999.90, 'zapatillas', 'nike', 'masculino', 1),
(7, 'Zapato Mocasín Vestir', 'recursos/imagen/7.png', 329.90, 'zapatos', 'clarks', 'masculino', 3),
(8, 'Zapatilla Y-3 Gendo', 'recursos/imagen/8.png', 2599.00, 'zapatillas', 'adidas', 'masculino', 983),
(9, 'Zapatillas Stefano Cocci Iris', 'recursos/imagen/9.png', 109.90, 'zapatillas', 'adidas', 'femenino', 10),
(10, 'Zapatos Casuales Rochester', 'recursos/imagen/10.png', 279.90, 'zapatos', 'call it spring', 'masculino', 18);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id_compra`);

--
-- Indices de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_compra` (`id_compra`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
