<?php
session_start();
include('conexao.php'); // Arquivo que conecta ao banco de dados

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = trim($_POST["nome"]);
    $email = trim($_POST["email"]);
    $senha = password_hash($_POST["senha"], PASSWORD_DEFAULT); // Criptografa a senha

    // Verifica se o e-mail já existe
    $sql_check = "SELECT id FROM jogadores WHERE email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo "Erro: Este e-mail já está cadastrado!";
    } else {
        // Insere o novo usuário no banco
        $sql_insert = "INSERT INTO jogadores (nome, email, senha) VALUES (?, ?, ?)";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bind_param("sss", $nome, $email, $senha);

        if ($stmt_insert->execute()) {
            header("Location: login.php");
            exit();
        } else {
            echo "Erro ao registrar. Tente novamente.";
        }
        $stmt_insert->close();
    }
    $stmt_check->close();
    $conn->close();
}

?>

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="logo-container">
            <img src="logo_katakana.png" alt="Logo do jogo" class="logo">
            <h1>MEMÓRIA DO SEU JEITO</h1>
        </div>
        <nav>
            <ul>
                <li><a href="menu.php">Inicio</a></li>
                <li><a href="login.php">Login</a></li>
            </ul>
        </nav>
    </header>
    
    <section>
        <h2>Registro de Jogador</h2>
        <form method="POST" action="">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required>
            
            <label for="email">E-mail:</label>
            <input type="email" id="email" name="email" required>

            <label for="senha">Senha:</label>
            <input type="password" id="senha" name="senha" required>

            <button type="submit">Registrar</button>
        </form>
        <p>Já tem uma conta? <a href="login.php">Faça login</a></p>
    </section>

    <footer>
        <p>&copy; 2025 Memória do Seu Jeito. Todos os direitos reservados.</p>
    </footer>
</body>
</html>