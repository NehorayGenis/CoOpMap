import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.codeAddress = codeAddress
function onInit() {
    // buildTable()
    mapService
        .initMap()
        .then(() => {
            buildTable()
            console.log("Map is ready")
        })
        .catch(() => console.log("Error: cannot init map"))
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

    mapService.panTo(lat, lng)
}
function buildTable() {
    const location = mapService.getLocFromStorage()
    console.log(location);
    const strTHeadHTML = location.maps((loc) => {
        console.log(loc);
        return `
        <tr>
        <th class="th id ">${loc.id}</th>
        <th class="th title">${loc.name}</th>
        <th class="th created-at">${loc.createdAt}</th>
        ("</tr>")
        `
        ;
    })
    const strTBodyHTML = location.maps((loc) => {
        console.log(loc);
        return `
        <tr>
        <td class="td" onclick="onDelete('${book.id}')"><button class="read btn btn-warning" role="button" >Delete</button>
        <td class="td" onclick="onGoLocation('${book.id}')"><button class="update btn btn-primary" role="button">Go</button></td>
        ("</tr>")
        `
        ;
    })

}
function codeAddress() {
    mapService.loadAdress()
}

function onDelete () {

}