var invalid_articles; // Global articles variable
var gpsLocation;

$(function() {
	hasura_init();

	if (localStorage.getItem("gpsLocationStored") == null){
		gpsLocation = "Tatooine";
		localStorage.setItem("gpsLocationStored", gpsLocation);
	} else {
		gpsLocation = localStorage.getItem("gpsLocationStored");
	}

	validate_template_headers(reload_validate);
	
	// window.addEventListener('storage', function(e) {  
	//   gpsLocation = e.newValue;
	//   console.log(e)
	//   reload_validate();
	// });

	var intervalID = window.setInterval(checkGpsStorage, 500);
	function checkGpsStorage() {
	  if (localStorage.getItem("gpsLocationStored")!=gpsLocation) {
	  	gpsLocation = localStorage.getItem("gpsLocationStored");
	  	reload_validate();
	  }
	}

});

function init_materialize_fns(){

	$('.button-collapse').sideNav();
	
	$('.tooltipped').tooltip({delay: 50});

 	$('.card').hover(
        function() {
            $(this).find('> .card-image > img.activator').click();
        }, function() {
            $(this).find('> .card-reveal > .card-title').click();
        }
    );

 	$(".card-action > a").click(function(e){
 		e.preventDefault();
 		var btn = e.target.closest('a')
 		var post_id = btn.classList[3];
    	if(btn.innerHTML.includes("Legit")){
    		vote("+1", post_id);
    		$('.'+post_id).addClass('disabled');
    		Materialize.toast("Marked Legit! Thank you for contributing!",2000)
    	}
    	else if(btn.innerHTML.includes("Fake")){
    		vote("-1", post_id);
    		$('.'+post_id).addClass('disabled');
    		Materialize.toast("Marked Fake! Thank you for contributing!",2000)
    	}
	});
}

function vote(type, post_id){
	hasura.data.query({
    	"type": "run_sql",
    	"args": {
        	"sql": "UPDATE article SET votes = votes "+type+" WHERE id = "+post_id
    	}
	});
}

function hasura_init() {
    hasura.setBaseDomain('contain50.hasura-app.io');
    // hasura.disableHttps(); // No HTTPS enabled on local-development
}

function fetch_invalid_articles(callback, callback2) {
    hasura.data.query({
        type: 'select',
        args: {
            table: 'article',
            columns: ["id", "created_on", "headline", "content"],
            where: {
                "$and": [
                    { "status": "invalid" },
                    { "location": gpsLocation }
                ]
            },
            "order_by": "-created_on",
        }
    }, (data) => {invalid_articles=data; callback(callback2);}, (error) => { console.log(error) });
}

function validate_template_headers(callback){
    // Hide preloader
    // Append navbar and logo

    $('#preloader').hide()
	Materialize.toast('Click Location button in navbar to auto-locate!', 3000)

    $('body').append(`
		
		<ul id="mobile-demo" class="side-nav">
            <li><a class="btn waves-effect blue tooltipped" data-position="bottom" data-delay="50" data-tooltip="Click me to get GPS Location!" onClick="relocate(); return false;" href="#"><span class="gpsLocation">`+gpsLocation+`</span><i class="material-icons right">location_on</i></a></li>
            <li><a class="btn waves-effect amber" href="/validate">Validate<i class="material-icons right">done</i></a></li>
            <li><a class="btn waves-effect blue" href="/post">Post<i class="material-icons right">mode_edit</i></a></li>
        </ul>

		<div class="navbar-fixed">
	        <nav>
	            <div class="nav-wrapper grey darken-3">
	            <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons right">menu</i></a>
	            <a href="/" class="brand-logo amber black-text" style="padding: 0px 10px; font-family: 'Nothing You Could Do', cursive; font-weight: bold">The Daily Post</a>
	                <ul id="nav-mobile" class="right hide-on-med-and-down	">
	                    <li><a class="btn waves-effect blue tooltipped" data-position="bottom" data-delay="50" data-tooltip="Click me to get GPS Location!" onClick="relocate(); return false;" href="#"><span class="gpsLocation">`+gpsLocation+`</span><i class="material-icons right">location_on</i></a></li>
	                    <li><a class="btn waves-effect amber" href="/validate">Validate<i class="material-icons right">done</i></a></li>
	                    <li><a class="btn waves-effect blue" href="/post">Post<i class="material-icons right">mode_edit</i></a></li>
	                </ul>
	            </div>
	        </nav>
	    </div>

	    <div class="valign-wrapper" style="min-height:10vh; width:100vw">
	        <h1 class="center-block" style="font-family: 'Nothing You Could Do', cursive; font-weight: bold">Validate</h3>
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

function validate_template_articles(callback){
    // Append articles
	
    $('#news').empty();
	// Show only 6 articles , then load on scroll
 	// if (invalid_articles.length > 6) {
 	// 	len = 6;
 	// } else {
 		len = invalid_articles.length
 	// }

    for (var i = 0; i < len; i++) {

    	// Reformat date in dd mon yy format
    	var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec");
    	invalid_articles[i].created_on = invalid_articles[i].created_on+'T00:00:00+05:30'
    	invalid_articles[i].created_on = new Date(invalid_articles[i].created_on);
    	invalid_articles[i].created_on =  invalid_articles[i].created_on.getDate() +' '+ m_names[invalid_articles[i].created_on.getMonth()] +', '+  invalid_articles[i].created_on.getFullYear();

        $('#news').append(`    
			<div class="col s4 m4 cards-container">
		        <div class="card sticky-action">
		            <div class="card-image waves-effect waves-block waves-light">
		                <img class="activator" src="grey-wallpaper.jpg"> <!--http://lorempixel.com/1000/500/nature/-->
		            </div>
		            <div class="card-content">
		                <span class="card-title activator grey-text text-darken-4">` + invalid_articles[i].headline + `<i class="material-icons right">more_vert</i></span>
		                <p><strong>` + invalid_articles[i].created_on + `</strong></p>
		            </div>
	                <div class="card-action">
						<a href="" class="small btn blue `+invalid_articles[i].id+`">Legit <i class="material-icons right">thumb_up</i></a>
						<a href="" class="small btn red `+invalid_articles[i].id+`">Fake <i class="material-icons right">thumb_down</i></a>
	                </div>
		            <div class="card-reveal">
		                <span class="card-title grey-text text-darken-4"> <i class="material-icons right">close</i>` + invalid_articles[i].headline + `</span>
		                <p><strong>` + invalid_articles[i].created_on + `</strong></p>
		                <p>` + invalid_articles[i].content + `</p>
		            </div>
		        </div>
		    </div>`)
    }
    callback();
}

function reload_validate(){
	$('.gpsLocation').text(gpsLocation);
	$('#news').hide();
	$('#preloader2').show();
	fetch_invalid_articles(validate_template_articles, init_materialize_fns);
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
			url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&sensor=true";

			$.ajax(url).done(function(data) {
		        for (var j = 0; j < data.results[0].address_components.length; j++) {
		            for (var k = 0; k < data.results[0].address_components[j].types.length; k++) {
		                if (data.results[0].address_components[j].types[k] === 'sublocality_level_1') {
		                    gpsLocation = data.results[0].address_components[j].long_name;
		                    localStorage.setItem("gpsLocationStored", gpsLocation);
							reload_validate();
							if (!(gpsLocation=="Tatooine"))
								Materialize.toast('Location updated to '+gpsLocation+'!', 3000)
		                }
		            }
		        }
			});
		});
	}
}