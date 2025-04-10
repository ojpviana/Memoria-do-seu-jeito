function showDifficultyMenu() {
    document.getElementById("menu-container").classList.add("hidden");
    document.getElementById("dificuldade-menu").classList.remove("hidden");
    document.getElementById("voltar-button").classList.remove("hidden");
    document.getElementById("bemvindo-message").classList.add("hidden");
}

function showRegistrationMenu() {
    document.getElementById("menu-container").classList.add("hidden");
    document.getElementById("registro-menu").classList.remove("hidden");
    document.getElementById("voltar-button").classList.remove("hidden");
    document.getElementById("bemvindo-message").classList.add("hidden");
}

function selectRegistration(useRegistration) {
    if (useRegistration) {
        alert("A funcionalidade de registro será adicionada em breve!");
        // Aqui, no futuro, podemos redirecionar para uma tela de registro
    } else {
        document.getElementById("registro-menu").classList.add("hidden"); // Oculta o menu de registro
        showDifficultyMenu(); // Vai para o menu de dificuldade
    }
}

let selectedDifficulty = ''; // Armazena a dificuldade selecionada

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    showThemeMenu(); // Exibe o menu de temas após a escolha da dificuldade
}

function showThemeMenu() {
    document.getElementById("dificuldade-menu").classList.add("hidden");
    document.getElementById("tema-menu").classList.remove("hidden");
}

function startGame(theme) {
    if (!selectedDifficulty) {
        alert("Por favor, selecione uma dificuldade primeiro!");
        return;
    }
    if (!theme) {
        alert("Por favor, selecione um tema!");
        return;
    }
    
    if (theme === "personalizado") {
        importCustomTheme();
    } else {
        redirectToGame(selectedDifficulty, theme);
    }
}

function startGameFromMenu() {
    if (usuarioLogado) {
        showDifficultyMenu();
    } else {
        showRegistrationMenu();
    }
}

function importCustomTheme() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", function (event) {
        let file = event.target.files[0];
        if (!file) {
            alert("Por favor, selecione uma imagem para o tema personalizado.");
            return;
        }
        let imageUrl = URL.createObjectURL(file);
        localStorage.setItem("customTheme", imageUrl);
        redirectToGame(selectedDifficulty, "personalizado");
    });
    input.click();
}

function redirectToGame(difficulty, theme) {
    let gamePage = "jogo_" + difficulty + ".html";
    window.location.href = `${gamePage}?tema=${theme}`;
}

function goBack() {
    const themeMenu = document.getElementById("tema-menu");
    const difficultyMenu = document.getElementById("dificuldade-menu");
    const menuContainer = document.getElementById("menu-container");

    console.log("themeMenu hidden?", themeMenu.classList.contains("hidden"));
    console.log("difficultyMenu hidden?", difficultyMenu.classList.contains("hidden"));
    console.log("menuContainer hidden?", menuContainer.classList.contains("hidden"));

    if (!themeMenu.classList.contains("hidden")) {
        themeMenu.classList.add("hidden");
        difficultyMenu.classList.remove("hidden");
    } else if (!difficultyMenu.classList.contains("hidden")) {
        difficultyMenu.classList.add("hidden");
        menuContainer.classList.remove("hidden");
    } else {
        window.location.href = "menu.php";  // Ou para a página de login se necessário: window.location.href = "login.php";
    }
}

function toggleUserDropdown() {
    var dropdown = document.getElementById("user-dropdown");

    if (dropdown) {
        dropdown.classList.toggle("hidden");
    } else {
        console.error("Dropdown não encontrado");
    }

}
