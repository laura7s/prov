require("isomorphic-fetch");
const crypto = require("crypto");

const MERCURY_END_POINT = "https://mercury.postlight.com";
const SECRET = "abcdefg";
const UNALLOWED_HTML_TAGS = ["figcaption", "damn"];

const EXAMPLE_URL =
  "https://www.yahoo.com/news/flooding-possible-u-southwest-where-wildfires-scorch-earth-072723370.html";
const OTHER_URL =
  "https://www.reuters.com/article/us-usa-wildfires/flooding-possible-in-u-s-southwest-where-wildfires-scorch-earth-idUSKBN1JC062";

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

const makeLogIntermediateStep = text => result => {
  console.log(text + ": ", result);
  return result;
};

const removeHTMLFromString = string => string.replace(/<\/?[^>]+(>|$)/g, "");

const removeSpecialCharactersFromString = string => {
  const regex = /\&[^\s]*;/g;
  return string.replace(regex, "");
};

const removeLeadingCapsString = string => {
  const newString = string.slice();
  const matches = newString.match(/[a-z][A-Z]/gm, "");
  if (!matches || matches.length === 0) {
    return string;
  }
  const [firstMatch] = matches;
  const index = newString.indexOf(firstMatch);
  return removeReasonableAmountOfString(
    newString.slice(index).slice(1),
    string
  );
};

const removeTrailingCapsString = string => {
  const newString = string.slice();
  const matches = newString.match(/[a-z][A-Z]/gm, "");
  if (!matches || matches.length === 0) {
    return string;
  }
  const lastMatch = matches[matches.length - 1];
  const index = newString.indexOf(lastMatch);
  return removeReasonableAmountOfString(
    newString.slice(0, index) + newString[index],
    string
  );
};

const removeReasonableAmountOfString = (newString, oldString) =>
  newString.length / oldString.length > 0.8 ? newString : oldString;

const removeDataBetweenHTMLTags = string =>
  UNALLOWED_HTML_TAGS.reduce(
    (accumulator, tagToRemove) =>
      accumulator.replace(
        new RegExp("<" + tagToRemove + ".*>.*?</" + tagToRemove + ">", "g"),
        ""
      ),
    string
  );

const makeRemoveCharacter = character => string =>
  string.replace(new RegExp("" + character + "", "g"), "");

const trimString = string => string.trim();

const getHashForUrl = url =>
  getArticle(url)
    .then(result => result.json())
    .then(result => result.content)
    .then(removeDataBetweenHTMLTags)
    .then(removeHTMLFromString)
    .then(removeSpecialCharactersFromString)
    .then(removeLeadingCapsString)
    .then(removeTrailingCapsString)
    .then(makeRemoveCharacter("\\)"))
    .then(makeRemoveCharacter("\\("))
    .then(makeRemoveCharacter(" "))
    .then(trimString)
    .then(makeLogIntermediateStep("Cleaned text"))
    .then(getHashForData)
    .then(hash => {
      console.log("The article hash: ", hash);
      return hash;
    })
    .catch(error => {
      console.log("Oops! an error occured", error);
    });

const main = () =>
  Promise.all([getHashForUrl(EXAMPLE_URL), getHashForUrl(OTHER_URL)]).then(
    hashes => {
      console.log("are the hashes equal ?", hashes[0] === hashes[1]);
    }
  );

main();

module.exports = {
  removeHTMLFromString,
  removeSpecialCharactersFromString,
  removeDataBetweenHTMLTags,
  removeLeadingCapsString,
  removeTrailingCapsString,
  makeRemoveCharacter
};
