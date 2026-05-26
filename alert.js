/**
 * ThaiAlert — Custom Alert & Confirm Dialog
 * ทางรัฐ Design System
 *
 * Usage:
 *   ThaiAlert.alert({ title, message, type, buttonText })
 *   ThaiAlert.confirm({ title, message, type, confirmText, cancelText })
 *
 * Both methods return a Promise:
 *   - alert   → resolves when the user dismisses
 *   - confirm → resolves true (confirmed) or false (cancelled)
 *
 * Types: 'info' | 'success' | 'warning' | 'danger'
 */

const ThaiAlert = (() => {

  // ─── Icon map per type ───────────────────────────────────────
  const ICONS = {
    info:    'info',
    success: 'check_circle',
    warning: 'warning',
    danger:  'error',
  };

  // ─── Confirm button class per type ──────────────────────────
  const CONFIRM_BTN_CLASS = {
    info:    'btn btn-primary',
    success: 'btn btn-primary',
    warning: 'btn btn-warning',
    danger:  'btn btn-destructive',
  };

  // ─── Build DOM ───────────────────────────────────────────────
  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'alert-overlay';
    // Click backdrop to close (alert only — handled per dialog)
    return overlay;
  }

  function buildDialog(opts) {
    const type    = opts.type || 'info';
    const iconKey = ICONS[type] || ICONS.info;

    const dialog = document.createElement('div');
    dialog.className = 'alert-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    dialog.innerHTML = `
      <div class="alert-icon alert-icon--${type}">
        <span class="material-symbols-outlined">${iconKey}</span>
      </div>
      <h3 class="alert-title">${opts.title || ''}</h3>
      ${opts.message ? `<p class="alert-message">${opts.message}</p>` : ''}
      <div class="alert-actions" id="_alert-actions"></div>
    `;

    return dialog;
  }

  // ─── Teardown ────────────────────────────────────────────────
  function destroy(overlay) {
    overlay.classList.add('alert-overlay--out');
    overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
  }

  // ─── Public: alert ───────────────────────────────────────────
  /**
   * @param {object} opts
   * @param {string} [opts.title]
   * @param {string} [opts.message]
   * @param {'info'|'success'|'warning'|'danger'} [opts.type='info']
   * @param {string} [opts.buttonText='ตกลง']
   * @returns {Promise<void>}
   */
  function alert(opts = {}) {
    return new Promise((resolve) => {
      const overlay = buildOverlay();
      const dialog  = buildDialog(opts);
      const actions = dialog.querySelector('#_alert-actions');

      const btnText = opts.buttonText || 'ตกลง';
      const btnClass = CONFIRM_BTN_CLASS[opts.type] || CONFIRM_BTN_CLASS.info;

      const confirmBtn = document.createElement('button');
      confirmBtn.className = btnClass;
      confirmBtn.textContent = btnText;

      confirmBtn.addEventListener('click', () => {
        destroy(overlay);
        resolve();
      });

      // Close on backdrop click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          destroy(overlay);
          resolve();
        }
      });

      // Close on Escape
      const onKey = (e) => {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', onKey);
          destroy(overlay);
          resolve();
        }
      };
      document.addEventListener('keydown', onKey);

      actions.appendChild(confirmBtn);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      confirmBtn.focus();
    });
  }

  // ─── Public: confirm ─────────────────────────────────────────
  /**
   * @param {object} opts
   * @param {string} [opts.title]
   * @param {string} [opts.message]
   * @param {'info'|'success'|'warning'|'danger'} [opts.type='info']
   * @param {string} [opts.confirmText='ยืนยัน']
   * @param {string} [opts.cancelText='ยกเลิก']
   * @returns {Promise<boolean>} resolves true = confirmed, false = cancelled
   */
  function confirm(opts = {}) {
    return new Promise((resolve) => {
      const overlay = buildOverlay();
      const dialog  = buildDialog(opts);
      const actions = dialog.querySelector('#_alert-actions');

      const confirmText = opts.confirmText || 'ยืนยัน';
      const cancelText  = opts.cancelText  || 'ยกเลิก';
      const btnClass    = CONFIRM_BTN_CLASS[opts.type] || CONFIRM_BTN_CLASS.info;

      const confirmBtn = document.createElement('button');
      confirmBtn.className = btnClass;
      confirmBtn.textContent = confirmText;

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-tertiary-outline';
      cancelBtn.textContent = cancelText;

      confirmBtn.addEventListener('click', () => {
        destroy(overlay);
        resolve(true);
      });

      cancelBtn.addEventListener('click', () => {
        destroy(overlay);
        resolve(false);
      });

      // Close on backdrop click = cancel
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          destroy(overlay);
          resolve(false);
        }
      });

      // Escape = cancel
      const onKey = (e) => {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', onKey);
          destroy(overlay);
          resolve(false);
        }
      };
      document.addEventListener('keydown', onKey);

      actions.appendChild(confirmBtn);
      actions.appendChild(cancelBtn);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      confirmBtn.focus();
    });
  }

  return { alert, confirm };

})();
