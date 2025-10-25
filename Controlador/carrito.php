<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$database = "tienda";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

session_start();
$id_sesion = session_id();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") { // Agregar producto al carrito
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data["producto_id"], $data["cantidad"])) {
        $producto_id = $data["producto_id"];
        $cantidad = $data["cantidad"];

        // Verificar si el producto ya está en el carrito
        $query = "SELECT cantidad FROM carrito WHERE id_sesion = ? AND producto_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $id_sesion, $producto_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) { // Si ya existe, actualizar cantidad
            $row = $result->fetch_assoc();
            $nueva_cantidad = $row["cantidad"] + $cantidad;
            $update_query = "UPDATE carrito SET cantidad = ? WHERE id_sesion = ? AND producto_id = ?";
            $stmt = $conn->prepare($update_query);
            $stmt->bind_param("isi", $nueva_cantidad, $id_sesion, $producto_id);
            $stmt->execute();
        } else { // Si no existe, insertar nuevo producto
            $insert_query = "INSERT INTO carrito (id_sesion, producto_id, cantidad) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($insert_query);
            $stmt->bind_param("sii", $id_sesion, $producto_id, $cantidad);
            $stmt->execute();
        }

        echo json_encode(["success" => "Producto agregado/actualizado en el carrito"]);
    } else {
        echo json_encode(["error" => "Datos inválidos"]);
    }
}

if ($method === "GET") { // Obtener productos del carrito
    $query = "SELECT c.id, p.nombre, p.precio, c.cantidad, p.imagen 
              FROM carrito c
              INNER JOIN productos p ON c.producto_id = p.id
              WHERE c.id_sesion = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $id_sesion);
    $stmt->execute();
    $result = $stmt->get_result();

    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }

    echo json_encode($productos);
}

if ($method === "DELETE") { 
    parse_str(file_get_contents("php://input"), $data);

    if (isset($_GET["vaciar"])) { // Nueva condición para vaciar todo el carrito
        $query = "DELETE FROM carrito WHERE id_sesion = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $id_sesion);
        $stmt->execute();
        
        echo json_encode(["success" => "Carrito vaciado correctamente"]);
        exit;
    }

    if (isset($data["id"])) { // Eliminar un solo producto
        $id = $data["id"];
        $query = "DELETE FROM carrito WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        echo json_encode(["success" => "Producto eliminado del carrito"]);
    } else {
        echo json_encode(["error" => "ID de producto no proporcionado"]);
    }
}

$conn->close();
?>
