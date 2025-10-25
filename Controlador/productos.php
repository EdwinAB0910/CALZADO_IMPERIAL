<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

$servername = "localhost";
$username = "root";  // Asegúrate de cambiarlo si tu usuario de MySQL es diferente
$password = "";
$database = "tienda";  // Nombre de la base de datos

// Conectar a MySQL
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

// Consulta para obtener productos
$sql = "SELECT id, nombre, precio, stock, imagen, genero, categoria, marca FROM productos";
$result = $conn->query($sql);

$productos = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

// Devolver los productos en formato JSON
echo json_encode($productos);

$conn->close();
?>
