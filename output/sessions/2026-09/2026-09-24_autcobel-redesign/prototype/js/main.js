// Autcobel prototype — shared behaviour. No framework, no build step.

(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-nav-mobile]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Enquiry form: prototype has no backend. Show a confirmation state instead of submitting.
  var form = document.querySelector('[data-enquiry-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('[data-form-status]');
      if (status) {
        status.textContent = 'Prototype only — this form does not send yet. In the live site this would submit and you’d see a confirmation here.';
        status.hidden = false;
      }
    });
  }

  // Cookie banner (prototype placeholder, not wired to real consent/analytics)
  var COOKIE_KEY = 'autcobel_proto_cookie_choice';
  var banner = document.querySelector('[data-cookie-banner]');
  if (banner) {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        banner.hidden = false;
      }
    } catch (err) {
      banner.hidden = false;
    }
    banner.querySelectorAll('[data-cookie-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try {
          localStorage.setItem(COOKIE_KEY, btn.getAttribute('data-cookie-choice'));
        } catch (err) {}
        banner.hidden = true;
      });
    });
  }
})();
