import { useApp } from '../context/AppContext.jsx';

export default function UnlockModal() {
  const {
    unlockOpen,
    setUnlockOpen,
    unlockStep,
    setUnlockStep,
    unlockPhone,
    phoneInput,
    phoneError,
    handlePhoneChange,
    unlockStepNext,
    unlockWithPlan,
    PLANS,
    tr,
  } = useApp();

  if (!unlockOpen) return null;

  const planLabel = (p) => {
    if (p.id === 'monthly') return { name: tr('monthly'), period: tr('perMonth') };
    if (p.id === 'quarterly') return { name: tr('quarterly'), period: tr('perQuarter') };
    return { name: p.name, period: p.period };
  };

  return (
    <div
      className="modal-backdrop open"
      aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget) setUnlockOpen(false); }}
    >
      <div className="modal-box">
        <button type="button" className="modal-close-btn" onClick={() => setUnlockOpen(false)} aria-label="Close">&times;</button>
        {unlockStep === 1 ? (
          <div id="unlock-step-1">
            <h2 className="modal-title">{tr('unlockTitle')}</h2>
            <p className="modal-sub">{tr('unlockSub')}</p>
            <label className="form-label" htmlFor="unlock-phone">{tr('mobileNumber')}</label>
            <div className={`phone-field${phoneError ? ' is-invalid' : ''}`}>
              <span className="phone-prefix">🇵🇰 +92</span>
              <input
                className={`phone-input${phoneError ? ' is-invalid' : ''}${phoneInput.length === 10 ? ' valid' : ''}`}
                id="unlock-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder={tr('phonePlaceholder')}
                value={phoneInput}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </div>
            {phoneError && <p className="phone-error is-visible" role="alert">{phoneError}</p>}
            <button type="button" className="btn-continue" onClick={unlockStepNext}>{tr('continue')}</button>
          </div>
        ) : (
          <div id="unlock-step-2">
            <button type="button" className="btn-back" onClick={() => setUnlockStep(1)}>
              ← {tr('changeNumber')} (+91 {unlockPhone})
            </button>
            <h2 className="modal-title">{tr('choosePlan')}</h2>
            <p className="modal-sub">{tr('choosePlanSub')}</p>
            <div id="unlock-plans">
              {PLANS.map((p) => {
                const labels = planLabel(p);
                return (
                  <div key={p.id} className="plan-card">
                    <div className="plan-card-head">
                      <p className="plan-name">{labels.name}</p>
                      <p className="plan-period">{labels.period}</p>
                      <p className="plan-price">{p.price}</p>
                    </div>
                    <div className="plan-card-actions">
                      <button
                        type="button"
                        className="plan-pay-btn plan-pay-once"
                        onClick={() => unlockWithPlan(p.id, unlockPhone)}
                      >
                        {tr('continue')}
                        <span className="plan-pay-sub">{tr('unlockFor')} {p.price}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="unlock-plans-note">{tr('plansNote')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
