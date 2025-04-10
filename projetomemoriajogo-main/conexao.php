<?php
// Configuração do banco de dados
$servername = "localhost"; // Servidor do banco de dados
$username = "root";        // Usuário do MySQL (padrão no WAMP é 'root')
$password = "";      // Senha do MySQL (padrão no WAMP é vazia)
$dbname = "memoria_seu_jeito";  // Nome do banco de dados

// Criação da conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificação de erro
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
} else {
    echo "Conexão bem-sucedida!";
}
?>
