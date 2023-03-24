import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import SlackButton from "@/components/slack-button";
import Layout from "@/components/layout";
import { useEffect } from "react";

export default function SuccessTeam(props: { teamId: string }) {

  useEffect(() => {
    console.log("Install Success", { teamId: props.teamId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout meta={{ title: "Installation Successful" }}>
      <div className="text-center max-w-sm sm:max-w-lg space-y-4">
        <h1 className="my-8 bg-gradient-to-br from-white via-white to-[#532a01] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          Installation Successful
        </h1>
        <p className="sm:text-lg text-gray-300">
          You can now create a channel to receive notifications in and start
          configuring the bot with the{" "}
          <span className="font-mono text-red-500">/configure</span> command.
        </p>
      </div>
      <div className="flex flex-col text-center space-y-2">
        <SlackButton
          text="Open Slack"
          url={
            props.teamId
              ? `slack://slack.com/app_redirect?app=${props.teamId}`
              : "https://slack.com"
          }
        />
      </div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

interface Params extends ParsedUrlQuery {
  teamId: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { teamId } = context.params as Params;
  return {
    props: { teamId: teamId ? teamId[0] : null },
  };
};
