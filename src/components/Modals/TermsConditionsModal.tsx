import React from 'react';
import { X, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#121215] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                नियम व अटी (Terms & Conditions)
              </h3>
              <p className="text-xs text-gray-400">DPDC SKILL PVT. LTD. • अधिकृत फ्रँचायझी व नोंदणी नियम</p>
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
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">१. नोंदणीचा उद्देश (Purpose of Registration)</h4>
            <p>
              ही नोंदणी केवळ प्राथमिक स्वारस्य (Expression of Interest) नोंदवण्यासाठी आणि सल्लामसलतीसाठी आहे. केवळ फॉर्म भरल्याने फ्रँचायझी केंद्र वाटपाचा किंवा प्रवेशाचा अंतिम अधिकार मिळत नाही. अंतिम वाटप कंपनीच्या अधिकृत पडताळणीनंतर होते.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">२. भागीदाराची जबाबदारी (Partner Obligations)</h4>
            <p>
              फ्रँचायझी पार्टनरने स्वतःच्या तालुक्यातील योग्य, सुरक्षित आणि मोक्याची व्यावसायिक जागा (२५० ते ५०० चौ.फूट) उपलब्ध करणे आवश्यक आहे. जागेचे मासिक भाडे, वीज बिल, पाणी व स्थानिक कर भरण्याची जबाबदारी पूर्णपणे पार्टनरची राहील.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">३. कंपनीचे सहकार्य व साहित्य (Company Support)</h4>
            <p>
              कंपनी मंजूर धोरणानुसार सेंटरसाठी आवश्यक उपकरणे, ४० ते ५०% मार्केटिंग सहकार्य, विद्यार्थी प्रॅक्टिकल किट्स आणि मान्यताप्राप्त अभ्यासक्रम व प्रमाणपत्रे उपलब्ध करून देईल.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1A1810] border border-amber-600/40 text-xs text-amber-200/90 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">उत्पन्नाची हमी नाही (Commercial Disclaimer):</span>
              व्यवसायातील नफा किंवा उत्पन्न हे स्थानिक बाजारपेठ, भागीदाराची मेहनत, सेवेचा दर्जा आणि व्यवस्थापनावर अवलंबून असते. कंपनी कोणत्याही ठराविक नफ्याची किंवा उत्पन्नाची कायदेशीर हमी देत नाही.
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F5DE9E] mb-1">४. माहितीची अचूकता (Accuracy of Information)</h4>
            <p>
              अर्जदाराने दिलेली माहिती खरी आणि अचूक असावी. खोटी किंवा दिशाभूल करणारी माहिती आढळल्यास अर्ज रद्द करण्याचा अधिकार कंपनीकडे राखीव आहे.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="gold-gradient-btn px-6 py-2 rounded-xl text-xs font-bold"
          >
            वाचले व मान्य आहे
          </button>
        </div>
      </div>
    </div>
  );
};
