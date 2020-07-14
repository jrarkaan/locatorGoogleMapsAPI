 // global variables
  let map;
  let markers = [];
  let infoWindow;
  // methods
  const searchStores = () => {
    let foundStores = [];
    let zipCode = document.getElementById('zip-code-input').value
    if(zipCode){
      stores.forEach((store)=>{
        let postal = store.address.postalCode.substring(0,5);
        if(postal == zipCode){
          foundStores.push(store);
        }
      });
    }else {
      foundStores = stores;
    }
    displayStores(foundStores);
    clearLocation();
    showStoresMarker(foundStores);
    setOnClickListener();
  }

  const clearLocation = () => {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }

  const setOnClickListener = () => {
    let storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach( (elem, index) => {
      elem.addEventListener('click', () => { //'mouseover'
        google.maps.event.trigger(markers[index], 'click');
      })
    })
  }

  const displayStores = (stores) => {
    let storesHTML = "";
    stores.forEach((store, index) => {
      let address = store.addressLines;
      let phone = store.phoneNumber;
      storesHTML += `
          <div class="store-container">
            <div class="store-container-background">
              <div class="store-info-container">
                <div class="store-address">
                  <span>${address[0]}</span>
                  <span>${address[1]}</span>
                </div>
                <div class="store-phone-number">${phone}</div>
              </div>
              <div class="store-number-container">
                <div class="store-number">
                  ${index + 1}
                </div>
              </div>
            </div>
          </div>
      `
    });
    document.querySelector('.stores-list').innerHTML = storesHTML;
  }

  const showStoresMarker = (stores) => {
    let bounds = new google.maps.LatLngBounds();
    stores.forEach((store, index) => {
      let latlng = new google.maps.LatLng(
        store.coordinates.latitude,
        store.coordinates.longitude
      );
      let name = store.name;
      let address = store.addressLines[0];
      let statusText = store.openStatusText;
      let phone = store.phoneNumber;
      bounds.extend(latlng);
      createMarker(latlng, name, address, statusText, phone, index);
    })
    map.fitBounds(bounds);
  }

  const createMarker = (latlng, name, address, statusText, phone, index) => {
    let html = `
        <div class="store-info-window">
          <div class="store-info-name">
            ${name}
          </div>
          <div class="store-info-status">
            ${statusText}
          </div>
          <div class="store-info-address">
            <div class="circle">
              <i class="fas fa-location-arrow"></i>
            </div>
            ${address}
          </div>
          <div class="store-info-phone">
            <div class="circle">
              <i class="fas fa-phone-alt"></i>
            </div>
            ${phone}
          </div>
        </div>
    `;
    let marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: `${index+1}`
    });
    google.maps.event.addListener(marker, 'click', () => { // 'mouseover'
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    })
    markers.push(marker);
  }
  // function to load API Maps
  function initMap() {
    let losAngles = {
      lat: 34.063380,
      lng: -118.358080
    }
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngles,
      zoom: 8
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
    setOnClickListener();
  }
