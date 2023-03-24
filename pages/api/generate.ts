import { openAIStream, OpenAIStreamPayload } from "@/lib/openai-stream";
import { postToChannel } from "@/lib/slackVerify";
import { NextFetchEvent } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (
  req: Request,
  context: NextFetchEvent
): Promise<Response> => {
  const { prompt, channelId, ts } = (await req.json()) as {
    prompt?: string;
    channelId: string;
    ts?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  };

  const asyncWork = async ({
    payload,
    channelId,
    ts,
  }: {
    payload: OpenAIStreamPayload;
    channelId: string;
    ts?: string;
  }) => {
    const stream = await openAIStream(payload);
    await postToChannel(channelId, stream, ts);
    return stream;
  };
  let response = "";
  context.waitUntil((response = await asyncWork({ payload, channelId, ts })));
  return new Response(response);
};

export default handler;
