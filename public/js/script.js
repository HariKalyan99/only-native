const socket = io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    },(error) => {
        console.error(error)
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    })
}

const map = L.map('map').setView([51.505, -0.09], 13);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const markers = {};

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);

    if(markers[id]){
        markers[id].setLatLng([latitude, longitude], 16);

    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})




L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();
