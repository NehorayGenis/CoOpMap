export const mapService = {
    initMap,
    addMarker,
    panTo,
    loadAdress,
    getLocFromStorage
}
import { utilsService } from "./utils.js"
import { storageServices } from "./storage-services.js"

const LOCATION_KEY = "locationDB"
const API_KEY = "AIzaSyBWllYatcwJ0sya7FywYHPeICt2PwDH-SY"
var gMap
var geocoder
const gLocations = []

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi().then(() => {
        var startingLoc = renderFilterByQueryStringParams()
        gMap = new google.maps.Map(document.querySelector("#map"), {
            center: { lat: startingLoc.lat, lng: startingLoc.lng },
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
    })
}
function renderFilterByQueryStringParams() {
    // Retrieve data from the current query-params
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        lat: +queryStringParams.get("lat") || 0,
        lng: +queryStringParams.get("lng") || 0,
    }
    if (!filterBy.lat && !filterBy.lng) {
        filterBy.lat = 32.0749831
        filterBy.lng = 34.9120554
    }
    return filterBy
}

function addMarker(loc, title = "Hello World!", timeStamp) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title,
        timeStamp,
    })
    const location = getLocation(loc, title, timeStamp)
    gLocations.push(location)
    storageServices.saveToStorage(LOCATION_KEY, gLocations)
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    var str = `https://nehoraygenis.github.io/CoOpMap/?lat=${lat}&lng=${lng}`
    const queryStringParams = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, "", newUrl)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    // if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement("script")
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)
    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject("Google script failed to load")
    })
}

function getLocation(pos, title, createdAt) {
    return {
        lat: pos.lat,
        lng: pos.lng,
        name: title,
        createdAt,
        id: utilsService.makeId(),
    }
}

function loadAdress() {
    var address = document.querySelector(".adress").value
    geocoder.geocode({ address }, function (results, status) {
        let lat = results[0].geometry.location.lat()
        let lng = results[0].geometry.location.lng()
        addMarker({ lat, lng }, address)
        onPanTo(lat, lng)
    })
}

function getLocFromStorage() {
    return storageServices.loadFromStorage(LOCATION_KEY)
}