document.addEventListener("DOMContentLoaded", function() {
    const memoryBoard = document.getElementById("memory-board");
    const resetButton = document.getElementById("reset-button");

    const symbols = ["🍎", "🍌", "🍉", "🍊", "🍇", "🍓", "🍒", "🍍"];
    const cards = [...symbols, ...symbols];
    let flippedCard = null;
    let lockBoard = false;

 
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

  
    function createBoard() {
        const shuffledCards = shuffle(cards);
        memoryBoard.innerHTML = "";
        shuffledCards.forEach(symbol => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.symbol = symbol;
            card.addEventListener("click", flipCard);
            memoryBoard.appendChild(card);
        });
    }



    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCard) return;

        this.textContent = this.dataset.symbol;

        if (!flippedCard) {
            flippedCard = this;
            return;
        }

        if (flippedCard.dataset.symbol !== this.dataset.symbol) {
            lockBoard = true;
            setTimeout(() => {
                flippedCard.textContent = "";
                this.textContent = "";
                flippedCard = null;
                lockBoard = false;
            }, 1000);
        } else {
            flippedCard.removeEventListener("click", flipCard);
            this.removeEventListener("click", flipCard);
            flippedCard = null;
        }
    }

   

    
    resetButton.addEventListener("click", () => {
        
        createBoard();
        
    });

    
    createBoard();
});
