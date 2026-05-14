const cards = [
    {
        id: 1,
        name: 'XOTRII Prime',
        rank: 'Mythic / 神話',
        className: 'mythic',
        power: 98,
        defense: 88,
        symbol: 'X'
    },
    {
        id: 2,
        name: 'Cyber Runner',
        rank: 'Epic / 叙事詩',
        className: 'epic',
        power: 84,
        defense: 76,
        symbol: '>'
    },
    {
        id: 3,
        name: 'Neon Guard',
        rank: 'Rare / レア',
        className: 'rare',
        power: 72,
        defense: 91,
        symbol: '#'
    },
    {
        id: 4,
        name: 'Ghost Signal',
        rank: 'Epic / 叙事詩',
        className: 'epic',
        power: 90,
        defense: 68,
        symbol: '~'
    }
];

const state = {
    selectedCard: null,
    wins: 0,
    losses: 0,
    draws: 0
};

const cardGrid = document.querySelector('#cardGrid');
const playerCard = document.querySelector('#playerCard');
const enemyCard = document.querySelector('#enemyCard');
const battleButton = document.querySelector('#battleButton');
const battleResult = document.querySelector('#battleResult');
const wins = document.querySelector('#wins');
const losses = document.querySelector('#losses');
const draws = document.querySelector('#draws');

function createCardMarkup(card) {
    return `
        <article class="card ${card.className}" data-id="${card.id}">
            <div class="card-content">
                <div class="card-symbol">${card.symbol}</div>
                <div class="card-name">${card.name}</div>
                <p>${card.rank}</p>
                <div class="card-meta">
                    <span>ATK ${card.power}</span>
                    <span>DEF ${card.defense}</span>
                </div>
            </div>
        </article>
    `;
}

function renderCards() {
    cardGrid.innerHTML = cards.map(createCardMarkup).join('');

    document.querySelectorAll('.card').forEach((cardElement) => {
        cardElement.addEventListener('click', () => {
            const selectedId = Number(cardElement.dataset.id);
            state.selectedCard = cards.find((card) => card.id === selectedId);
            document.querySelectorAll('.card').forEach((item) => item.classList.remove('selected'));
            cardElement.classList.add('selected');
            playerCard.className = `battle-slot ${state.selectedCard.className}`;
            playerCard.innerHTML = createCardMarkup(state.selectedCard);
            battleResult.textContent = 'Card locked. Start the battle.';
        });
    });
}

function getRandomCard() {
    const index = Math.floor(Math.random() * cards.length);
    return cards[index];
}

function updateScoreboard() {
    wins.textContent = state.wins;
    losses.textContent = state.losses;
    draws.textContent = state.draws;
}

function getBattleScore(card) {
    const randomBoost = Math.floor(Math.random() * 21);
    return card.power + card.defense + randomBoost;
}

function startBattle() {
    if (!state.selectedCard) {
        battleResult.textContent = 'Select a card before entering battle.';
        return;
    }

    const opponent = getRandomCard();
    const playerScore = getBattleScore(state.selectedCard);
    const enemyScore = getBattleScore(opponent);

    enemyCard.className = `battle-slot ${opponent.className}`;
    enemyCard.innerHTML = createCardMarkup(opponent);

    if (playerScore > enemyScore) {
        state.wins += 1;
        battleResult.textContent = `Victory: ${state.selectedCard.name} scored ${playerScore} against ${opponent.name} at ${enemyScore}.`;
    } else if (playerScore < enemyScore) {
        state.losses += 1;
        battleResult.textContent = `Defeat: ${opponent.name} scored ${enemyScore} against ${state.selectedCard.name} at ${playerScore}.`;
    } else {
        state.draws += 1;
        battleResult.textContent = `Draw: both cards ended at ${playerScore}.`;
    }

    updateScoreboard();
}

battleButton.addEventListener('click', startBattle);
renderCards();
updateScoreboard();
