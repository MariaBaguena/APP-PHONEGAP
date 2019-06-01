$(document).on("mobileinit", function(){

$(function(){
	

	//Petición a la API. GEOLOCALIZAR CUANDO ENTRAS EN LA APP.

		$("#main").on("pageinit", function(){ 

			//$("#getweather").click(function(){
				var lat;
				var long;

				navigator.geolocation.getCurrentPosition(fn_ok, fn_error);
				function fn_ok(position){

					lat = position.coords.latitude;
					long = position.coords.longitude;
					//alert('Your latitud is :'+lat+' and longitude is '+long);

					//PETICIÓN AJAX DEL FICHERO JSON
					$.ajax({

					

						url: 'http://api.openweathermap.org/data/2.5/weather?appid=a8699c4af829b447aec227416e5909f7',
						data:{ lat: lat, lon: long},
						success: function (tiempo) {
						

							let temperatura = tiempo.main.temp-272.15;
							temperatura = temperatura.toFixed(0);
							let tempmax = tiempo.main.temp_max-272.15;
							tempmax = tempmax.toFixed(0);
							let tempmin = tiempo.main.temp_min-272.15;
							tempmin = tempmin.toFixed(0); 
					


							//PINTAR DATOS DE LA API EN LOS DIVS
							$("#NombreCiudad").html(tiempo.name);
							$("#Temperature").html(temperatura+'º');
							$("#Weather").html(tiempo.weather[0].main);
						
							$("#Icon").html("</b><img src='images/"+ tiempo.weather[0].icon + ".png'></p>");
							console.log(icon);
							$("#D1").html(main.humidity);


						},

						error: function(textStatus,errorThrown){
							alert('Lo sentimos ha habido un error:' +errorThrown);
						}

					});
				}

				function fn_error(fallo){
					alert('Hubo un problema al consultar los datos:' +fallo.message)
				}


		});
			


	

	//Al hacer click sobre la ciudad en el buscador, pasa a la pagina detalle. 

		$("#Search").on("click", 'li', function(){
			
			
			let ciudad = "<li><a href='#'>" + $(this).context.innerHTML + "</a></li>";
			$('#ciudades').append(ciudad);
			$('#ciudades').listview("refresh");

			//--------- prueba localstorage

			// traer valor actual del storage
			let ciudades = JSON.parse(localStorage.getItem('ciudades'));
			if(ciudades == null){
				ciudades = [];
			}
			// añadir en el array nueva ciudad
			ciudades.push($(this).context.innerHTML);
			

			// escribir en el storage el array
			localStorage.setItem('ciudades', JSON.stringify(ciudades));


			$.mobile.changePage("#CityPage", {transition: "slideup"});
		});

		//ver el detalle de la ciudad

		$(document).on("click", '#ciudades li', function(){
		 // alert("Hola");
		 //coger el nombre del elemento al que le hecho clic
			//hacer petición ajax pero con el nombre en vez de con lati y long

			//PETICIÓN AJAX DEL FICHERO JSON
			

			$.ajax({

				url: 'http://api.openweathermap.org/data/2.5/weather?appid=a8699c4af829b447aec227416e5909f7',
				data:{ q: $(this).context.innerText, units: "metric" },
				success: function (tiempo) {
				

					let temperatura = tiempo.main.temp;
					temperatura = temperatura.toFixed(0);
					let tempmax = tiempo.main.temp_max;
					tempmax = tempmax.toFixed(0);
					let tempmin = tiempo.main.temp_min;
					tempmin = tempmin.toFixed(0); 

					// pintar los datos de la respuesta

					//PINTAR DATOS DE LA API EN LOS DIVS
					$("#NombreCiudad").html(tiempo.name);
					$("#Temperature").html(temperatura+'º');
					$("#Weather").html(tiempo.weather[0].main);
					$("#Icon").html(tiempo.icon);
					//$(".N1").html(tiempo.clouds);


				},

				error: function(textStatus,errorThrown){
					alert('Lo sentimos ha habido un error:' +errorThrown);
				}

			});
			
			//cambiar de página
			window.location.href="index.html#main";
		});


			//FUNCIÓN AUTOCOMPLETE PARA QUE AL EMPEZAR A ESCRIBIR EN EL BUSCADOR SE TE COMPLETEN CON LAS OPCIONES DE CIUDADES.

		$("#Search").on("pageinit", function(){

			$("#autocomplete").on( "filterablebeforefilter", function ( e, data ) {

		            var $ul = $( this ),
		            $input = $( data.input ),
		            value = $input.val(),
		            html = "";
		        $ul.html( "" );
		        if ( value && value.length > 2 ) {
		            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
		            $ul.listview( "refresh" );
		            $.ajax({
		                url: "http://gd.geobytes.com/AutoCompleteCity",
		                dataType: "jsonp",
		                crossDomain: true,
		                data: {
		                    q: $input.val()
		                }
		            })

		            .then( function ( response ) {
		                $.each( response, function ( i, val ) {
		                    html += "<li>" + val + "</li>";
		                });
		                $ul.html( html );
		                $ul.listview( "refresh" );
		                $ul.trigger( "updatelayout");
                    });
                }


            });

		});

		    

	//localStorage


	$("#CityPage").on("pageinit",function(){
		// trae datos del storage
		
		let ciudad = JSON.parse(localStorage.getItem('ciudades'));

		
		if(ciudad == null){
			ciudad = [];
		}else{
		
			$.each(ciudad, function (ind, elems) {
				$("#ciudades").append("<li class='item'><a href='#'>"+ ciudad[ind]+"</a></li>");
			});

			$("#ciudades").listview( "refresh" );
			$("#ciudades").trigger( "updatelayout");
		}
	});

	

								
	

	}); 
});


