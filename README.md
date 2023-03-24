<div align="center">
     <picture>
        <source  srcset="https://tubular-dieffenbachia-b8222f.netlify.app/assets/app-logo.jpg">
        <img alt="Slack GPT Bot" src="https://tubular-dieffenbachia-b8222f.netlify.app/assets/app-logo.jpg">
    </picture>
    <h3 align="center">Slack GPT Bot</h3>
    <p>Your personal ChatGPT Bot on slack, for you and your entire slack team!</p>
    <picture>
        <source  srcset="https://tubular-dieffenbachia-b8222f.netlify.app/assets/gh-readme.png">
        <img alt="Demo" src="https://tubular-dieffenbachia-b8222f.netlify.app/assets/gh-readme.png">
    </picture>
</div>

<p align="center">
  <a href="#deploy-your-own"><strong><i>deploy your own</i></strong></a>
</p>
<br/>

## Built With

1. [Next.js](https://nextjs.org/) arcitecture
2. [Slack API](https://api.slack.com/docs) for [sending] messages
3. [Open.ai](https://chat.openai.com) gpt-3.5 chat API

<br/>

## How It Works

1. Bot listens to app_mention slack event
2. Then it takes the text and post it to chatgpt API
3. Create a reply message on slack with chatGPT response

## Deploy Your Own

You can also deploy your own version of this bot using your fav cloud infra.

### Step 1: Create Slack App + Secure Env Vars

1. Navigate to [api.slack.com/apps](https://api.slack.com/apps) and click on "Create New App".
2. Select "From scratch" and input `Slack GPT Bot` as the name of your app.
3. You've just created your Slack app. Here, you'll receive 3 values that will be used for your deployment in the next step:
   - **Client ID**: This is your App's unique public-facing ID that will be the value for the `NEXT_PUBLIC_SLACK_CLIENT_ID` env var.
   - **Signing Secret**: This is the signing secret used to validate that requests are genuinely coming from Slack. It will be the value for the `SLACK_SIGNING_SECRET` env var.
   - **Verification Token**: This is the verification token used to validate that requests are genuinely coming from Slack. It will be the value for the `SLACK_VERIFICATION_TOKEN` env var.
     <picture>
     <source  srcset="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-create-app.png">
     <img alt="App creation on slack" src="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-create-app.png">
     </picture>

### Step 2: Create an Open.AI Account and get your API-Key

1. Navigate to [platform.openai.com](https://platform.openai.com/) and signup for free.
2. Now navigate to your [api-keys page](https://platform.openai.com/account/api-keys)
3. Click on `Create new secret key` (and save that key somewhere cause it won't be visible later)
4. Create an env var `OPENAI_API_KEY` with the value above

### Step 3: Deploy to your favourite hosting provider

Well, I really wanted this project to work in Vercel or any other one-click install provider but unfourtunatly I coulnd't :(
Reason is - Slack API expect the response to return within 3 seconds, if it doesn't get an answer it starts an exponential backoff requests.
Vercel and other frameworks doesn't allow long timeouts for their edge functions so I had to revert to my AWS ECS which is easy enough for me.

Be sure to include all 6 of the env vars above in your deployment. (this is super important, otherwise it won't work!)

When the project finishes deploying, get your project's domain (e.g. `https://slackbot.yourdomain.com`). You'll need it for the next step.

Make sure you add the url of your domain to the env file you created earlier something like `SELF_URL=https://slackbot.com`

### Step 4: Configuring Slack app

For your Slack app to be able to send messages and subscribe to slack mention event in your Slack workspace, we will need to configure a few things:

#### Step 4A: Configuring OAuth Scopes

1. From your Slack app home screen, select "OAuth & Permissions" from the sidebar (under "Features").
2. Scroll down to "Scopes", and add the following scopes under "Bot Token Scopes":

   - `chat:write`
   - `chat:write.public`
   - `app_mentions:read`
   - `commands`

   [Slack Scopes]
   <picture>
   <source  srcset="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-scopes.png">
   <img alt="Slack Scopes" src="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-scopes.png">
   </picture>

#### Step 4B: Configuring Event Subscriptions

1. Now, select "Event Subscriptions" from the sidebar (under "Features").
2. Toggle "Enable Events" to "ON".
3. For the "Request URL" field, input your project's domain and append `/api/event` to it. The final URL should look something like `https:/yourdomain/api/event`.
4. Scroll down to "Subscribe to bot events". Add the `app_mention` bot user event.

   [Slack configuration]
   <picture>
   <source srcset="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-subscribe.png">
   <img alt="Slack subscribe" src="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-subscribe.png">
   </picture>

5. Click on "Save Changes".

#### Step 4C: Install App to Slack Workspace + Get OAuth token

1. Go to "Basic Information" (under "Settings").
2. Under "Install your app", click on "Install to Workspace".
3. You should receive a notification that your app has been installed in your Slack workspace.
4. Go back to "OAuth & Permissions". Copy the value of "Bot User OAuth Token".

<picture>
    <source  srcset="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-bot-token.png">
    <img alt="Slack oauth settings" src="https://tubular-dieffenbachia-b8222f.netlify.app/assets/slack-bot-token.png">
</picture>

5. Set it as the `SLACK_OAUTH_TOKEN` env var in your project.
6. Redeploy your project for the changes to take effect.
7. To verify that this worked, go to any channel on your Slack workspace and type something like `@aibot hello`. You should get a reply from the bot!

<br/>

## Share the love

Kudos for getting so down the readme lol, please Star the repo and share the love!

## License

The MIT License.

<br/>

## Thanks

This project and it's code was inspired by vercel's [slacker](https://github.com/vercel-labs/slacker)
