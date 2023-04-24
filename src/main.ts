import * as core from "@actions/core";
import {Wait} from "./wait";

async function Run(): Promise<void> {
  try {
    const MS: string = core.getInput("milliseconds");
    core.debug(`Waiting ${MS} milliseconds ...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString());
    await Wait(parseInt(MS, 10));
    core.debug(new Date().toTimeString());

    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void Run();
