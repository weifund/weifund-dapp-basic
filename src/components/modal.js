import yo from 'yo-yo';

import { el } from '../document';

function closeDialog() {
  el('.modal-weifund').style.display = 'none';
}

export default function modal(options) {
  const t = options.t;

  return yo`<div class="modal modal-weifund" style="display: block;">
  <div class="modal-blur"
    onclick=${(e) => {
      closeDialog(e);
      options.onClose(e);
    }}>
  </div>
  <div class="modal-dialog">
    <div class="modal-content">
      <form onsubmit=${e => {
          e.preventDefault();
          options.onAction(e);
          closeDialog(e);
        } || (e => {})(e)}>
        <div class="modal-header">
          <button type="button"
            onclick=${(e) => {
              closeDialog(e);
              options.onClose(e);
            }}
            class="close"
            data-dismiss="modal"
            aria-hidden="true">
            x
          </button>
          <h4 class="modal-title">${options.title || ''}</h4>
        </div>
        <div class="modal-body">
          ${options.body || ''}
        </div>
        <div class="modal-footer">
          <button
            onclick=${(e) => {
              closeDialog(e);
              options.onClose(e);
            }}
            type="button"
            class="btn btn-default"
            data-dismiss="modal">
            Close
          </button>
          <button
            onclick=${e => {
              e.preventDefault();
              options.onAction(e);
              closeDialog(e);
            } || (e => {})(e)}
            type="submit"
            class="btn btn-primary">
            ${options.actionTitle || ''}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>`;
}
