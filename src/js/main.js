import {initGame} from './game/Game';
import {initAuth, authStateChanged, signOutAction} from './auth/auth'

window.onload = function() {
  const signIn = document.getElementById('authContainer');
  const signOut = document.getElementById('signOut');
  const amemory = document.getElementById("amemory");

  if (amemory) initGame(amemory);
  if (signIn) initAuth('#authContainer');
  if (signIn) authStateChanged();
  if (signOut) signOutAction(signOut);
};

document.addEventListener('DOMContentLoaded', () => {
  // navbar burger interaction
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
  // open modal auth
  const $authButtons = Array.prototype.slice.call(document.querySelectorAll('.modal-auth-open'), 0);
  if ($authButtons.length > 0) {
    $authButtons.forEach( el => {
      el.addEventListener('click', () => {
        const $modal = document.getElementById('modalAuth');
        $modal.classList.toggle('is-open');
      });
    });
  }
  // close all modals
  const $modalCloseButtons = Array.prototype.slice.call(document.querySelectorAll('.close'), 0);
  if ($modalCloseButtons.length > 0) {
    $modalCloseButtons.forEach( el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        $target.classList.remove('is-open');
      });
    });
  }
});

