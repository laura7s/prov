/* eslint-env mocha */
const expect = require("chai").expect;

const removeHTMLFromString = require("../index.js").removeHTMLFromString;
const removeSpecialCharactersFromString = require("../index.js")
  .removeSpecialCharactersFromString;
const removeDataBetweenHTMLTags = require("../index.js")
  .removeDataBetweenHTMLTags;
const removeLeadingCapsString = require("../index.js").removeLeadingCapsString;
const removeTrailingCapsString = require("../index.js")
  .removeTrailingCapsString;
const makeRemoveCharacter = require("../index.js").makeRemoveCharacter;

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

  describe("removeLeadingCapsString", () => {
    it("removes the leading string that has a small case letter followed by a capital letter", () => {
      expect(removeLeadingCapsString("WorldThis is a new sentence")).to.equal(
        "This is a new sentence"
      );
    });

    it("only works once", () => {
      expect(
        removeLeadingCapsString("WorldThis is a new sentenceHello")
      ).to.equal("This is a new sentenceHello");
    });

    it("does not crash if nothing is found", () => {
      expect(removeLeadingCapsString("Hello world")).to.equal("Hello world");
    });

    it("does not remove a huge part of the string", () => {
      expect(removeLeadingCapsString("HelloWorld")).to.equal("HelloWorld");
    });
  });

  describe("removeTrailingCapsString", () => {
    it("removes the end of a string with small-caps letters", () => {
      expect(removeTrailingCapsString("Hello world mah dudeThis")).to.equal(
        "Hello world mah dude"
      );
    });

    it("only does it once", () => {
      expect(
        removeTrailingCapsString("DudeHello world and other thingsThis")
      ).to.equal("DudeHello world and other things");
    });

    it("does not crash if nothing is found", () => {
      expect(removeTrailingCapsString("Hello world")).to.equal("Hello world");
    });

    it("does not remove a huge part of the string", () => {
      expect(removeTrailingCapsString("HelloWorld")).to.equal("HelloWorld");
    });
  });

  describe("makeRemoveCharacter", () => {
    it("removes a character", () => {
      expect(makeRemoveCharacter("a")("asdf")).to.equal("sdf");
      expect(makeRemoveCharacter(" ")("as df")).to.equal("asdf");
    });
  });
});
