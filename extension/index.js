import {
  compare2Urls,
  compareStrings,
  compareUrlToKnownArticles
} from "./client-hash/index.js";

const printAsPrettyPercent = value => Math.round(value * 10000) / 100 + "%";

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("#createHash").addEventListener("click", () => {
    document.querySelector("#target").textContent = "Loading...";

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var url = tabs[0].url;
      console.log("urL?", url);

      compareUrlToKnownArticles(url)
        .then(({ maxValue, titleForMaxValue }) => {
          document.querySelector("#target").textContent =
            "Found max value: " +
            printAsPrettyPercent(maxValue) +
            " for article " +
            titleForMaxValue;
        })
        .catch(error => {
          document.querySelector("#target").textContent = error;
        });
    });
  });
});
