/* eslint-env mocha */
const expect = require("chai").expect;

const {
  removeHTMLFromString,
  removeSpecialCharactersFromString,
  removeDataBetweenHTMLTags,
  removeLeadingCapsString,
  removeTrailingCapsString,
  makeRemoveCharacter,
  compareBowRepresentations
} = require("../utils.js");

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
      expect(
        removeLeadingCapsString(
          "World clubThis is a new sentence with no issues and stuff"
        )
      ).to.equal("This is a new sentence with no issues and stuff");
    });

    it("only works once", () => {
      expect(
        removeLeadingCapsString("WorldThis is a new sentenceHello dude")
      ).to.equal("This is a new sentenceHello dude");
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
      expect(
        removeTrailingCapsString("Hello world mah dude and companyThis is")
      ).to.equal("Hello world mah dude and company");
    });

    it("only does it once", () => {
      expect(
        removeTrailingCapsString("DudeHello world and other thingsThis is")
      ).to.equal("DudeHello world and other things");
    });

    it("does not crash if nothing is found", () => {
      expect(removeTrailingCapsString("Hello world")).to.equal("Hello world");
    });

    it("does not remove a huge part of the string", () => {
      expect(removeTrailingCapsString("HelloWorld")).to.equal("HelloWorld");
    });

    it("does not remove trailing things that are a single word, to avoid removing McCain", () => {
      expect(
        removeTrailingCapsString("This article was written by McCain")
      ).to.equal("This article was written by McCain");
    });

    it("works for this edge case", () => {
      expect(
        removeTrailingCapsString(
          "Some dummy text in front of this Cohen has admitted making the payment, but Trump has denied the encounter with Daniels. Reportingby Brendan Pierson in New York; editing by David Gregorio and Grant McCoolOur Standards:The Thomson Reuters Trust Principles."
        )
      ).to.equal(
        "Some dummy text in front of this Cohen has admitted making the payment, but Trump has denied the encounter with Daniels. Reportingby Brendan Pierson in New York; editing by David Gregorio and Grant McCool"
      );
    });

    it("works for this other edge case", () => {
      expect(
        removeTrailingCapsString("editing by David Gregorio and Grant McCool)")
      ).to.equal("editing by David Gregorio and Grant McCool)");
    });
  });

  describe("makeRemoveCharacter", () => {
    it("removes a character", () => {
      expect(makeRemoveCharacter("a")("asdf")).to.equal("sdf");
      expect(makeRemoveCharacter(" ")("as df")).to.equal("asdf");
    });

    it("removes a character multiple times", () => {
      expect(makeRemoveCharacter(" ")("as d f")).to.equal("asdf");
    });

    it("removes special characters", () => {
      expect(makeRemoveCharacter("\\(")("as(df")).to.equal("asdf");
      expect(makeRemoveCharacter("\\(")("as(d(f")).to.equal("asdf");
    });

    it("removes returns", () => {
      expect(
        makeRemoveCharacter("\\n")(`as
df`)
      ).to.equal("asdf");
    });
  });

  describe("compareBowRepresentations", () => {
    expect(compareBowRepresentations([{ hello: 1 }], [{ hello: 1 }])).to.equal(
      1
    );
  });
});
