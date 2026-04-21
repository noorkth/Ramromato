/**
 * contact.js — Contact Form Submission Handler
 * Wires the Ramromato contact form to POST /api/contact
 * and manages loading, success, and error UI states.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn   = document.getElementById('contactSubmitBtn');
    const statusBanner = document.getElementById('contactStatus');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // ── Gather values ───────────────────────────────────────────────
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // ── Client-side validation ──────────────────────────────────────
      if (!name || !email || !subject || !message) {
        showStatus('error', 'Please fill in all fields before submitting.');
        return;
      }

      // ── Loading state ───────────────────────────────────────────────
      setLoading(true);
      hideStatus();

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showStatus('success', '✓ Your message was sent successfully! We\'ll get back to you soon.');
          form.reset();
        } else {
          showStatus('error', data.error || '✗ Something went wrong. Please try again.');
        }
      } catch (err) {
        showStatus('error', '✗ Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    });

    // ── Helpers ─────────────────────────────────────────────────────────

    function setLoading(isLoading) {
      if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending…';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
      }
    }

    function showStatus(type, msg) {
      statusBanner.className =
        type === 'success'
          ? 'contact-status contact-status--success'
          : 'contact-status contact-status--error';
      statusBanner.textContent = msg;
      statusBanner.style.display = 'block';
      // Scroll the banner into view smoothly
      statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideStatus() {
      statusBanner.style.display = 'none';
    }
  });
})();
