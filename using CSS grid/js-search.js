var timer;
var stoppedTypingTime = 500;
var $input = $("#searchText");

$(document).ready(() => {
    $input.on("keyup", function () {
        if ($input.val() != "") {
            clearTimeout(timer);
            timer = setTimeout(apiCall, stoppedTypingTime);
        }
    });
    $input.on("keydown", function () {
        clearTimeout(timer);
    });
});


function apiCall() {
    var text = $input.val();
    $.getJSON('https://www.omdbapi.com/?s=' + text + '&type=movie&apikey=961d9e85').then((response) => {
        var result = '';
        var res = response.Response;

        if (res == "True") {
            var movies = response.Search;

            $.each(movies, (index, movie) => {

                result += `
                <div class="resultsContainer">
                    <img class="image" src="${movie.Poster}">
                    <h5 class="title" id="movieTitle">${movie.Title}</h5>
                    <button class="details" onclick="moreDetails('${movie.imdbID}')">Read More</button>
                </div>
                `;
            });
            $('.nomatch').html("");
            $('.main-content').html(result);
        }
        else {
            result = `
            <div class="resultsContainer">
                
                <h5 class="title"  id="movieTitle">Sorry, no listed movies matched your criteria</h5>
               
            </div>
            `;
            $('.main-content').html("");
            $('.nomatch').html(result);

        }

    }).catch((err) => {
        console.log(err);
    });
}

function moreDetails(imdbID) {
    sessionStorage.setItem('selectedMovieID', imdbID);
    window.location.href = "movie.html";
    return false;
}

function getSelectedMovie() {
    var id = sessionStorage.getItem('selectedMovieID');
    var result = '';
    $.getJSON('http://www.omdbapi.com/?apikey=961d9e85&i=' + id + '&plot=full').then((response) => {
        console.log(response);
        result = `
            
            <img class="poster" src="${response.Poster}">
            
            <h2 class="movieTitle">${response.Title}</h2>
            <div class="movieDetails">
                <label for="rating"><strong>IMDB Rating:</strong></label><p id="rating">${response.imdbRating}</p>
                <label for="genre"><strong>Genre:</strong><p>${response.Genre}</p>
                <label for="actors"><strong>Actors:</strong><p>${response.Actors}</p>
                <label for="released"><strong>Released:</strong><p>${response.Released}</p>
                <label for="rated"><strong>Rated:</strong><p>${response.Rated}</p>
                <label for="plot"><strong>Plot:</strong><p>${response.Plot}</p>
            </div>
            
            <button class="btnBack" onclick="window.location.href='index.html'">Back to search</button>
                
           
        `;
        $('.movie-container').html(result);
        var value = parseFloat($('#rating').text());
        var color = '';
        if (value >= 0.0 && value <= 3.0) {
            color = 'red';
        }
        else if (value > 3.0 && value <= 6.0) {
            color = 'orange';
        }
        else if (value > 6.0 && value <= 10.0) {
            color = 'green';
        }
        $('#rating').css("color", color);

    });
}
