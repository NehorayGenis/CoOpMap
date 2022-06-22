export const mapService = {
    initMap,
    addMarker,
    panTo,
    loadAdress,
}
import { utilsService } from "./utils.js"
import { storageServices } from "./storage-services.js"

const LOCATION_KEY = "locationDB"
const API_KEY = "AIzaSyBWllYatcwJ0sya7FywYHPeICt2PwDH-SY"
var gMap
var geocoder
const gLocations = []

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log("InitMap")
    return _connectGoogleApi().then(() => {
        console.log("google available")
        gMap = new google.maps.Map(document.querySelector("#map"), {
            center: { lat, lng },
            zoom: 15,
        })
        geocoder = new google.maps.Geocoder()

        gMap.addListener("click", (mapsMouseEvent) => {
            const lat = mapsMouseEvent.latLng.lat()
            const lng = mapsMouseEvent.latLng.lng()
            const title = prompt("title of the marker?")
            const timeStamp = Date.now()
            addMarker({ lat, lng }, title, timeStamp)
        })
        console.log("Map!", gMap)
    })
}

function addMarker(loc, title = "Hello World!", timeStamp) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title,
        timeStamp
    })
    const location = getLocation(loc, title,timeStamp)
    gLocations.push(location)
    storageServices.saveToStorage(LOCATION_KEY, gLocations)
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
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

function getLocation(pos, title,createdAt, updatedAt , weather) {
    return {
        lat: pos.lat,
        lng: pos.lng,
        name: title,
        createdAt,
        updatedAt,
        weather,
        id: utilsService.makeId(),
    }
}

function loadAdress() {
    var address = document.querySelector(".adress").value
    geocoder.geocode({ address: address }, function (results, status) {
        let lat = results[0].geometry.location.lat()
        let lng = results[0].geometry.location.lng()
        // console.log(results[0].geometry.location.lat())
        // console.log(results[0].geometry.location.lng())
        addMarker({ lat, lng }, "title")
    })
}

function getLocFromStorage() {
    return storageServices.loadFromStorage(LOCATION_KEY)
}