export const mapService = {
    initMap,
    addMarker,
    panTo,
    loadAdress,
    getLocFromStorage,
    goLocation,
    deleteLocation,
    setDefualtLocation,
}
import { utilsService } from "./utils.js"
import { storageServices } from "./storage-services.js"

const LOCATION_KEY = "locationDB"
const API_KEY = "AIzaSyBWllYatcwJ0sya7FywYHPeICt2PwDH-SY"
var gMap
var geocoder
let gLocations = []

function initMap(cb, lat = 32.0749831, lng = 34.9120554) {
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
            cb(getLocFromStorage() || [])
        })
        cb(getLocFromStorage() || [])
    })
}
function renderFilterByQueryStringParams() {
    // Retrieve data from the current query-params
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        lat: +queryStringParams.get("lat") || 0,
        lng: +queryStringParams.get("lng") || 0,
    }
    if (!location.lat && !location.lng) {
        location.lat = 32.0749831
        location.lng = 34.9120554
    }
    return location
}

function addMarker(loc, title = "Hello World!", timeStamp) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title,
        timeStamp,
    })
    const location = getLocation(loc, title, timeStamp)
    gLocations.unshift(location)
    console.log(gLocations)
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
    let weatherPrm = getWeather(lat, lng).then((res) => {
        document.querySelector(`.weather-today`).innerText = res.weather[0].description
        document.querySelector(`.temp`).innerHTML = `${Math.trunc(res.main.temp - 273.15)} &#8451;`
        document.querySelector(`.country-location`).innerText = res.sys.country
        document.querySelector(`.city-location`).innerText = res.name
        document.querySelector(`.wind`).innerText = res.wind.speed + " m/s"
        console.log(res)
    })
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
        const timeStamp = Date.now()
        addMarker({ lat, lng }, address, timeStamp)
        onPanTo(lat, lng)
    })
}

function getLocFromStorage() {
    return storageServices.loadFromStorage(LOCATION_KEY)
}

function goLocation(id) {
    const locations = mapService.getLocFromStorage()
    const { lat, lng, name, createdAt } = locations.find((loc) => loc.id === id)
    const pos = { lat, lng }
    mapService.panTo(lat, lng)
    mapService.addMarker(pos, name, createdAt)
}

function deleteLocation(id) {
    const locations = getLocFromStorage()
    const locIdx = locations.findIndex((loc) => loc.id === id)
    gLocations.splice(locIdx, 1)
    storageServices.saveToStorage(LOCATION_KEY, gLocations)
}

function getWeather(lat, lng) {
    const weatherPrm = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=7e8ccb1200a8a51436c13ca1bfe65a6e`)
    return weatherPrm.then((res) => {
        return res.json()
    })
}

function setDefualtLocation() {
    const pos = renderFilterByQueryStringParams()
    const defaultLocation = [
        {
            lat: pos.lat,
            lng: pos.lng,
            name: "default location",
            createdAt: Date.now(),
            id: utilsService.makeId(),
        },
    ]
    gLocations = defaultLocation
    storageServices.saveToStorage(LOCATION_KEY, gLocations)
    return defaultLocation
}
