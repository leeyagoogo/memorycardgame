const gridContainer = document.querySelector(".grid-container");
let allCards = [];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

let currentCount = 0;

fetch("card.json")
  .then(res => res.json())
  .then(data => {
    allCards = data;

    for (let i = 0; i < 4; i++) {
      cards.push(allCards[i], allCards[i]);
    }
    currentCount = 4;
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length, randomIndex, temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  gridContainer.innerHTML = "";
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" />
        <div class="label">${card.name}</div>
      </div>
      <div class="back"></div>`;

    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();

  const allFlipped = [...document.querySelectorAll(".card")].every(card =>
    card.classList.contains("flipped")
  );

  if(allFlipped){
    setTimeout(() => {
      alert("🎉 You won! All cards have been matched!");

    },500);
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  score = 0;
  document.querySelector(".score").textContent = score;
  shuffleCards();
  generateCards();
}

function addCard() {
  if (currentCount < allCards.length) {
    let newCard = allCards[currentCount];
    cards.push(newCard, newCard);
    currentCount++;

    score = 0;
    document.querySelector(".score").textContent = score;

    shuffleCards();
    generateCards();
  }

  else {
    alert("No more cards to add!");
  }
}


function removeCard() {
  if (currentCount > 1) {

    let removedCard = allCards[currentCount - 1];


    cards = cards.filter(c => c.name !== removedCard.name);
    cards.push(removedCard, removedCard);

    cards.pop();
    cards.pop();

    currentCount--;

    score = 0;
    document.querySelector(".score").textContent = score;

    shuffleCards();
    generateCards();
  }

  else {
    alert("At least 1 pair must remain!");
  }
}
