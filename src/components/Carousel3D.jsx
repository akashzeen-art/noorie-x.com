import { CAROUSEL_3D_IMAGES } from '../data/heroData.js';

export default function Carousel3D() {
  return (
    <section className="c3d-section" id="featured-collection">
      <div className="section-header">
        <div className="section-bar" />
        <h2 className="section-title">Featured Collection</h2>
      </div>
      <div className="c3d-scene">
        <div className="c3d-ring">
          {CAROUSEL_3D_IMAGES.map((src, i) => (
            <div key={src} className="c3d-card" style={{ '--i': i }}>
              <img src={encodeURI(src)} alt="" loading="lazy" />
              <div className="thumb-play" aria-hidden="true">
                <span>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <polygon points="8,5 19,12 8,19" fill="white" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
