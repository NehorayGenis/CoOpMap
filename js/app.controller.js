import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.codeAddress = codeAddress
window.onGoLocation = onGoLocation
window.onDelete = onDelete
function onInit() {
    mapService
        .initMap(buildTable)
        .catch((err) => console.error("Error: cannot init map", err))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log("Getting Pos")
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat = 32.0749831, lng = 34.9120554) {
    console.log("Adding a marker")
    mapService.addMarker({ lat, lng })
    buildTable()
    // setTimeout(() => {
    // }, 3000)
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        console.log("Locations:", locs)
        document.querySelector(".locs").innerText = JSON.stringify(locs)
    })
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            console.log("User position is:", pos.coords)
            document.querySelector(".user-pos").innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch((err) => {
            console.log("err!!!", err)
        })
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log("Panning the Map")
    buildTable()

    mapService.panTo(lat, lng)
}
function buildTable(locations) {
    console.log(locations);
    const strHTML = locations.map((loc) => {
        return `
        <tr>
        <td class="td id ">${loc.id}</td>
        <td class="td title">${loc.name}</td>
        <td class="td created-at">${loc.createdAt}</td>
        <td class="td" onclick="onDelete('${loc.id}')"><button class="read btn btn-warning" role="button" >Delete</button>
        <td class="td" onclick="onGoLocation('${loc.id}')"><button class="update btn btn-primary" role="button">Go</button></td>
        </tr>
        `
    })

    const elTBody = document.querySelector(".tbody")
    elTBody.innerHTML = strHTML
}
function codeAddress() {
    mapService.loadAdress()
}

function onDelete(id) {
    mapService.deleteLocation(id)
    buildTable()
}

function onGoLocation(id) {
    mapService.goLocation(id)
}
