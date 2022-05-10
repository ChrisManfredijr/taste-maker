var fmKey = "2097d3a5f8da51f146d0e4e47efde651";
var resultNumber = 0;
var limit = 20;
var artistName;
var youtubeKey = ["AIzaSyAruDAmqTVC79gNs-7-sHyVx1zyaRzYPis", "AIzaSyCv3abDl7RNfGiICt80KVPOx22JWsDSBro", "AIzaSyBko84VIeCaWrdK8EspDLkDCkuFYDZsQAU", "AIzaSyDCUTgXNuEadfA_AUekjgy8ERv1WY5AT4o", "AIzaSyCbmbvdEaEQ0-On5-s4Ewb6B33BzsGt6oU"]

$(".card").click(function(){
    artistName = $(this).find(".item-title").text().trim();
    
    
    getSingleArtist(artistName);
})

$("#search").submit(function (event) {
    event.preventDefault();
    artistName = $("#input").val();
    resultNumber = 0;
    if (artistName !== "") {
        getRecs(artistName, resultNumber)
    }
});

$("#searchArtist").click(function (event) {
    event.preventDefault();
    artistName = $("#input").val();
    resultNumber = 0;
    if (artistName !== "") {
        getRecs(artistName, resultNumber)
    }

})

bulmaCarousel.attach('#slider', {
    breakpoints: [{ changePoint: 480, slidesToShow: 1, slidesToScroll: 1 }, { changePoint: 640, slidesToShow: 2, slidesToScroll: 2 }, { changePoint: 768, slidesToShow: 3, slidesToScroll: 3 }],
    infinite: true,
    autoplay: true,
    autoplaySpeed: 7000,
});

var getRecs = function (artistName, resultNumber) {
    var lastFmAPI = "https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&limit=" + limit + "&artist=" + artistName + "&api_key=" + fmKey + "&format=json";

    fetch(lastFmAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {


                var artistNameRec = data.similarartists.artist[resultNumber].name;
                var lastFmRecAPI = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistNameRec + "&api_key=" + fmKey + "&format=json";

                fetch(lastFmRecAPI).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {

                            var artistBioLong = data.artist.bio.content;
                            var artistBioArray = artistBioLong.split(".");
                            var artistBio = artistBioArray[0] + "." + artistBioArray[1] + "." + artistBioArray[2] + "." + artistBioArray[3] + ".";

                            var i = 0;
                            var keyChecker = function () {
                                var youtubeAPI = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + youtubeKey[i] + "&type=video&maxResults=1&q=" + artistNameRec + "music video";
                                fetch(youtubeAPI).then(function (response) {
                                    if (response.ok) {
                                        response.json().then(function (data) {
                                            videoId = data.items[0].id.videoId;
                                            
                                            buildRecs(artistNameRec, artistBio, artistName, videoId, artistBioLong);

                                        });
                                    } else {
                                        i++;
                                        keyChecker();
                                    };
                                })

                            }

                            keyChecker();
                        });
                    };
                });

            });
        }
    });

};

//use this function for a local storage call / carousel click
//this is set up to build a single result
var getSingleArtist = function(artistName){
    var lastFmRecAPI = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistName + "&api_key=" + fmKey + "&format=json";
    fetch(lastFmRecAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                var artistBioLong = data.artist.bio.content;
                var artistBioArray = artistBioLong.split(".");
                var artistBio = artistBioArray[0] + "." + artistBioArray[1] + "." + artistBioArray[2] + "." + artistBioArray[3] + ".";

                var i = 0;
                var keyChecker = function () {
                    var youtubeAPI = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + youtubeKey[i] + "&type=video&maxResults=1&q=" + artistName + "music video";
                    fetch(youtubeAPI).then(function (response) {
                        if (response.ok) {
                            response.json().then(function (data) {
                                videoId = data.items[0].id.videoId;
                                buildArtist(artistBio, artistName, videoId, artistBioLong);

                            });
                        } else {
                            i++;
                            keyChecker();
                        };
                    })

                }

                keyChecker();
            });
        };
    });
};

var buildRecs = function (artistNameRec, artistBio, artistName, videoId, artistBioLong) {
    $("#devRecs").css("display", "none");
    $("#recs").css("display", "block");
    var originalArtist = artistName.italics();
    $("#intro-recs").html("If you like " + originalArtist + " then you may enjoy....");
    $("#videoPlayer").attr("src", "https://www.youtube.com/embed/" + videoId);
    $("#recName").html(artistNameRec);
    $("#recBio").html(artistBio);

    $("#modal-artist").html(artistNameRec);
    $("#long-bio").html(artistBioLong);

};


var buildArtist = function(artistBio, artistName, videoId, artistBioLong){
    $("#devRecs").css("display", "none");
    $("#recs").css("display", "block");
    $("#intro-recs").css("display", "none");
    $("#videoPlayer").attr("src", "https://www.youtube.com/embed/" + videoId);
    $("#recName").html(artistName);
    $("#recBio").html(artistBio);

    $("#modal-artist").html(artistName);
    $("#long-bio").html(artistBioLong);
    $("#more-recs").css("display","none");
};

//expand modal
$("#learn-more").click(function () {
    $("#modal-more-info").addClass("is-active");
});

//close modal
$(".delete").click(function () {
    $("#modal-more-info").removeClass("is-active")
});

$("#more-recs").click(function () {
    if (resultNumber === limit) {
        resultNumber = 0;
    } else {
        resultNumber++;
    };
    getRecs(artistName, resultNumber);
});

//auto-complete
$(function () {
    $("#input").autocomplete({
        source: function (request, response) {
            var results = $.ui.autocomplete.filter(artistList, request.term);
            response(results.slice(0, 10));
        }
    },
        {
            delay: 200,
            minLength: 3,
            autoFocus: true,

        });
});

