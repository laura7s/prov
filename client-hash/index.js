require("isomorphic-fetch");
const crypto = require("crypto");

const MERCURY_END_POINT = "https://mercury.postlight.com";
const SECRET = "abcdefg";
const UNALLOWED_HTML_TAGS = ["figcaption", "damn"];

const createMercuryURL = url => MERCURY_END_POINT + "/parser?url=" + url;

const getMercuryData = mercuryUrl => {
  return fetch(mercuryUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "ANnmru0nlL3CdwJS1LFdHcqM9YKru3HGycEIqmlO"
    }
  });
};

const getHashForData = data => {
  const hash = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");
  return hash;
};

const getArticle = url => getMercuryData(createMercuryURL(url));

const EXAMPLE_URL =
  "https://www.yahoo.com/news/flooding-possible-u-southwest-where-wildfires-scorch-earth-072723370.html";
const OTHER_URL =
  "https://www.reuters.com/article/us-usa-wildfires/flooding-possible-in-u-s-southwest-where-wildfires-scorch-earth-idUSKBN1JC062";

const getHashForUrl = url =>
  getArticle(url)
    .then(result => result.json())
    .then(result => result.content)
    // .then(console.log)
    .then(removeDataBetweenHTMLTags)
    .then(removeHTMLFromString)
    .then(removeSpecialCharactersFromString)
    .then(result => {
      console.log(result);
      return result;
    })
    .then(getHashForData)
    .then(hash => {
      console.log("The article hash: ", hash);
      return hash;
    })
    .catch(error => {
      console.log("Oops! an error occured", error);
    });

const removeHTMLFromString = articleData =>
  articleData.replace(/<\/?[^>]+(>|$)/g, "").trim();

const removeSpecialCharactersFromString = articleData => {
  const regex = /\&[^\s]*;/g;

  return articleData.replace(regex, "");
};

const removeDataBetweenHTMLTags = articleData =>
  UNALLOWED_HTML_TAGS.reduce(
    (accumulator, tagToRemove) =>
      accumulator.replace(
        new RegExp("<" + tagToRemove + ".*>.*?</" + tagToRemove + ">", "g"),
        ""
      ),
    articleData
  );

let hash1;
Promise.all([getHashForUrl(EXAMPLE_URL), getHashForUrl(OTHER_URL)]).then(
  hashes => {
    console.log("are the hashes equal ?", hashes[0] === hashes[1]);
  }
);

module.exports = {
  removeHTMLFromString,
  removeSpecialCharactersFromString,
  removeDataBetweenHTMLTags
};
