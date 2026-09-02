import { useApp } from '../context/AppContext.jsx';

export default function DeviceShowcase() {
  const { tr } = useApp();

  return (
    <section className="device-section" id="devices">
      <div className="device-heading">
        <p className="eyebrow">{tr('devicesEyebrow')}</p>
        <h2>{tr('devicesTitle')}</h2>
        <p>{tr('devicesSub')}</p>
      </div>
      <div className="device-row device-row-desktop">
        <div className="device-tv">
          <span className="device-badge left">{tr('desktop')}</span>
          <div className="device-tv-frame">
            <div className="device-tv-screen">
              <img src={encodeURI('/img/newlandscape/SCILENT CHASE.jpg')} alt="Desktop Screen" />
              <div className="device-tv-overlay">
                <div className="device-tv-sidebar">
                  <div className="brand">
                    <img src="/img/logo/Noorie.png" alt="Noorie-X" style={{ height: 18, width: 'auto' }} />
                  </div>
                  <div className="device-tv-nav active"><i />{tr('home')}</div>
                  <div className="device-tv-nav"><i />{tr('explore')}</div>
                  <div className="device-tv-nav"><i />{tr('favourites')}</div>
                  <div className="device-tv-nav"><i />{tr('settings')}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="device-tv-stand"><span /></div>
          <div className="device-tv-base"><span /></div>
        </div>
      </div>
      <div className="device-row device-row-mobile">
        <div className="device-phone">
          <span className="device-badge">{tr('mobileDevice')}</span>
          <div className="device-phone-frame">
            <div className="device-phone-notch"><span /></div>
            <div className="device-phone-screen">
              <img src={encodeURI('/img/newportrait/FINAL WITNESS.jpg')} alt="Phone Screen" />
            </div>
          </div>
        </div>
      </div>
      <div className="device-pills">
        <span>4K Ultra HD</span>
        <span>Dolby Audio</span>
        <span>No Ads</span>
        <span>Multi-Device</span>
      </div>
    </section>
  );
}
