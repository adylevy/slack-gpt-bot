import { NextApiRequest, NextApiResponse } from "next";
import { delay } from "./helpers";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export const handleAppMention = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  /* {
    "type": "app_mention",
    "user": "U061F7AUR",
    "text": "<@U0LAN0Z89> is it everything a river should be?",
    "ts": "1515449522.000016",
    "channel": "C0LAN2Q65",
    "event_ts": "1515449522000016"
} */
  const token = process.env.SLACK_OAUTH_TOKEN;
  const { channel, text, ts, user } = req.body.event;

  const regex = /^<[^>]*>\s*/;
  const strippedText = text.replace(regex, "");
  const options: FetchOptions = {
    timeout: 60000, // 10 seconds
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      channelId: channel,
      ts,
      prompt: strippedText,
    }),
  };

  fetch(`${process.env.SELF_URL}/api/generate`, options).catch((err) => {
    console.log("axios Error:", err);
  });
  await delay(100); // needed so socket will remain open for furhter call
  res.status(200).end();
};

export function verifyRequestWithToken(req: NextApiRequest) {
  const { token } = req.body;
  return token === process.env.SLACK_VERIFICATION_TOKEN;
}

export async function handleUninstall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!verifyRequestWithToken(req))
    // verify that the request is coming from the correct Slack team
    // here we use the verification token because for some reason signing secret doesn't work
    return res.status(403).json({
      message: "Nice try buddy. Slack signature mismatch. (3)",
    });
  const { team_id } = req.body;

  return res.status(200).json({
    response: { message: `Uninstall for ${team_id} successful` },
  });
}
