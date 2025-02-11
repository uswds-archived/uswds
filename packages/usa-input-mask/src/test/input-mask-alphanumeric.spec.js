const fs = require("fs");
const path = require("path");
const assert = require("assert");
const InputMask = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask-alphanumeric.template.html"),
);

const EVENTS = {};

/**
 * send an keydown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydown = (el) => {
  el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
};

/**
 * send an keyup event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keyup = (el) => {
  el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
};

const inputMaskSelector = () => document.querySelector(".usa-masked");

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "input mask", selector: inputMaskSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`input mask component initialized at ${name}`, () => {
    const { body } = document;

    let input;
    let error;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      InputMask.on(containerSelector());

      root = inputMaskSelector().parentNode;
      input = inputMaskSelector();
      content = root.querySelector(".usa-input-mask--content");
      error = root.querySelector(".usa-error-message");
    });

    afterEach(() => {
      InputMask.off(containerSelector());
      body.textContent = "";
    });

    it("initializes all elements", () => {
      assert.ok(root);
      assert.ok(input);
      assert.ok(error);
    });

    it("creates a visual status message on init", () => {
      assert.ok(error);
    });

    it("informs the user only a letter character is allowed", () => {
      input.value = "1";

      EVENTS.keydown(input);
      EVENTS.keyup(input);

      assert.strictEqual(error.hidden, false);

      assert.strictEqual(error.innerHTML, "You must enter a letter");
    });

    it("informs the user only a number character is allowed", () => {
      input.value = "AA";

      EVENTS.keydown(input);
      EVENTS.keyup(input);

      assert.strictEqual(error.hidden, false);

      assert.strictEqual(error.innerHTML, "You must enter a number");
    });

    it("hides error message when input is correct", () => {
      input.value = "A1";

      EVENTS.keydown(input);

      assert.ok(error.hidden);
    });

    // it("formats an alphanumeric example to A1B 2C3", () => {
    //   input.value = "A1B2C3";

    //   EVENTS.keyup(input);
    //   console.log("content!!!: ", content, content.textContent);

    //   assert.strictEqual(content.textContent, "A1B 2C3");
    // });
  });
});
