import { useApp } from '../context/AppContext.jsx';
import { getContact, phoneFromCookie, formatPhone } from '../utils/phone.js';

function formatPlan(planId, plans, tr) {
  const p = plans.find((x) => x.id === planId);
  if (!p) return planId;
  const name = planId === 'monthly' ? tr('monthly') : planId === 'quarterly' ? tr('quarterly') : p.name;
  return name + ' — ' + p.price;
}

export default function AccountModal() {
  const {
    accountOpen,
    setAccountOpen,
    subscriber,
    setUnlockOpen,
    logoutAccount,
    getSubscription,
    PLANS,
    tr,
  } = useApp();

  if (!accountOpen) return null;

  const c = getContact();
  const phone = (c && c.phone) || phoneFromCookie();
  const sub = getSubscription();
  const planId = (sub && sub.plan) || (c && c.plan);

  return (
    <div
      className="modal-backdrop open"
      aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget) setAccountOpen(false); }}
    >
      <div className="modal-box">
        <button type="button" className="modal-close-btn" onClick={() => setAccountOpen(false)} aria-label="Close">&times;</button>
        <div className="account-header">
          <div className="account-icon">👤</div>
          <h2 className="modal-title" style={{ margin: 0 }}>{tr('accountTitle')}</h2>
        </div>
        <div id="account-body">
          {subscriber ? (
            <>
              <div className="account-badge">{tr('activeSub')}</div>
              {phone && (
                <div className="account-row">
                  <span className="account-label">{tr('mobile')}</span>
                  <span className="account-value">{formatPhone(phone)}</span>
                </div>
              )}
              {planId && (
                <div className="account-row">
                  <span className="account-label">{tr('plan')}</span>
                  <span className="account-value">{formatPlan(planId, PLANS, tr)}</span>
                </div>
              )}
              <button type="button" className="account-logout" onClick={logoutAccount}>{tr('logout')}</button>
            </>
          ) : (
            <>
              <p className="account-empty">{tr('noSub')}</p>
              <button
                type="button"
                className="btn-continue"
                onClick={() => { setAccountOpen(false); setUnlockOpen(true); }}
              >
                {tr('subscribeNow')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
