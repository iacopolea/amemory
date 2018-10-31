import {firebase} from '../_firebase';
import * as firebaseui from 'firebaseui'

const ui = new firebaseui.auth.AuthUI(firebase.auth());

const authStateChanged = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.getIdToken().then(function(accessToken) {
        document.getElementById('signIn').style.display = 'none';
        document.getElementById('signOut').style.display = 'block';
      });
    } else {
      // User is signed out.
      document.getElementById('signIn').style.display = 'block';
    }
  }, function(error) {
    console.log(error);
  });
};

const signOutAction = ($signOut) => {
  $signOut.addEventListener('click', function(e) {
    firebase.auth().signOut();
    $signOut.style.display = 'none';
  });
};

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true
    },
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/plus.login'
      ],
    },
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes: [
        'public_profile',
        'email',
      ],
      customParameters: {
        // Forces password re-entry.
        auth_type: 'reauthenticate'
      }
    },
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};
const initAuth = function(elementId) {
  ui.start(elementId, uiConfig);
};

export {initAuth, authStateChanged, signOutAction};