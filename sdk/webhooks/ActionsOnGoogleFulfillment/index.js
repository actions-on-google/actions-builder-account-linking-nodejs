/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {
  conversation,
} = require('@assistant/conversation');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const dotenv = require('dotenv');

dotenv.config();
admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();
db.settings({timestampsInSnapshots: true});
const dbs = {
  user: db.collection('user'),
};

// The Client Id of the Actions Project (set it in the env file).
const CLIENT_ID = process.env.CLIENT_ID;

const app = conversation({debug: true, clientId: CLIENT_ID});

// Identifies a request for the usual order.
const USUAL = 'usual';

// Available options.
const options = ['matcha', 'boba'];

// The name of the Firestore collection that keeps track of order history.
const orderHistory = 'orderHistory';

// This handler is called after the user has successfully linked their account.
// Saves the user name in a session param to use it in dialogs, and inits the
// Firestore db to store orders for the user.
app.handle('create_user', async (conv) => {
  const payload = conv.user.params.tokenPayload;
  // write user name in session to use in dialogs
  conv.user.params.name = payload.given_name;
  const email = payload.email;
  if (email) {
    try {
      conv.user.params.uid = (await auth.getUserByEmail(email)).uid;
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        throw e;
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      conv.user.params.uid = (await auth.createUser({email})).uid;
    }
    const userDoc = dbs.user.doc(conv.user.params.uid);
    const orderHistoryColl = userDoc.collection(orderHistory);
    for (let i = 0; i < options.length; i++) {
      await orderHistoryColl.doc(options[i]).set(
          {option: options[i], count: 0});
    }
  }
});

// This handler is called to place an order and recompute the usual order if
// needed.
app.handle('place_order', async (conv) => {
  let order = conv.session.params.order;
  let usual = conv.user.params.usual;

  if (order === USUAL) {
    order = usual;
  }

  const userDoc = dbs.user.doc(conv.user.params.uid);
  const orderHistoryColl = userDoc.collection(orderHistory);

  await orderHistoryColl.doc(order).update(
      {count: admin.firestore.FieldValue.increment(1)});
  if (order !== usual) {
    // Recompute usual in case this order changed the favorite
    let usualDoc = await orderHistoryColl.orderBy('count').limit(1).get();
    conv.user.params.usual = usualDoc.data().option;
  }

  // Clear order session param for future sessions
  conv.session.params.order = '';

  return conv.add(`Your ${order} has been placed. ` +
    'Thanks for using Boba Bonanza, see you soon!');
});

// Used to reset the slot for account linking status to allow the user to try
// again if a system or network error occurred.
app.handle('system_error', async (conv) => {
  conv.session.params.AccountLinkingSlot = '';
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
