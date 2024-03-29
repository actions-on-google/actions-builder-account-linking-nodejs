# Actions on Google: Account Linking with Google Sign-In Sample
This sample demonstrates Actions on Google features for use on Google Assistant 
including account linking and [Google Sign In](https://developers.google.com/assistant/identity/google-sign-in)
 -- using the [Node.js client library](), [Firebase Authentication](https://firebase.google.com/docs/auth/),
 and deployed on [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/).

 *:warning: Warning: Conversational Actions will be deprecated on June 13, 2023. For more information, see [Conversational Actions Sunset](https://goo.gle/ca-sunset).*

### Prerequisites
1. Node.js and NPM
    + We recommend installing using [nvm for Linux/Mac](https://github.com/creationix/nvm)
    and [nvm-windows for Windows](https://github.com/coreybutler/nvm-windows)
1. Install the [Firebase CLI](https://developers.google.com/assistant/actions/dialogflow/deploy-fulfillment)
    + We recommend using MAJOR version `8` , `npm install -g firebase-tools@^8.0.0`
    + Run `firebase login` with your Google account

### Setup
#### Actions Console
1. From the [Actions on Google Console](https://console.actions.google.com/), **New project** > **Create project** > under **What kind of Action do you want to build?** > **Custom** > **Blank project**

### Account Linking Configuration
1. Return to the [Actions on Google Console](https://console.actions.google.com/).
1. From the top navigation menu under **Develop** > **Account linking** (left nav),
   under **Google Sign In Client Information**, copy the value of **Client ID issued by Google to your Actions**.
1. Return to your local copy of the sample.
1. Open the `.env` file in the `sdk/webhooks/ActionsOnGoogleFulfillment/` directory, and replace ${CLIENT_ID} with the value you got from the Console in the previous step.

#### Firebase Google Sign-In Integration
1. From the [Firebase console](https://console.firebase.google.com), find and select your Actions on Google Project ID
1. In the left navigation menu under **Develop** section > **Authentication** > **Sign-in method** > Select **Google** > Toggle **Enable** > Click **Save**

#### Firestore Database
1. From the [Firebase console](https://console.firebase.google.com), find and select your Actions on Google Project ID
1. In the left navigation menu under **Develop** section > **Database** > **Create database** button > Select **Start in test mode** > **Done**

#### Actions CLI
1. Install the [Actions CLI](https://developers.google.com/assistant/actionssdk/gactions).
1. Navigate to `sdk/settings/settings.yaml`, and replace `<PROJECT_ID>` with your project ID.
1. Run `gactions login` to login to your account.
1. Run `gactions push` to push your project.
1. Run `gactions deploy preview` to deploy your project.

### Running this Sample
+ You can test your Action on any Google Assistant-enabled device on which the Assistant is signed into the same account used to create this project. Just say or type, "OK Google, talk to my test app".
+ You can also use the Actions on Google Console simulator to test most features and preview on-device behavior.

## References & Issues
+ Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google) or the [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/).
+ For bugs, please report an issue on Github.
+ Actions on Google [Documentation](https://developers.google.com/assistant)
+ Actions on Google [Codelabs](https://codelabs.developers.google.com/?cat=Assistant)

## Contributing
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License
See [LICENSE](LICENSE).