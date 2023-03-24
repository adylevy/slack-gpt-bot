import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query; // get code from request posted to redirect_uri from Slack
  try {
    const response = await fetch(
      `https://slack.com/api/oauth.v2.access?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}`
    );
    const json = await response.json();
    const { access_token, team } = json;
    if (access_token && team.id) {
      res.redirect(`/success/${team.id}`);
    } else {
      // no access token or team id in json response from slack oauth API
      res.status(500).json({
        message:
          "No access token or team id found in response from Slack's /oauth.v2.access API.",
      });
    }
  } catch (err) {
    // failed to fetch from slack oauth API
    res
      .status(500)
      .json({ statusCode: 500, message: "An unknown error occured." });
  }
}
