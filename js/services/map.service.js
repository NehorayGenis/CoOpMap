export const mapService = {
    initMap,
    addMarker,
    panTo,
}

import { storageServices } from "./storage-services.js"

const API_KEY = "AIzaSyBWllYatcwJ0sya7FywYHPeICt2PwDH-SY"
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log("InitMap")
    return _connectGoogleApi().then(() => {
        console.log("google available")
        gMap = new google.maps.Map(document.querySelector("#map"), {
            center: { lat, lng },
            zoom: 15,
        })
        gMap.addListener("click", (mapsMouseEvent) => {
            const lat = mapsMouseEvent.latLng.lat()
            const lng = mapsMouseEvent.latLng.lng()
            const title = prompt("title of the marker?")
            console.log(mapsMouseEvent.latLng.lat())
            console.log(mapsMouseEvent.latLng.lng())
            addMarker({ lat, lng }, title)
        })
        console.log("Map!", gMap)
    })
}

function addMarker(loc, title = "Hello World!") {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title,
    })
    console.log(marker)
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve() //TODO: Enter your API Key
    var elGoogleApi = document.createElement("script")
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)
    console.log("here", elGoogleApi.src)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject("Google script failed to load")
    })
}
