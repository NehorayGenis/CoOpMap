import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"
import { storageServices } from "./services/storage-services.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.codeAddress = codeAddress
window.onGoLocation = onGoLocation
window.onDelete = onDelete
function onInit() {
    mapService.initMap(buildTable).catch((err) => console.error("Error: cannot init map", err))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat = 32.0749831, lng = 34.9120554) {
    mapService.addMarker({ lat, lng })
    buildTable()
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        document.querySelector(".locs").innerText = JSON.stringify(locs)
    })
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            document.querySelector(".user-pos").innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch((err) => {
            console.log("err!!!", err)
        })
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    mapService.panTo(lat, lng)

    buildTable(mapService.getLocFromStorage())
}
function buildTable(locations) {
    if (!locations || !locations.length) {
        locations = mapService.setDefualtLocation()
    }
    const strHTML = locations.map((loc) => {
        return `
        <tr>
        <td class="td id ">${loc.id}</td> 
        <td class="td title">${loc.name}</td>
        <td class="td created-at">${loc.createdAt}</td>
        <td class="td" onclick="onDelete('${loc.id}')"><button class="read btn btn-warning" role="button" >Delete</button>
        <td class="td" onclick="onGoLocation('${loc.id}')"><button class="update btn btn-success" role="button">Go</button></td>
        </tr>
        `
    })

    const elTBody = document.querySelector(".tbody")
    elTBody.innerHTML = strHTML
}
function codeAddress() {
    mapService.loadAddress()
}

function onDelete(id) {
    const locations = mapService.deleteLocation(id)
    buildTable(locations)
    mapService.initMap(buildTable).catch((err) => console.error("Error: cannot init map", err))
}

function onGoLocation(id) {
    mapService.goLocation(id)
}
