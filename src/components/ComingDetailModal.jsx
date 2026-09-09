import { COMING_SOON } from '../data/comingSoon.js';
import { useApp } from '../context/AppContext.jsx';
import { videoTitle, videoCategory } from '../i18n/videoTitles.js';

const DESC = {
  'MIDNIGHT ESCAPE': {
    hi: 'दो क्राइम परिवारों का गुप्त समझौता तब टूट जाता है जब एक गवाह मौत से वापस आता है।',
    ur: 'دو کرائم خاندانوں کا خفیہ معاہدہ اس وقت ٹوٹ جاتا ہے جب ایک گواہ موت سے واپس آتا ہے۔',
  },
  'THE WANTED TARGET': {
    hi: 'एक अंडरकवर एजेंट के पास परमाणु ट्रिगर दुश्मन तक पहुँचने से रोकने के लिए 60 मिनट हैं।',
    ur: 'ایک انڈر کور ایجنٹ کے پاس نیوکلیئر ٹرگر دشمن تک پہنچنے سے روکنے کے لیے 60 منٹ ہیں۔',
  },
  'DARK EVEDENCE': {
    hi: '1987 का एक रेडियो सिग्नल आज हो रहे मर्डर की भविष्यवाणी करने लगता है।',
    ur: '1987 کا ایک ریڈیو سگنل آج ہونے والے قتل کی پیشین گوئی کرنے لگتا ہے۔',
  },
  'SHADOW FORCE': {
    hi: 'एक हैकर सरकारी निगरानी प्रोग्राम खोजता है जो बहुत कुछ जानता है।',
    ur: 'ایک ہیکر سرکاری نگرانی پروگرام دریافت کرتا ہے جو بہت کچھ جانتا ہے۔',
  },
  'CRIME SYNDICATE': {
    hi: 'एक जासूस। दस क्राइम लॉर्ड। एक शहर पतन के कगार पर।',
    ur: 'ایک جاسوس۔ دس کرائم لارڈز۔ ایک شہر تباہی کے دہانے پر۔',
  },
};

export default function ComingDetailModal() {
  const { comingDetailIdx, setComingDetailIdx, lang, tr } = useApp();
  if (comingDetailIdx === null) return null;

  const item = COMING_SOON[comingDetailIdx];
  if (!item) return null;

  const title = videoTitle(lang, item.title);
  const desc = DESC[item.title]?.[lang] || item.desc;

  return (
    <div
      className="coming-detail open"
      aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget) setComingDetailIdx(null); }}
    >
      <div className="coming-detail-box">
        <button type="button" className="modal-close-btn" onClick={() => setComingDetailIdx(null)} aria-label={tr('close')}>&times;</button>
        <img src={encodeURI(item.thumb)} alt={title} />
        <div className="coming-detail-body">
          <h3>{title}</h3>
          <p className="coming-meta">{videoCategory(lang, item.category)} · {item.releaseDate}</p>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
}
