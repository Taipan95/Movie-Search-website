var timer;
var stoppedTypingTime = 500;
var $input = $("#searchText");

$(document).ready(() => {
    $('#popup').dialog({
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 500
        },
        hide: {
            effect: "blind",
            duration: 500
        },
        modal: true,
        resizable: false,
        width: 900,
        height: 600,
        dialogClass: 'success-dialog',
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }

        }
    });

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
        var res = response.Response;
        var result = '';
        if (res == "True") {
            var movies = response.Search;
            console.log(movies);

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
            $('.nomatch').html(result);
            $('#results').html("");
        }
    }).catch((err) => {
        console.log(err);
    });
}



function moreDetails(id) {

    console.log('something');
    $.getJSON('http://www.omdbapi.com/?apikey=961d9e85&i=' + id + '&plot=full').then((response) => {

        var image = response.Poster;
        var title = response.Title;
        var rating = response.imdbRating;
        var genre = response.Genre;
        var actors = response.Actors;
        var released = response.Released;
        var rated = response.Rated;
        var plot = response.Plot;

        $('#poster').attr("src", image);
        $('#popup').dialog({ title: title });
        $('#rating').text(rating);
        $('#genre').text(genre);
        $('#actors').text(actors);
        $('#released').text(released);
        $('#rated').text(rated);
        $('#plot').text(plot);

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
    $('#popup').dialog('open');
    return false;
}

function getSelectedMovie() {
    var id = sessionStorage.getItem('selectedMovieID');
}
