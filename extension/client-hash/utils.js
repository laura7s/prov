// import "isomorphic-fetch";
import { sjcl } from "./sjcl.js";
import { bow, dict } from "./bow.js";

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

const getHashForData = data => {
  var bitArray = sjcl.hash.sha256.hash(data);
  var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);
  return digest_sha256;
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

const compareStrings = (original, newString) => {
  const voc = dict([original]);
  const bow1 = bow(original, voc);
  const bow2 = bow(newString, voc);
  const distance = distanceBetween2Vectors(bow1, bow2);
  console.log("Difference?: ", distance);
  return distance;
};

const squareDifference = (a, b) => Math.pow(a - b, 2);

const squareDifferenceArray = (arrayA, arrayB) =>
  arrayA.reduce(
    (acc, val, index) => acc + squareDifference(val, arrayB[index]),
    0
  );

const sumProduct = (arrayA, arrayB) =>
  arrayA.reduce((acc, val, index) => acc + val * arrayB[index], 0);

const vectorLength = vector =>
  Math.sqrt(vector.reduce((acc, val) => acc + Math.pow(val, 2), 0));

const distanceBetween2Vectors = (arrayA, arrayB) =>
  sumProduct(arrayA, arrayB) / (vectorLength(arrayA) * vectorLength(arrayB));

const getArticleStringForUrl = url =>
  getArticle(url)
    .then(result => result.json())
    .then(result => result.content)
    .then(removeDataBetweenHTMLTags)
    .then(removeHTMLFromString)
    .then(removeSpecialCharactersFromString);
// .then(console.log);
// .then(makeLogIntermediateStep("Cleaned html"))
// .then(trimString)
// .then(removeLeadingCapsString)
// .then(trimString)
// .then(removeTrailingCapsString)
// .then(makeRemoveCharacter("\\)"))
// .then(makeRemoveCharacter("\\("))
// .then(makeRemoveCharacter(" "))
// .then(makeRemoveCharacter("\\n"));
// .then(makeRemoveCharacter(";"))
// .then(removeEverythingButAlphanumeric)
// .then(makeLogIntermediateStep("Bow"))
// .then(getHashForData)

export {
  removeHTMLFromString,
  removeSpecialCharactersFromString,
  removeDataBetweenHTMLTags,
  removeLeadingCapsString,
  removeTrailingCapsString,
  makeRemoveCharacter,
  getArticleStringForUrl,
  compareStrings
};
