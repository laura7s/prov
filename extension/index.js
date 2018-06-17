import { getHashForUrl } from "./client-hash/index.js";

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("#createHash").addEventListener("click", () => {
    document.querySelector("#target").textContent = "Loading...";

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var url = tabs[0].url;
      console.log("urL?", url);

      getHashForUrl(url)
        .then(hash => {
          document.querySelector("#target").textContent = hash;
        })
        .catch(error => {
          document.querySelector("#target").textContent = error;
        });
    });
  });
});
