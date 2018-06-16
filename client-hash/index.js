require("isomorphic-fetch");
const crypto = require("crypto");

const MERCURY_END_POINT = "https://mercury.postlight.com";
const SECRET = "abcdefg";
const UNALLOWED_HTML_TAGS = ["figcaption", "damn"];

const EXAMPLES = [
  {
    first:
      "https://www.yahoo.com/news/flooding-possible-u-southwest-where-wildfires-scorch-earth-072723370.html",
    second:
      "https://www.reuters.com/article/us-usa-wildfires/flooding-possible-in-u-s-southwest-where-wildfires-scorch-earth-idUSKBN1JC062"
  },
  {
    first:
      "https://www.reuters.com/article/us-usa-trump-russia-cohen/u-s-prosecutors-pull-encrypted-messages-from-phones-seized-in-cohen-raids-idUSKBN1JB2V3",
    second:
      "https://www.swissinfo.ch/eng/u-s--prosecutors-pull-encrypted-messages-from-phones-seized-in-cohen-raids/44195162"
  }
];

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

const removeReasonableAmountOfString = (newString, oldString) => {
  const removedPartIndex = oldString.indexOf(newString);
  let removedPart;

  if (removedPartIndex === 0) {
    removedPart = oldString.slice(newString.length);
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

const trimString = string => string.trim();

const getHashForUrl = url =>
  getArticle(url)
    .then(result => result.json())
    .then(result => result.content)
    .then(removeDataBetweenHTMLTags)
    .then(removeHTMLFromString)
    .then(removeSpecialCharactersFromString)
    // .then(makeLogIntermediateStep("Cleaned html"))
    .then(removeLeadingCapsString)
    .then(removeTrailingCapsString)
    .then(makeRemoveCharacter("\\)"))
    .then(makeRemoveCharacter("\\("))
    .then(makeRemoveCharacter(" "))
    .then(makeRemoveCharacter("\\n"))
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

const main = ({ first, second }) =>
  Promise.all([getHashForUrl(first), getHashForUrl(second)]).then(hashes => {
    console.log("are the hashes equal ?", hashes[0] === hashes[1]);
  });

main(EXAMPLES[1]);

module.exports = {
  removeHTMLFromString,
  removeSpecialCharactersFromString,
  removeDataBetweenHTMLTags,
  removeLeadingCapsString,
  removeTrailingCapsString,
  makeRemoveCharacter
};
