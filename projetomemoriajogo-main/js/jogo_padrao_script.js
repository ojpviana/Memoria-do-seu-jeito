document.addEventListener("DOMContentLoaded", () => {
    const playerNameInput = document.getElementById("player-name");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const gameContainer = document.querySelector(".memory-game");
    let playerName = "";
    let gameStarted = false;
    let totalTimeInSeconds = 0;
    let timer;

    // Obtém o tema escolhido na URL
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get("theme") || "default";

    playerNameInput.addEventListener("input", () => {
        let value = playerNameInput.value;
        if (!/^[a-zA-Z]{3,}[a-zA-Z0-9]{0,17}$/.test(value)) {
            playerNameInput.setCustomValidity("Por favor, insira no mínimo 3 letras e no máximo 20 caracteres (números permitidos após 3 letras).");
        } else {
            playerNameInput.setCustomValidity("");
        }
    });

    startButton.addEventListener("click", () => {
        if (playerNameInput.value.length < 3) {
            alert("Por favor, insira no mínimo 3 letras");
            return;
        }
        playerName = playerNameInput.value;
        gameStarted = true;
        totalTimeInSeconds = 0;
        updateTimerDisplay();
        startTimer();
        startGame();
    });

    function startTimer() {
        timer = setInterval(() => {
            totalTimeInSeconds += 1;
            updateTimerDisplay();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(totalTimeInSeconds / 60);
        const seconds = Math.floor(totalTimeInSeconds % 60);
        document.getElementById("timer").textContent = `Tempo: ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function startGame() {
        const cards = document.querySelectorAll(".memory-card");
        let hasFlippedCard = false;
        let lockBoard = false;
        let firstCard, secondCard;

        cards.forEach(card => {
            card.classList.remove("flip");
            card.addEventListener("click", flipCard);
        });

        function flipCard() {
            if (!gameStarted || lockBoard || this === firstCard) return;
            this.classList.add("flip");

            if (!hasFlippedCard) {
                hasFlippedCard = true;
                firstCard = this;
                return;
            }

            secondCard = this;
            checkForMatch();
        }

        function checkForMatch() {
            let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
            isMatch ? disableCards() : unflipCards();
        }

        function disableCards() {
            firstCard.removeEventListener("click", flipCard);
            secondCard.removeEventListener("click", flipCard);
            resetBoard();
            checkWinCondition();
        }

        function unflipCards() {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove("flip");
                secondCard.classList.remove("flip");
                resetBoard();
            }, 1000);
        }

        function resetBoard() {
            [hasFlippedCard, lockBoard] = [false, false];
            [firstCard, secondCard] = [null, null];
        }

        function checkWinCondition() {
            if (document.querySelectorAll(".memory-card.flip").length === cards.length) {
                stopTimer();
                setTimeout(() => {
                    if (confirm(`Parabéns, ${playerName}! Você venceu! Deseja jogar novamente?`)) {
                        restartGame();
                    }
                }, 500);
            }
        }

        (function shuffle() {
            cards.forEach(card => {
                let randomPos = Math.floor(Math.random() * cards.length);
                card.style.order = randomPos;
            });
        })();
    }

    restartButton.addEventListener("click", restartGame);

    function restartGame() {
        gameStarted = false;
        stopTimer();
        totalTimeInSeconds = 0;
        updateTimerDisplay();
        document.querySelectorAll(".memory-card").forEach(card => {
            card.classList.remove("flip");
            card.removeEventListener("click", flipCard);
        });
        setTimeout(startGame, 500);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && gameStarted) {
            document.querySelectorAll(".memory-card").forEach(card => {
                card.classList.add("flip");
                card.removeEventListener("click", flipCard);
            });
            stopTimer();
            setTimeout(() => {
                alert(`Parabéns, ${playerName}! Você venceu automaticamente!`);
                if (confirm("Deseja jogar novamente?")) {
                    restartGame();
                }
            }, 500);
        }
    });

    // Código de importação de imagens personalizadas
    document.getElementById('upload-button').addEventListener('click', function() {
        document.getElementById('image-upload').click();
    });

    document.getElementById('image-upload').addEventListener('change', function(event) {
        const files = Array.from(event.target.files);

        if (files.length !== 8) {
            alert("Por favor, selecione exatamente 8 imagens.");
            return;
        }

        const pairedImages = files.flatMap((file, index) => [{ file, id: index }, { file, id: index }]);
        const shuffledImages = shuffleImages(pairedImages);

        const cards = document.querySelectorAll('.memory-card');

        shuffledImages.forEach(({ file, id }, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const card = cards[index];
                const imgFront = card.querySelector('.front-face');
                imgFront.src = e.target.result;
                card.dataset.framework = `custom${id}`;
            };
            reader.readAsDataURL(file);
        });
    });

    function shuffleImages(images) {
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }
        return images;
    }
});
