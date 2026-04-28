const { default: axios } = require("axios");

// export const BASE_URL = "http://localhost:9090"
export const BASE_URL = "https://linkbond.onrender.com/"

export const clientServer = axios.create({
    baseURL: BASE_URL,
})