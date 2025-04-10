<?php
session_start();
include('conexao.php'); // Conexão com o banco

// Verifica se o botão de login foi pressionado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["login_as_guest"])) {
        // Loga como visitante
        $_SESSION["usuario_id"] = null; // Não há ID de usuário para visitantes
        $_SESSION["usuario_nome"] = "Visitante"; // Nome genérico para visitantes
        header("Location: menu.php"); // Redireciona para o menu
        exit();
    }

    // Login padrão com nome e senha
    $nome = trim($_POST["nome"]);
    $senha = trim($_POST["senha"]);

    $sql = "SELECT id, senha FROM jogadores WHERE nome = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $nome);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($senha, $row["senha"])) {
            $_SESSION["usuario_id"] = $row["id"];
            $_SESSION["usuario_nome"] = $row['nome'];
            header("Location: menu.php"); // Redireciona para o jogo
            exit();
        } else {
            echo "Senha incorreta!";
        }
    } else {
        echo "Usuário não encontrado!";
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
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
                <li><a href="registro.php">Cadastro</a></li>
            </ul>
        </nav>
    </header>

    <section>
        <h2>Login de Jogador</h2>
        <form method="POST" action="">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required>

            <label for="senha">Senha:</label>
            <input type="password" id="senha" name="senha" required>

            <button type="submit">Entrar</button>
        </form>
        <br>
        <form method="POST" action="">
            <button type="submit" name="login_as_guest">Entrar como Visitante</button>
        </form>
       
        <p>Ainda não tem uma conta? <a href="registro.php">Registre-se aqui</a></p>
    </section>

    <footer>
        <p>&copy; 2025 Memória do Seu Jeito. Todos os direitos reservados.</p>
    </footer>
</body>
</html>
