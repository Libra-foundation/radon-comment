import * as core from "@actions/core";
import params from "./params";
import {CCReader, HalReader, MIReader} from "./readers";
import {type MIReport, type CCReport, type HalReport} from "./types";
import {CCReportTree, HalReportTree, MIReportTree} from "./reporters";
import * as github from "@actions/github";
import {type GetResponseDataTypeFromEndpointMethod} from "@octokit/types";

const {
  HAS_CC,
  CC_PATH,
  HAS_HAL,
  HAL_PATH,
  HAS_MI,
  MI_PATH,
  PR_NUMBER,
  GITHUB_TOKEN,
  COMMENT_TAG
} = params;

async function Run(): Promise<void> {
  let message: string = "";

  if (PR_NUMBER === -1) {
    core.setFailed("No pull request in input neither in current context.");
  }

  // eslint-disable-next-line @typescript-eslint/typedef -- This one is a hell.
  const OCTOKIT = github.getOctokit(GITHUB_TOKEN);

  try {
    if (HAS_CC) {
      const CC: CCReport = await CCReader(CC_PATH);
      message += CCReportTree.from(CC).toTable().toMD();
      message += "\n";
    }

    if (HAS_MI) {
      const MI: MIReport = await MIReader(MI_PATH);
      message += MIReportTree.from(MI).toTable().toMD();
      message += "\n";
    }

    if (HAS_HAL) {
      const HAL: HalReport = await HalReader(HAL_PATH);
      message += HalReportTree.from(HAL).toTable().toMD();
      message += "\n";
    }

    message += `\n ${COMMENT_TAG}`;
  } catch (error) {
    if (error instanceof Error)
      core.setFailed("Error while reading reports:" + error.message);
  }

  try {
    type ListCommentsResponseDataType = GetResponseDataTypeFromEndpointMethod<
      typeof OCTOKIT.rest.issues.listComments
    >;

    let comment: ListCommentsResponseDataType[0] | undefined;

    for await (const {data: COMMENTS} of OCTOKIT.paginate.iterator(
      OCTOKIT.rest.issues.listComments,
      {
        ...github.context.repo,
        issue_number: PR_NUMBER
      }
    )) {
      comment = COMMENTS.find(comment => comment.body?.includes(COMMENT_TAG));
      if (comment !== undefined) break;
    }
    if (comment === undefined) {
      void (await OCTOKIT.rest.issues.createComment({
        ...github.context.repo,
        issue_number: PR_NUMBER,
        body: message
      }));
    } else {
      void (await OCTOKIT.rest.issues.updateComment({
        ...github.context.repo,
        comment_id: comment.id,
        body: message
      }));
    }
  } catch (error) {
    if (error instanceof Error)
      core.setFailed(
        `${error.message} :\n ${error.stack ?? "No stacktrace available."}`
      );
  }
}

void Run();
