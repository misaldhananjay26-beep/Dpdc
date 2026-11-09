import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#121215] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                गोपनीयता धोरण (Privacy Policy)
              </h3>
              <p className="text-xs text-gray-400">DPDC SKILL PVT. LTD. • डेटा संरक्षण आणि गोपनीयता</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-5 space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed pr-2">
          <div>
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">१. माहिती संकलन (Information We Collect)</h4>
            <p>
              DPDC SKILL PVT. LTD. च्या अधिकृत पोर्टलवर नोंदणी करताना आम्ही आपले पूर्ण नाव, मोबाईल क्रमांक, व्हॉट्सअ‍ॅप नंबर, गाव/शहर, तालुका, जिल्हा, पिन कोड, व्यावसायिक रुची आणि सल्लामसलतीसाठी पसंतीची वेळ इत्यादी माहिती संकलित करतो.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">२. माहितीचा वापर (Purpose of Processing)</h4>
            <p>
              संकलित केलेली माहिती केवळ फ्रँचायझी वाटप, विद्यार्थी प्रवेश समुपदेशन, सल्लामसलत अपॉइंटमेंट निश्चित करणे आणि आपल्याशी थेट संपर्क साधण्यासाठी वापरली जाते.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">३. डेटा सुरक्षा व गोपनीयता (Data Security & DPDP Compliance)</h4>
            <p>
              आम्ही भारतीय डिजिटल वैयक्तिक डेटा संरक्षण कायद्याच्या (DPDP Act) तत्त्वांचे पालन करतो. आपली माहिती कोणत्याही त्रयस्थ पक्षाला विक्री केली जात नाही. सर्व डेटा सुरक्षित एनक्रिप्शन व अधिकृत सर्व्हरवर ठेवला जातो.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">४. डेटा साठवणूक व हटवण्याचे अधिकार (Retention & Deletion)</h4>
            <p>
              आपला डेटा व्यवसाय प्रक्रिया पूर्ण होईपर्यंत साठवला जातो. आपण इच्छित असल्यास DPDC SKILL अधिकृत हेल्पलाईन किंवा व्हॉट्सअ‍ॅपवर संपर्क साधून आपला डेटा अद्ययावत अथवा हटवण्याची विनंती करू शकता.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#18181D] border border-neutral-800 text-xs text-gray-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>
              नोंदणी फॉर्म सबमिट करून आपण या गोपनीयता धोरणास व आपल्याशी संपर्क साधण्यास पूर्ण सहमती दर्शवता.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="gold-gradient-btn px-6 py-2 rounded-xl text-xs font-bold"
          >
            समजले व मान्य आहे
          </button>
        </div>
      </div>
    </div>
  );
};
