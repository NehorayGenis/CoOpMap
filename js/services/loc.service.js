export const locService = {
    getLocs,
}
import { storageServices } from "./storage-services.js"

const locs = storageServices.loadFromStorage("LOCATIONS_KEY")

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}
