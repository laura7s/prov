require("isomorphic-fetch");
const crypto = require("crypto");

const MERCURY_END_POINT = "https://mercury.postlight.com";
const UNALLOWED_HTML_TAGS = ["figcaption", "damn"];

const createMercuryURL = url => MERCURY_END_POINT + "/parser?url=" + url;

const getMercuryData = mercuryUrl =>
  fetch(mercuryUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "ANnmru0nlL3CdwJS1LFdHcqM9YKru3HGycEIqmlO"
    }
  });

const getHashForData = data =>
  crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");

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

const removeReasonableAmountOfString = (newString, oldString) => {
  const removedPartIndex = oldString.indexOf(newString);
  let removedPart;

  if (removedPartIndex === 0) {
    removedPart = oldString.slice(newString.length - 1);
  } else {
    removedPart = oldString.slice(removedPartIndex);
  }

  // Make sure we only remove parts that have space in them
  if (removedPart.indexOf(" ") < 0) {
    return oldString;
  }

  const shouldReturnNewString = newString.length / oldString.length > 0.7;

  return shouldReturnNewString ? newString : oldString;
};

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

const removeEverythingButAlphanumeric = string => string.replace(/\W/g, "");

const trimString = string => string.trim();

const getHashForUrl = url =>
  getArticle(url)
    .then(result => result.json())
    .then(result => result.content)
    .then(removeDataBetweenHTMLTags)
    .then(removeHTMLFromString)
    .then(removeSpecialCharactersFromString)
    // .then(makeLogIntermediateStep("Cleaned html"))
    .then(trimString)
    .then(removeLeadingCapsString)
    .then(trimString)
    .then(removeTrailingCapsString)
    // .then(makeRemoveCharacter("\\)"))
    // .then(makeRemoveCharacter("\\("))
    // .then(makeRemoveCharacter(" "))
    .then(makeRemoveCharacter("\\n"))
    // .then(makeRemoveCharacter(";"))
    .then(removeEverythingButAlphanumeric)
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

module.exports = {
  removeHTMLFromString,
  removeSpecialCharactersFromString,
  removeDataBetweenHTMLTags,
  removeLeadingCapsString,
  removeTrailingCapsString,
  makeRemoveCharacter,
  getHashForUrl
};
