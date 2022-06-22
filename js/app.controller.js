import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.codeAddress = codeAddress
function onInit() {
    mapService
        .initMap()
        .then(() => {
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
    const location = getLocFromStorage()
    const str = locs.maps((loc) => {
        return `
        '<tr>
        '<td class="td id ">${book.id}</td>``<td class="td title">${book.title}</td>``<td class="td price">💲<span>${book.price}</span></td>``<td class="td" onclick="onDelete('${book.id}')"><button class="read btn btn-warning" role="button" >Read</button></td>``<td class="td" onclick="onGoLocation('${book.id}')"><button class="update btn btn-primary" role="button">Update</button></td>`
        ;("</tr>")
    })
}
function codeAddress() {
    mapService.loadAdress()
}

// let trs = books.map((book) => {
//     let strHTML = '<tr>'
//     strHTML += `<td class="td id ">${book.id}</td>`
//     strHTML += `<td class="td title">${book.title}</td>`
//     strHTML += `<td class="td price">💲<span>${book.price}</span></td>`
//     strHTML += `<td data-trans="read-book" class="td" onclick="onReadBook('${book.id}')"><button class="read btn btn-warning" role="button" >Read</button></td>`
//     strHTML += `<td data-trans="update" class="td" onclick="onUpdateBook('${book.id}')"><button class="update btn btn-primary" role="button">Update</button></td>`
//     strHTML += `<td data-trans="delete" class="td" onclick="onDeleteBook('${book.id}')"><button class="delete btn btn-danger" role="button">Delete</button></td>`
//     strHTML += `<td class="td" onclick="onPlus('${book.id}')"><button class="add-rate btn btn-success" role="button">➕</button></td>`
//     strHTML += `<td class="td rate-${book.id}" >${book.rate}</td>`
//     strHTML += `<td class="td" onclick="onMinus('${book.id}')"><button class="decrease-rate btn btn-danger" role="button">➖</button></td>`
//     strHTML += '</tr>'
//     return strHTML;
// })
