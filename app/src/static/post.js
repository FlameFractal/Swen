var gpsLocation;

$(function() {

    hasura_init(function() {
        post_page_template(function() {
            init_materialize_fns();
        });
    });

    $('.tooltipped').tooltip({ delay: 50 });

    if (localStorage.getItem("gpsLocationStored") == null) {
        gpsLocation = "Tatooine";
        localStorage.setItem("gpsLocationStored", gpsLocation);
    } else {
        console.log("from storage")
        gpsLocation = localStorage.getItem("gpsLocationStored");
        reload_post();
    }

    // window.addEventListener('storage', function(e) {  
    //   gpsLocation = e.newValue;
    //   console.log(e)
    //   reload_post();
    // });

    var intervalID = window.setInterval(checkGpsStorage, 500);

    function checkGpsStorage() {
        if (localStorage.getItem("gpsLocationStored") != gpsLocation) {
            gpsLocation = localStorage.getItem("gpsLocationStored");
            reload_post();
        }
    }
});

function hasura_init(callback) {
    hasura.setBaseDomain('c100.hasura.me');
    // hasura.disableHttps(); // No HTTPS enabled on local-development
    callback();
}

function init_materialize_fns() {

    $(".button-collapse").sideNav();

    $('input#headline, textarea#content').characterCounter();

    $('.tooltipped').tooltip({ delay: 50 });

    $('#submit-btn').click(function(e){
        e.preventDefault();

        var headline = $('#headline').val();
        var content = $('#content').val();

        if (headline.length < 10) {
            Materialize.toast('Headline should be atleast 10 characters',2000);
            return;
        }

        if (content.length < 120) {
            Materialize.toast('Content should be atleast 120 characters',2000);
            return;
        }

        hasura.data.query({
            type: 'insert',
            args: {
                table: 'article',
                objects: [{"location":gpsLocation, "headline":headline, "content":content}]
            }
        },(data) => {$("input[type=text], textarea").val("");Materialize.updateTextFields();Materialize.toast("Submitted post!",3000)}, (error) => {console.log(error); Materialize.toast("Could not submit for some reason! Try again in a while.",3000)});
    });
}

function post_page_template(callback) {

    $('#preloader').hide()
    Materialize.toast('Click Location button in navbar to auto-locate!', 3000)

    $('body').append(`

        <ul id="mobile-demo" class="side-nav">
            <li><a class="btn waves-effect blue tooltipped" data-position="bottom" data-delay="50" data-tooltip="Click me to get GPS Location!" onClick="relocate(); return false;" href="#"><span id="gpsLocation" class="gpsLocation"></span><i class="material-icons right">location_on</i></a></li>
            <li><a class="btn waves-effect blue" href="validate">Validate<i class="material-icons right">done</i></a></li>
            <li><a class="btn waves-effect amber" href="/post">Post<i class="material-icons right">mode_edit</i></a></li>
        </ul>

	    <div class="navbar-fixed">
	        <nav>
	            <div class="nav-wrapper grey darken-3">
                    <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
                    <a href="/" class="brand-logo amber black-text" style="padding: 0px 10px; font-family: 'Nothing You Could Do', cursive; font-weight: bold">The Daily Post</a>
	                <ul id="nav-mobile" class="right hide-on-med-and-down   ">
	                <li><a class="btn waves-effect blue tooltipped" data-position="bottom" data-delay="50" data-tooltip="Click me to get GPS Location!" onClick="relocate(); return false;" href="#"><span id="gpsLocation" class="gpsLocation"></span><i class="material-icons right">location_on</i></a></li>
	                    <li><a class="btn waves-effect blue" href="validate">Validate<i class="material-icons right">done</i></a></li>
	                    <li><a class="btn waves-effect amber" href="/post">Post<i class="material-icons right">mode_edit</i></a></li>
	                </ul>
	            </div>
	        </nav>
	    </div>
	    <div class="valign-wrapper" style="min-height:10vh; width:100vw">
	        <h1 class="center-block" style="font-family: 'Nothing You Could Do', cursive; font-weight: bold">Post in <span class="gpsLocation"></span></h3>
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
		<br/><br/><br/><br/>
			<div class="container">
		     <div class="row">
			    <form class="col s12">
			      <div class="row">
			        <div class="input-field col s12">
			          <input id="headline" type="text" class="validate" data-error="wrong" data-success="right" data-length="10" pattern=".{10,}"   required title="10 characters minimum">
			          <label for="headline">Headline</label>
			        </div>
		           </div>
		           <div class="row">
			        <div class="input-field col s12">
			          <textarea id="content" style="height:10rem" class="materialize-textarea validate" data-error="wrong" data-success="right" data-length="120" pattern=".{120,}"   required title="120 characters minimum"></textarea>
			          <label for="content">Content</label>
			        </div>
			      </div>
		        <div class="row center-align">
					<a href="#" class="btn waves-effect waves-light" id="submit-btn">Submit News<i class="material-icons right">send</i></a>
		        <div>
		        </form>
		    </div>
			</div>
	`)
    callback();
}

function reload_post() {
  
    $('.gpsLocation').text(gpsLocation);
}

function relocate() {

    var locality_name;
    if (!navigator.geolocation) {
        // Material Tost
    } else {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";

            $.ajax(url).done(function(data) {
                console.log(data);
                for (var j = 0; j < data.results[0].address_components.length; j++) {
                    for (var k = 0; k < data.results[0].address_components[j].types.length; k++) {
                        if (data.results[0].address_components[j].types[k] === 'sublocality_level_1') {
                            gpsLocation = data.results[0].address_components[j].long_name;
                            localStorage.setItem("gpsLocationStored", gpsLocation);
                            reload_post();
                            if (!(gpsLocation == "Tatooine"))
                                Materialize.toast('Location updated to ' + gpsLocation + '!', 3000)
                        }
                    }
                }
            });
        });
    }
}