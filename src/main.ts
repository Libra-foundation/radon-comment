import * as core from "@actions/core";
import params from "./params";
import {CCReader} from "./readers";
import {type CCReport} from "./types";

const {HAS_CC, CC_PATH} = params;

async function Run(): Promise<void> {
  try {
    if (HAS_CC) {
      const CC: CCReport = await CCReader(CC_PATH);
      void CC;
    }

    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void Run();
