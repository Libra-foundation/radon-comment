import * as core from "@actions/core";

const IS_TESTING: boolean = process.env.NODE_ENV === "test";

const CC_PATH: string = IS_TESTING
  ? core.getInput("cc")
  : "__test__/data/cc.json";

const HAS_CC: boolean = CC_PATH === "";

export default {
  IS_TESTING,
  CC_PATH,
  HAS_CC
};
