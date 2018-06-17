// const { getHashForUrl } = require("../client-hash/index.js");
import { getHashForUrl } from "../client-hash/index.js";

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("#createHash").addEventListener("click", () => {
    console.log("URL?");
    console.log("URL?", window.location);

    // getHashForUrl().then(() => {
    //   document.querySelector("#target").textContent = "duuude";
    // });
  });
});
