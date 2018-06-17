import {
  compare2Urls,
  compareStrings,
  compareUrlToKnownArticles
} from "./client-hash/index.js";

const printAsPrettyPercent = value => Math.round(value * 10000) / 100 + "%";

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("#createHash").addEventListener("click", () => {
    document.querySelector("#loading").textContent = "Loading...";

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var url = tabs[0].url;
      console.log("urL?", url);

      compareUrlToKnownArticles(url)
        .then(displaySuccess)
        .catch(displayError);
    });
  });
});

const displaySuccess = ({ maxValue, titleForMaxValue }) => {
  document.querySelector("#createHash").remove();
  document.querySelector("#loading").remove();
  document.querySelector("#percentage").textContent = printAsPrettyPercent(
    maxValue
  );
  document.querySelector("#title").textContent = "Reuters: " + titleForMaxValue;
};

const displayError = error => {
  document.querySelector("#error").textContent = error;
};
