function mostrarDescripcion(element) {
    
    const descripcionDiv = element.querySelector('.descripcion');

    
    if (descripcionDiv.style.display === 'none' || descripcionDiv.style.display === '') {
        
        descripcionDiv.style.display = 'block'; 
    } else {
        
        descripcionDiv.style.display = 'none'; 
    }
}




let map;
let directionsService;
let directionsRenderer;
let infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -16.5, lng: -68.15 }, 
        zoom: 12,
    });
      
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("ruta-directions"));
      
    infoWindow = new google.maps.InfoWindow();

      
    const locationButton = document.createElement("button");
    locationButton.textContent = "Centrar en Mi Ubicación";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Ubicación encontrada.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
          browserHasGeolocation
              ? "Error: El servicio de geolocalización falló."
              : "Error: Tu navegador no soporta geolocalización."
      );
      infoWindow.open(map);
  }

  function buscarRuta(event) {
    event.preventDefault();
    const destino = document.getElementById("destino").value;

    if (!destino) {
        alert("Por favor, ingresa un destino.");
        return;
    }

      
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const origen = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

              
            const request = {
                origin: origen,
                destination: destino,
                travelMode: google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    alert("No se pudo encontrar una ruta para ese destino.");
                }
            });
        },
        () => {
            alert("No se pudo obtener tu ubicación actual.");
        }
    );
}

document.getElementById("ruta-form").addEventListener("submit", buscarRuta);

  
window.onload = initMap;
  

