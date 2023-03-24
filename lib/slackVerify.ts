import { NextApiRequest } from "next";
import crypto from "crypto";

export function verifyRequest(req: NextApiRequest) {
  /* Verify that requests are genuinely coming from Slack and not a forgery */
  const {
    "x-slack-signature": slack_signature,
    "x-slack-request-timestamp": timestamp,
  } = req.headers as { [key: string]: string };

  if (!slack_signature || !timestamp) {
    return {
      status: false,
      message: "No slack signature or timestamp found in request headers.",
    };
  }
  if (process.env.SLACK_SIGNING_SECRET === undefined) {
    return {
      status: false,
      message: "`SLACK_SIGNING_SECRET` env var is not defined.",
    };
  }
  if (
    Math.abs(Math.floor(new Date().getTime() / 1000) - parseInt(timestamp)) >
    60 * 5
  ) {
    return {
      status: false,
      message: "Nice try buddy. Slack signature mismatch. (1)",
    };
  }
  const req_body = new URLSearchParams(req.body).toString(); // convert body to URL search params
  const sig_basestring = "v0:" + timestamp + ":" + req_body; // create base string
  const my_signature = // create signature
    "v0=" +
    crypto
      .createHmac("sha256", process.env.SLACK_SIGNING_SECRET as string)
      .update(sig_basestring)
      .digest("hex");

  if (
    crypto.timingSafeEqual(
      Buffer.from(slack_signature),
      Buffer.from(my_signature)
    )
  ) {
    return {
      status: true,
      message: "Verified Request.",
    };
  } else {
    return {
      status: false,
      message: "Nice try buddy. Slack signature mismatch. (2)",
    };
  }
}

export async function postToChannel(
  channelId: string,
  payload: string,
  thread_ts?: string
) {
  const token = process.env.SLACK_OAUTH_TOKEN;
  const message = {
    channel: channelId,
    text: payload,
    thread_ts: thread_ts,
  };

  const stream = await fetch("https://slack.com/api/chat.postMessage", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(message),
  });
  return stream;
}
