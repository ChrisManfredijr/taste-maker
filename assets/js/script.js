var fmKey = "2097d3a5f8da51f146d0e4e47efde651";
var dbKey = "2";
var artistName = "all them witches"
var limit = "5";



$("#searchArtist").click(function (event) {
    event.preventDefault();
    var artist = $("#input").val();
    if (artist !== "") {
        getRecs(artist)
    }

})

var getRecs = function (artistName) {
    var lastFmAPI = "https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&limit=1&artist=" + artistName + "&api_key=" + fmKey + "&format=json";
    fetch(lastFmAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var artistNameRec = data.similarartists.artist[0].name;
                console.log(artistNameRec);

                var lastFmRecAPI = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistNameRec + "&api_key=" + fmKey + "&format=json";
                fetch(lastFmRecAPI).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            var artistBioLong = data.artist.bio.content;
                            var artistBioArray = artistBioLong.split(".");
                            var artistBio = artistBioArray[0] + "." + artistBioArray[1] + "." + artistBioArray[2];
                            var youtubeAPI = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAruDAmqTVC79gNs-7-sHyVx1zyaRzYPis&type=video&maxResults=1&q=" + artistNameRec
                            fetch(youtubeAPI).then(function (response) {
                                if (response.ok) {
                                    response.json().then(function (data) {
                                        videoId = data.items[0].id.videoId;
                                        buildRecs(artistNameRec, artistBio, artistName, videoId);
                                    });
                                };
                            })
                            
                        });
                    };
                });

            });
        }
    });

};



var buildRecs = function (artistNameRec, artistBio, artistName, videoId) {

    $("#recs").html("");
    var recBlock = "<div class =\"title is-3 has-text-centered\" > if you like " + artistName + " than you may enjoy....</div>" +
        "<div class = \"columns is-centered mb-10\">" +
        "<div class =\"column is-two-fifths\">" +
        "<figure class=\"image is-16by9\">" +
        "<iframe class=\"has-ratio\" width=\"360\" height=\"270\" src=\"https://www.youtube.com/embed/"+ videoId +"\" frameborder=\"0\" allowfullscreen></iframe> " +
        "</figure>" +
        "</div>" +
        "<div class = \"column is-two-fifths\">" +
        "<h1 class = \"title is-3\">" + artistNameRec + "</h1>" +
        "<p class = \"content is-medium\">" + artistBio + "</p>" +
        "<button class = \"button is-info\">learn more</button>" +
        "</div>" +
        "</div>";
    $("#recs").append(recBlock);

};




