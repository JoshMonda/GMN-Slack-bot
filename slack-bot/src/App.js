require('dotenv').config();
const { App, ExpressReceiver } = require('@slack/bolt');
const express = require('express');
const bodyParser = require('body-parser');

// Create an ExpressReceiver
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initialize the Bolt app with the receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
});

// Create an Express app to handle requests
const expressApp = express();
expressApp.use(bodyParser.json());

// Handle Slack's URL verification challenge
expressApp.post('/slack/events', (req, res) => {
  if (req.body.type === 'url_verification') {
    res.send({ challenge: req.body.challenge });
  } else {
    // Let Bolt handle the events
    expressReceiver.app(req, res);
  }
});

// Listen to the team_join event
app.event('team_join', async ({ event, client }) => {
  try {
    // Send message to #general channel
    await client.chat.postMessage({
      // channel: '#general',
       channel: '#video-test',
      text: `Welcome <@${event.user.id}>! Let’s help you get started and connect with other members well.`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:wave: Welcome <@${event.user.id}>! We are happy to have you. Your onboarding starts now.`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":wave: Let’s help you get started and connect with other members well. Your profile must include your personal headshot :busts_in_silhouette: so others can be clear when connecting and introducing others. Also, your description needs to include your marketing superpower :mechanical_arm: as it relates to what you specialize in (focus on one thing). No one likes to refer a \"know-it-all\" :grin:. See <@U023P5YL0HE> or <@U03670FRLKY>'s profile as an example."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":white_check_mark: Engage and participate in the LIVE Tuesday Broadcast which streams at 8am PT / 11am ET in FB private group, LinkedIn, Twitter, and YouTube via Streamyard.\nNote!! Streamyard team member “Green room” link will also be shared in the #general channel at least 30 min before we go LIVE!"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":white_check_mark: Click the arrow to watch Giver Marketing Blueprint and post action items in Slack #general channel so everyone can learn about you and give feedback."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":white_check_mark: Add your scheduler/booking link on this channel: #schedulers."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":white_check_mark: Start meetings with people in Slack 1:1 weekly."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":white_check_mark: Lastly, if you want to be highlighted as a guest speaker on our Tuesday streams, click the arrow!\nHave an awesome day :wave:"
          }
        }
      ]
    });
  } catch (error) {
    console.error(error);
  }
});

// Start the Express app
const port = process.env.PORT || 3000;
expressApp.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});

// Start the Slack Bolt app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Slack Bolt app is running!');
})();
