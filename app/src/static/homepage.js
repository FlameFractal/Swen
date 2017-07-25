var valid_articles=''; // Global articles variable
var gpsLocation;

$(function() {
	
	hasura_init();

	if (localStorage.getItem("gpsLocationStored") == null){
		gpsLocation = "Tatooine";
		localStorage.setItem("gpsLocationStored", gpsLocation);
	} else {
		gpsLocation = localStorage.getItem("gpsLocationStored");
	}

	homepage_template_headers(reload_homepage);

	// window.addEventListener('storage', function(e) {  
	//   gpsLocation = e.newValue;
	//   console.log(e);
	//   reload_homepage();
	// });

	var intervalID = window.setInterval(checkGpsStorage, 1000);
	function checkGpsStorage() {
		console.log()
	  if (localStorage.getItem("gpsLocationStored")!=gpsLocation) {
	  	gpsLocation = localStorage.getItem("gpsLocationStored");
	  	reload_homepage();
	  }
	}


});


function init_materialize_fns(){
	
    $(".button-collapse").sideNav();

	$('.tooltipped').tooltip({delay: 50});

 	$('.card').hover(
        function() {
            $(this).find('> .card-image > img.activator').click();
        }, function() {
            $(this).find('> .card-reveal > .card-title').click();
        }
    );

}

function hasura_init() {
    hasura.setBaseDomain('contain50.hasura-app.io');
    // hasura.disableHttps(); // No HTTPS enabled on local-development
}

function fetch_homepage_articles(callback, callback2) {
	valid_articles = '';
    hasura.data.query({
        type: 'select',
        args: {
            table: 'article',
            columns: ["created_on", "headline", "content"],
            where: {
                "$and": [
                    { "status": "valid" },
                    { "location": gpsLocation }
                ]
            },
            "order_by": "-created_on",
        }
    }, (data) => {valid_articles=data; console.log(data); console.log(valid_articles); callback(callback2);}, (error) => { console.log(error) });
}

function homepage_template_headers(callback){
    // Hide preloader
    // Append navbar and logo

    $('#preloader').hide()
	Materialize.toast('Click Location button in navbar to auto-locate!', 3000)

    $('body').append(`

        <ul id="mobile-demo" class="side-nav">
            <li><a class="btn waves-effect blue tooltipped" data-position="bottom" data-delay="50" data-tooltip="Click me to get GPS Location!" onClick="relocate(); return false;" href="#"><span class="gpsLocation">`+gpsLocation+`</span><i class="material-icons right">location_on</i></a></li>
            <li><a class="btn waves-effect blue" href="validate">Validate<i class="material-icons right">done</i></a></li>
            <li><a class="btn waves-effect blue" href="/post">Post<i class="material-icons right">mode_edit</i></a></li>
        </ul>
		<div class="navbar-fixed">
	        <nav>
	            <div class="nav-wrapper grey darken-3">
	                <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
	                <ul id="nav-mobile" class="right hide-on-med-and-down">
	                    <li><a class="btn waves-effect blue tooltipped" data-position="bottom" data-delay="50" data-tooltip="Click me to get GPS Location!" onClick="relocate(); return false;" href="#"><span class="gpsLocation">`+gpsLocation+`</span><i class="material-icons right">location_on</i></a></li>
	                    <li><a class="btn waves-effect blue" href="validate">Validate<i class="material-icons right">done</i></a></li>
	                    <li><a class="btn waves-effect blue" href="/post">Post<i class="material-icons right">mode_edit</i></a></li>
	                </ul>
	            </div>
	        </nav>
	    </div>
	    <div class="amber valign-wrapper" style="min-height:10vh; width:100vw">
	        <h1 class="center-block" style="font-family: 'Nothing You Could Do', cursive; font-weight: bold"> The Daily Post</h3>
	        <h3 class="center-block" style="font-family: 'Nothing You Could Do', cursive; font-weight: bold"> The Daily Post</h3>
	    </div>

        <div id="preloader2" style="display:none; margin-top: 25vh; margin-left: 45vw;">
	        <div class="preloader-wrapper big active">
	            <div class="spinner-layer spinner-blue-only">
	                <div class="circle-clipper left">
	                    <div class="circle"></div>
	                </div>
	                <div class="gap-patch">
	                    <div class="circle"></div>
	                </div>
	                <div class="circle-clipper right">
	                    <div class="circle"></div>
	                </div>
	            </div>
	        </div>
	    </div>



    <!-- Start of articles cards -->
    <div class="row container" id="news">
    </div>

    </div>
    <!-- End of articles -->

	`)
	callback();
}

function homepage_template_articles(callback){
    // Append articles
	
    $('#news').empty();
 	console.log(valid_articles);
    // Show only 6 articles , then load on scroll
 	// if (valid_articles.length > 6) {
 	// 	len = 6;
 	// } else {
 		len = valid_articles.length
 	// }

    for (var i = 0; i < len; i++) {

    	// Reformat date in dd mon yy format
    	var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec");
    	valid_articles[i].created_on = valid_articles[i].created_on+'T00:00:00+05:30'
    	valid_articles[i].created_on = new Date(valid_articles[i].created_on);
    	valid_articles[i].created_on =  valid_articles[i].created_on.getDate() +' '+ m_names[valid_articles[i].created_on.getMonth()] +', '+  valid_articles[i].created_on.getFullYear();

        $('#news').append(`    
			<div class="col s12 m6 l4 cards-container">
		        <div class="card sticky-action">
		            <div class="card-image waves-effect waves-block waves-light">
		                <img class="activator" src="grey-wallpaper.jpg"> <!--http://lorempixel.com/1000/500/nature/-->
		            </div>
		            <div class="card-content">
		                <span class="card-title activator grey-text text-darken-4">` + valid_articles[i].headline + `<i class="material-icons right">more_vert</i></span>
		                <p><strong>` + valid_articles[i].created_on + `</strong></p>
		            </div>
		            <div class="card-reveal">
		                <span class="card-title grey-text text-darken-4"> <i class="material-icons right">close</i>` + valid_articles[i].headline + `</span>
		                <p><strong>` + valid_articles[i].created_on + `</strong></p>
		                <p>` + valid_articles[i].content + `</p>
		            </div>
		        </div>
		    </div>`)
    }
    callback();
}

function reload_homepage(){
	$('.gpsLocation').text(gpsLocation);
	$('#news').hide();
	$('#preloader2').show();
	fetch_homepage_articles(homepage_template_articles, init_materialize_fns);
	$('#preloader2').hide();
	$('#news').show();
}

function relocate(){

	var locality_name;
	if (!navigator.geolocation) {
		// Material Tost
	} else {
		navigator.geolocation.getCurrentPosition(function (position){
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			url = "//maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&sensor=true";

			$.ajax(url).done(function(data) {
			    console.log(data);
		        for (var j = 0; j < data.results[0].address_components.length; j++) {
		            for (var k = 0; k < data.results[0].address_components[j].types.length; k++) {
		                if (data.results[0].address_components[j].types[k] === 'sublocality_level_1') {
		                    gpsLocation = data.results[0].address_components[j].long_name;
		                    localStorage.setItem("gpsLocationStored", gpsLocation);
							reload_homepage();
							if (!(gpsLocation=="Tatooine"))
								Materialize.toast('Location updated to '+gpsLocation+'!', 3000)
		                }
		            }
		        }
			});
		});
	}
}