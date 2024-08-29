//  jokes, memes, and video jokes
const jokeCategories = {
    "Mrunu Jokes": [
        "How is my wallet like an onion? Every time I open it, I cry.",
        "I was making a joke about retirement. It did not work.",
        "What has four wheels and flies? A garbage truck.",
        "How do you make 7 even? Take away the S.",
        "Dear Math, grow up and solve your own problems.",
        `What did the ocean say to the beach?" "Nothing, it just waved.`,
        `I only know 25 letters of the alphabet. I don't know y.`,
        `Where do fruits go on vacation?" "Pear-is!`,
        `What's the best thing about Switzerland?" "I don't know, but the flag is a big plus.`,
        `How do you get a squirrel to like you? Act like a nut.`,
    ],
    "Programming Jokes": [
        "Why do programmers prefer dark mode? Because the light attracts bugs!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
        `Two bytes meet. The first byte asks, “Are you ill?” The second byte replies, “No, just feeling a bit off.”`,
        `Why was the statement scared while the comment was not? becoz Statements are executed.`,
        `Why don’t A.I. engineers need a resume? They just let their projects speak for themselves`,

    ],
    
};

const memes = [
    'memes/meme1.jpg',
    'memes/meme2.png',
    'memes/meme3.jpg',
    'memes/meme4.jpg',
    'memes/meme5.jpg',
    'memes/meme6.jpg',
    'memes/meme7.jpg',
    'memes/meme8.jpg',
    'memes/meme9.jpg',
    'memes/meme10.jpg',
];

const videoJokes = [
    'memes/vedio1.mp4',
    'memes/vedio2.mp4',
    'memes/vedio3.mp4',
];

// Initialize joke, meme, and video joke display elements
const jokeCardsContainer = document.getElementById('joke-cards-container');
const jokeDisplay = document.getElementById('joke-display');
const videoJokesContainer = document.getElementById('video-jokes-container');
const searchBar = document.getElementById('search-bar');
const searchSuggestions = document.createElement('ul');
searchSuggestions.id = 'search-suggestions';
searchBar.parentNode.insertBefore(searchSuggestions, searchBar.nextSibling);

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Joke cards generation
Object.keys(jokeCategories).forEach(category => {
    const card = document.createElement('div');
    card.className = 'joke-card';
    card.innerText = category;
    card.addEventListener('click', () => generateJoke(category));
    jokeCardsContainer.appendChild(card);
});

// Add a card for memes
const memeCard = document.createElement('div');
memeCard.className = 'joke-card';
memeCard.innerText = 'Memes';
memeCard.addEventListener('click', generateMeme);
jokeCardsContainer.appendChild(memeCard);

// Add a card for video jokes
const videoCard = document.createElement('div');
videoCard.className = 'joke-card';
videoCard.innerText = 'Video Jokes';
videoCard.addEventListener('click', generateVideoJoke);
jokeCardsContainer.appendChild(videoCard);

// Generate joke or meme
function generateJokeOrMeme(content, isJoke = true) {
    jokeDisplay.innerHTML = isJoke
        ? `<p>${content}</p><button class="like-button">Like</button><button class="favorite-button">Favorite</button>`
        : `<img src="${content}" alt="Meme">`;

    if (isJoke) {
        const likeButton = document.querySelector('.like-button');
        likeButton.addEventListener('click', () => likeJoke(content));

        const favoriteButton = document.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', () => favoriteJoke(content));
    }
}

function generateJoke(category) {
    const jokes = jokeCategories[category];
    const randomIndex = Math.floor(Math.random() * jokes.length);
    generateJokeOrMeme(jokes[randomIndex]);
}

function generateMeme() {
    const randomIndex = Math.floor(Math.random() * memes.length);
    generateJokeOrMeme(memes[randomIndex], false);
}

function generateVideoJoke() {
    const randomIndex = Math.floor(Math.random() * videoJokes.length);
    const videoUrl = videoJokes[randomIndex];
    jokeDisplay.innerHTML = `
        <video width="300" height="200" controls>
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
}

// Like joke function
function likeJoke(joke) {
    let likedJokes = JSON.parse(localStorage.getItem('likedJokes')) || {};

    if (likedJokes[joke]) {
        likedJokes[joke]++;
    } else {
        likedJokes[joke] = 1;
    }

    localStorage.setItem('likedJokes', JSON.stringify(likedJokes));
    updateLeaderboard();
}

// Favorite joke function
function favoriteJoke(joke) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.includes(joke)) {
        favorites.push(joke);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Display favorite jokes
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.forEach(favorite => {
        const p = document.createElement('p');
        p.innerText = favorite;
        favoritesContainer.appendChild(p);
    });
}

// Update leaderboard
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    const likedJokes = JSON.parse(localStorage.getItem('likedJokes')) || {};

    const sortedJokes = Object.entries(likedJokes).sort((a, b) => b[1] - a[1]);

    sortedJokes.slice(0, 5).forEach(([joke, likes]) => {
        const li = document.createElement('li');
        li.innerText = `${joke} - ${likes} likes`;
        leaderboardList.appendChild(li);
    });
}

// Search suggestion functionality
searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    searchSuggestions.innerHTML = '';
    searchSuggestions.style.display = query ? 'block' : 'none';

    Object.entries(jokeCategories).forEach(([category, jokes]) => {
        jokes.forEach(joke => {
            if (joke.toLowerCase().includes(query)) {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = joke;
                suggestionItem.className = 'suggestion';
                suggestionItem.addEventListener('click', () => {
                    searchBar.value = joke;
                    searchSuggestions.style.display = 'none';
                    generateJokeOrMeme(joke);
                });
                searchSuggestions.appendChild(suggestionItem);
            }
        });
    });
});

// Initialize favorites and leaderboard display
displayFavorites();
updateLeaderboard();
