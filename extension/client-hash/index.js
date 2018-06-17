import { getArticleStringForUrl, compareStrings } from "./utils.js";

const EXAMPLES = [
  {
    first:
      "https://www.reuters.com/article/us-usa-wildfires/flooding-possible-in-u-s-southwest-where-wildfires-scorch-earth-idUSKBN1JC062",
    second:
      "https://www.yahoo.com/news/flooding-possible-u-southwest-where-wildfires-scorch-earth-072723370.html"
  },
  {
    comment: "swissinfo returns horrible data",
    first:
      "https://www.vosizneias.com/299786/2018/06/15/new-york-u-s-prosecutors-pull-encrypted-messages-from-phones-seized-in-cohen-raids/",
    // first:
    //   "https://www.reuters.com/article/us-usa-trump-russia-cohen/u-s-prosecutors-pull-encrypted-messages-from-phones-seized-in-cohen-raids-idUSKBN1JB2V3",
    second:
      "https://www.swissinfo.ch/eng/u-s--prosecutors-pull-encrypted-messages-from-phones-seized-in-cohen-raids/44195162"
  },
  {
    comment: "Shitty 2nd link",
    first:
      "https://www.reuters.com/article/us-usa-trump-sarcasm/trump-quip-about-north-koreas-kim-sparks-outcry-on-social-media-idUSKBN1JB2PT",
    second:
      "https://theworldnews.net/us-news/trump-quip-about-north-korea-s-kim-sparks-outcry-on-social-media"
  },
  {
    first:
      "https://www.reuters.com/article/us-usa-trump-russia-cohen/u-s-prosecutors-pull-encrypted-messages-from-phones-seized-in-cohen-raids-idUSKBN1JB2V3",
    second:
      "http://wxerfm.com/news/articles/2018/jun/15/us-prosecutors-pull-encrypted-messages-from-phones-seized-in-cohen-raids/"
  }
];

const compare2Urls = () =>
  getArticleStringForUrl(EXAMPLES[2].first)
    .then(string1 => {
      return getArticleStringForUrl(EXAMPLES[2].second).then(string2 =>
        compareStrings(string1, string2)
      );
    })
    .catch(error => {
      console.error(error);
    });

export { compare2Urls, compareStrings };
