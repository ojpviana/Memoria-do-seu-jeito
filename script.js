document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('image-upload').click(); // Abre a janela de upload
});

document.getElementById('image-upload').addEventListener('change', function(event) {
    const files = event.target.files;
    
    // Verifica se o número de imagens selecionadas é suficiente (precisamos de 8 imagens)
    if (files.length !== 8) {
        alert("Por favor, selecione exatamente 8 imagens.");
        return;
    }

    // Embaralha as imagens selecionadas para tornar o jogo mais interessante
    const shuffledImages = shuffleImages(Array.from(files));

    // Pegamos todas as cartas do jogo
    const cards = document.querySelectorAll('.memory-card');
    
    // Atribui as imagens para as cartas (duplicando as imagens)
    for (let i = 0; i < cards.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgFront = cards[i].querySelector('.front-face');
            imgFront.src = e.target.result; // Altera a imagem da face da carta
        };

        // Atribui as imagens em ordem duplicada
        reader.readAsDataURL(shuffledImages[i % 8]); // Duplicando as imagens
    }
});

// Função para embaralhar as imagens (para tornar o jogo mais interessante)
function shuffleImages(images) {
    for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]]; // Troca as posições
    }
    return images;
}

// Seleciona todas as cartas do jogo da memória
const cards = document.querySelectorAll('.memory-card');

// Seleciona os botões de iniciar e reiniciar
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// Seleciona os elementos do cronômetro e nome do jogador
const timerDisplay = document.getElementById('timer');
const playerNameInput = document.getElementById('player-name');

// Seleciona a tabela de placar (leaderboard)
const leaderboardTable = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];

// Variáveis de controle do jogo
let hasFlippedCard = false; // Indica se uma carta já foi virada
let lockBoard = false; // Evita que mais de duas cartas sejam viradas ao mesmo tempo
let firstCard, secondCard; // Armazena as cartas viradas

// Variáveis do cronômetro
let totalTimeInSeconds = 0;
let timer;
let playerName = ''; // Armazena o nome do jogador
let leaderboard = []; // Armazena os jogadores e seus tempos

// Inicia o cronômetro
function startTimer() {
    timer = setInterval(() => {
        totalTimeInSeconds++;
        updateTimerDisplay();
    }, 1000);
}

// Para o cronômetro
function stopTimer() {
    clearInterval(timer);
}

// Atualiza o display do cronômetro no formato mm:ss
function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `Tempo: ${padTime(minutes)}:${padTime(seconds)}`;
}

// Adiciona um zero à esquerda para números menores que 10
function padTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Função para virar uma carta
function flipCard() {
    if (lockBoard) return; // Impede virar mais de duas cartas ao mesmo tempo
    if (this === firstCard) return; // Impede clicar duas vezes na mesma carta

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Verifica se as duas cartas viradas são um par
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
}

// Desativa o clique nas cartas combinadas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();

    // Verifica se todas as cartas foram viradas
    if (document.querySelectorAll('.flip').length === cards.length) {
        stopTimer(); // Para o cronômetro
        addToLeaderboard(playerName, totalTimeInSeconds); // Salva no placar
        setTimeout(() => {
            let playAgain = confirm(`Parabéns, ${playerName}! Você completou o jogo em ${timerDisplay.textContent}.\nDeseja tentar novamente?`);
            if (playAgain) {
                resetGameForRetry();
            }
        }, 500); 
    }
}

// Desvira as cartas caso não sejam um par
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 800); 
}

// Reseta as variáveis de controle do jogo
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Embaralha as cartas antes de começar o jogo
function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
}

// Reseta o jogo para o estado inicial
function resetGame() {
    stopTimer();
    totalTimeInSeconds = 0;
    updateTimerDisplay();
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    resetBoard();
    shuffle();
}

// Reseta o jogo para uma nova tentativa sem resetar o nome do jogador
function resetGameForRetry() {
    stopTimer();
    totalTimeInSeconds = 0;
    updateTimerDisplay();
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    resetBoard();
    shuffle();
    startTimer(); // Reinicia o timer para a nova tentativa
}

// Adiciona o jogador ao placar
function addToLeaderboard(name, timeInSeconds) {
    leaderboard.push({ name, timeInSeconds });
    leaderboard.sort((a, b) => a.timeInSeconds - b.timeInSeconds); // Ordena do menor para o maior tempo
    updateLeaderboardDisplay();
}

// Atualiza a tabela do placar
function updateLeaderboardDisplay() {
    leaderboardTable.innerHTML = ''; 
    leaderboard.forEach(record => {
        let newRow = leaderboardTable.insertRow();
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        cell1.textContent = record.name;
        cell2.textContent = `${padTime(Math.floor(record.timeInSeconds / 60))}:${padTime(record.timeInSeconds % 60)}`;
    });
}

// Função que vira todas as cartas automaticamente 
function flipAllCards() {
    cards.forEach(card => {
        card.classList.add('flip');
        card.removeEventListener('click', flipCard);
    });
}

// Função que força a vitória do jogo automaticamente 
function autoWin() {
    flipAllCards(); // Vira todas as cartas
    stopTimer();
    addToLeaderboard(playerName, totalTimeInSeconds);
    setTimeout(() => {
        let playAgain = confirm(`Parabéns, ${playerName}! Você completou o jogo em ${timerDisplay.textContent}.\nDeseja tentar novamente?`);
        if (playAgain) {
            resetGameForRetry();
        }
    }, 500); 
}

// Atalho: se pressionar "Enter", o jogo é vencido automaticamente 
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        autoWin();
    }
});

// Evento para reiniciar o jogo
restartButton.addEventListener('click', resetGame);

// Evento para iniciar o jogo ao clicar no botão "Iniciar"
startButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim(); 
    resetGame(); 
    startTimer(); 
});

// Inicializa o jogo ao carregar a página
(function initializeGame() {
    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
})();
