const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const contentHolder = document.getElementById('contentHolder');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const API_KEY = 'ef26c554';
const API_URL = 'https://www.omdbapi.com/';


let pageNumber = 1;


async function fetchMovieData(searchText, pageNumber) {
    const response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchText)}&page=${pageNumber}`);
    const data = await response.json();
    return data;
}

async function fetchMovieDetails(imdbId) {
    const response = await fetch(`${API_URL}?apikey=${API_KEY}&i=${imdbId}`);
    const data = await response.json();
    return data;
}

async function displayData(searchText, page) {
    try {
        const result = await fetchMovieData(searchText, page);
        const pageNumberData = result.Search || []; 
    
        contentHolder.innerHTML = '';
    
        
        pageNumberData.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'itemElement';
            const movieName = document.createElement('h2');
            movieName.textContent = item.Title;
            const movieImg = document.createElement('img');
            movieImg.src = item.Poster;
            itemElement.appendChild(movieName);
            itemElement.appendChild(movieImg);

            itemElement.addEventListener('click', async function(){
                const movieDetails = await fetchMovieDetails(item.imdbID);
                displayMovieDetails(movieDetails);
            });
            contentHolder.appendChild(itemElement);
        });
    
        
        prevButton.disabled = page === 1;
        nextButton.disabled = page === Math.ceil(result.totalResults / 10);
    
        
        pageNumber = page;
    } 
    catch (error) {
        console.error('Error:', error);
    }
}

function displayMovieDetails(movieDetails) {
    console.log(movieDetails);
    detailsContainer.innerHTML = '';

    const imdbID = movieDetails.imdbID;
    const storedRating = localStorage.getItem(`rating_${imdbID}`);
    const storedComment = localStorage.getItem(`comment_${imdbID}`);

    const detailsSection = document.createElement('div');
    detailsSection.className = 'detailSection';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'closeButton'
    closeButton.addEventListener('click', function() {
        detailsContainer.innerHTML = ''; 
    });

    detailsSection.innerHTML = `
        <div class="child_CDS firstCDS">
        <h2>${movieDetails.Title}</h2>
        <p><strong>Year:</strong> ${movieDetails.Year}</p>
        <p><strong>Rated:</strong> ${movieDetails.Rated}</p>
        <p><strong>Plot:</strong> ${movieDetails.Plot}</p>
        <p><strong>Language</strong> ${movieDetails.Language}</p>
        <p><strong>IMDB Rating:</strong> ${movieDetails.imdbRating}</p>
        <label for="ratingInput">Your Rating:(/5)</label>
        <input type="number" id="ratingInput" min="1" max="10" value="${storedRating || ''}">
        <label for="commentInput">Your Comment:</label>
        <textarea id="commentInput" rows="3">${storedComment || ''}</textarea></div>
    `;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Rating & Comment';

    saveButton.addEventListener('click', function() {
        const rating = document.getElementById('ratingInput').value;
        const comment = document.getElementById('commentInput').value;
        localStorage.setItem(`rating_${imdbID}`, rating);
        localStorage.setItem(`comment_${imdbID}`, comment);
        alert('Rating and comment saved!');
        detailsContainer.innerHTML = '';
    });

    detailsSection.appendChild(saveButton);
    detailsSection.appendChild(closeButton);
    detailsContainer.appendChild(detailsSection);
}


searchButton.addEventListener('click', async function() {
    const searchText = searchInput.value.toLowerCase().trim();
    console.log(searchText);

    const result = await fetchMovieData(searchText, pageNumber);
    if (result.Search) {
        await displayData(searchText, 1);
    } else {
        alert('Too many data! Please type more!');
        console.log("Too many data! Add more");
    }
});

prevButton.addEventListener('click', async function() {
    const searchText = searchInput.value.toLowerCase().trim();
    if (pageNumber > 1) {
      await displayData(searchText, pageNumber - 1);
    }
  });
  
nextButton.addEventListener('click', async function() {
    const searchText = searchInput.value.toLowerCase().trim();
    console.log(pageNumber + 1);
    const result = await fetchMovieData(searchText, pageNumber + 1);
    //console.log(result);
    if (result.Search) {
      await displayData(searchText, pageNumber + 1);
    } else {
        alert('No more data found');
        console.log("No more data found")
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    searchInput.value = 'friends';
    searchButton.click();
  });
  