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
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}">
                        <h5 id="movieTitle">${movie.Title}</h5>
                        <button onclick="moreDetails('${movie.imdbID}')">Read More</button>
                    </div>
                </div>
            `;
            });
            $('.nomatch').html("");
            $('#results').html(result);
        }
        else {
            result += `
            <div class="col-md-12">
                <div class="well text-center">
                    <h5 class="nomatch">Sorry, no listed movies matched your criteria</h5>
                </div>
            </div>
            `;
            $('#results').html("");
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
            <div class="row">
                <div class="col-md-3">
                    <img src="${response.Poster}">
                </div>
                <div class="col-md-9">
                    <h2 id="movieTitle">${response.Title}</h2>
                    <div class="well" id="movieDetails">
                        <label for="rating"><strong>IMDB Rating:</strong></label><p id="rating">${response.imdbRating}</p>
                        <p><strong>Genre: </strong>${response.Genre}</p>
                        <p><strong>Actors: </strong>${response.Actors}</p>
                        <p><strong>Released: </strong>${response.Released}</p>
                        <p><strong>Rated: </strong>${response.Rated}</p>
                        <p><strong>Plot: </strong>${response.Plot}</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <button id="back" onclick="window.location.href='index.html'">Back to search</button>
                </div>
            </div>
        `;
        $('#movie').html(result);
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
