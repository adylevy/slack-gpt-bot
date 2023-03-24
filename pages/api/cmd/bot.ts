import { verifyRequest } from "@/lib/slackVerify";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Response> {
  const verification = verifyRequest(req);
  if (!verification.status)
    // verify that the request is coming from the correct Slack team
    return new Response(verification.message, {
      status: 200,
    });

  const { team_id, command, channel_id, text } = req.body;
  console.log(channel_id, text);
  if (command === "/bot") {
    return new Response("Bot is alive and well :)", {
      status: 200,
    });
  } else {
    return new Response("cmd is not set.", {
      status: 200,
    });
  }
}
