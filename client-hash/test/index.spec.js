/* eslint-env mocha */
const expect = require("chai").expect;

const removeHTMLFromString = require("../index.js").removeHTMLFromString;
const removeSpecialCharactersFromString = require("../index.js")
  .removeSpecialCharactersFromString;
const removeDataBetweenHTMLTags = require("../index.js")
  .removeDataBetweenHTMLTags;

describe("data cleaners", () => {
  describe("removeHTMLFromString", () => {
    it("returns the same string without removing anything", () => {
      expect(removeHTMLFromString("hello")).to.equal("hello");
    });

    it("removes HTML tags from it", () => {
      expect(removeHTMLFromString("<p />hello")).to.equal("hello");
    });

    it("removes HTML tags from it", () => {
      expect(removeHTMLFromString("<p /><div></div>hello")).to.equal("hello");
    });

    it("removes HTML tags from it", () => {
      expect(removeHTMLFromString("<p /><div></div>hello<Hello/>")).to.equal(
        "hello"
      );
    });
  });

  describe("removeSpecialCharactersFromString", () => {
    it("keeps a single string intact", () => {
      expect(removeSpecialCharactersFromString("hello")).to.equal("hello");
    });

    it("removes stuff between a & and ; sign", () => {
      expect(removeSpecialCharactersFromString("hel&quot;lo")).to.equal(
        "hello"
      );
    });

    it("removes stuff between a & and ; sign multiple times", () => {
      expect(
        removeSpecialCharactersFromString("hel&quot;lo hel&quot;lo")
      ).to.equal("hello hello");
    });

    it("does not remove it if there is a space in between", () => {
      expect(removeSpecialCharactersFromString("he& asd;llo")).to.equal(
        "he& asd;llo"
      );
    });
  });

  describe("removeDataBetweenHTMLTags", () => {
    it("removes stuff between our identified tags", () => {
      expect(
        removeDataBetweenHTMLTags("hello <figcaption>yooooo</figcaption>world")
      ).to.equal("hello world");
    });

    it("removes stuff between our other identified tags", () => {
      expect(
        removeDataBetweenHTMLTags("hello <damn>yooooo</damn>world")
      ).to.equal("hello world");
    });
  });
});
