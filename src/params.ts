import * as core from "@actions/core";
import {context} from "@actions/github";

const IS_TESTING: boolean = process.env.NODE_ENV === "test";

const CC_PATH: string = IS_TESTING
  ? core.getInput("cc")
  : "__tests__/data/cc.json";

const HAS_CC: boolean = CC_PATH !== "";

const HAL_PATH: string = IS_TESTING
  ? core.getInput("hal")
  : "__tests__/data/hal.json";

const HAS_HAL: boolean = HAL_PATH !== "";

const MI_PATH: string = IS_TESTING
  ? core.getInput("mi")
  : "__tests__/data/mi.json";

const HAS_MI: boolean = MI_PATH !== "";

const PR_NUMBER: number =
  (parseInt(core.getInput("pr_number")) as number | undefined) ??
  context.payload.pull_request?.number ??
  -1;

const GITHUB_TOKEN: string = core.getInput("GITHUB_TOKEN");

const COMMENT_TAG: string = "<!-- Libra-foundation/radon-comment -->";

export default {
  IS_TESTING,
  CC_PATH,
  HAS_CC,
  HAL_PATH,
  HAS_HAL,
  MI_PATH,
  HAS_MI,
  PR_NUMBER,
  GITHUB_TOKEN,
  COMMENT_TAG
};
