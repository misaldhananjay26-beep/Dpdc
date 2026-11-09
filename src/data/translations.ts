import { Language } from '../types';

export interface Translations {
  brandName: string;
  tagline: string;
  nav: {
    home: string;
    about: string;
    franchise: string;
    benefits: string;
    courses: string;
    registration: string;
    contact: string;
    admin: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaRegister: string;
    ctaExplore: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
  };
  stats: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };
  benefits: {
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    card5Title: string;
    card5Desc: string;
    card6Title: string;
    card6Desc: string;
    partnerTitle: string;
    partnerSubtitle: string;
    partnerResp1: string;
    partnerResp2: string;
    partnerResp3: string;
    complianceNote: string;
  };
  courses: {
    title: string;
    subtitle: string;
    course1Title: string;
    course1Tag: string;
    course1Desc: string;
    course2Title: string;
    course2Tag: string;
    course2Desc: string;
    course3Title: string;
    course3Tag: string;
    course3Desc: string;
  };
  form: {
    badge: string;
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    // Section A
    fullName: string;
    fullNamePlaceholder: string;
    mobile: string;
    mobilePlaceholder: string;
    sameAsMobile: string;
    whatsapp: string;
    whatsappPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    // Section B
    villageCity: string;
    villageCityPlaceholder: string;
    taluka: string;
    talukaPlaceholder: string;
    district: string;
    selectDistrict: string;
    state: string;
    pincode: string;
    pincodePlaceholder: string;
    completeAddress: string;
    completeAddressPlaceholder: string;
    // Section C
    courseStatusTitle: string;
    courseOptCompleted: string;
    courseOptLearning: string;
    courseOptNotCompleted: string;
    courseOptInterested: string;
    qualification: string;
    qualificationPlaceholder: string;
    // Section D
    interestTitle: string;
    interestCentre: string;
    interestStudent: string;
    interestBoth: string;
    interestExploring: string;
    premisesTitle: string;
    premisesYes: string;
    premisesNo: string;
    premisesPlanning: string;
    premisesSize: string;
    premisesSizePlaceholder: string;
    // Section E
    appointmentTitle: string;
    appointmentYes: string;
    appointmentNo: string;
    preferredDate: string;
    preferredTime: string;
    slotMorning: string;
    slotAfternoon: string;
    slotEvening: string;
    slotFlexible: string;
    questions: string;
    questionsPlaceholder: string;
    // Section F
    consentContact: string;
    consentMarketing: string;
    btnPrev: string;
    btnNext: string;
    btnSubmit: string;
    submitting: string;
    // Success
    successTitle: string;
    successMessage: string;
    regIdLabel: string;
    shareWhatsApp: string;
    printSlip: string;
    newRegistration: string;
  };
  contact: {
    title: string;
    subtitle: string;
    callUs: string;
    chatWhatsApp: string;
    emailUs: string;
    visitUs: string;
    hours: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    adminAccess: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  mr: {
    brandName: 'DPDC SKILL PVT. LTD.',
    tagline: 'BUILD • TRAIN • GROW',
    nav: {
      home: 'मुख्यपृष्ठ',
      about: 'आमच्याबद्दल',
      franchise: 'फ्रँचायझी संधी',
      benefits: 'फायदे आणि सहकार्य',
      courses: 'कोर्सेस',
      registration: 'मोफत नोंदणी',
      contact: 'संपर्क',
      admin: 'प्रशासक लॉगिन',
    },
    hero: {
      badge: 'महाराष्ट्र शासन मान्य अभ्यासक्रम व उद्योग संधी',
      headline: 'तुमच्या तालुक्यात स्वतःचे ब्युटी पार्लर ट्रेनिंग सेंटर सुरू करा!',
      subheadline:
        'DPDC SKILL सोबत व्यावसायिक सौंदर्य शिक्षण आणि कौशल्य विकासाची नवीन संधी निर्माण करा. महिलांना स्वावलंबी बनवणारा प्रतिष्ठित व्यवसाय सुरू करा.',
      ctaRegister: 'आजच मोफत नोंदणी करा',
      ctaExplore: 'फ्रँचायझीचे फायदे पहा',
      feature1: '१००% प्रॅक्टिकल ट्रेनिंग व मार्गदर्शन',
      feature2: '४०-५०% जाहिरात व मार्केटिंग सहकार्य',
      feature3: 'विद्यार्थी किट्स व संपूर्ण साहित्य',
      feature4: 'ISO व कंपनी मान्यताप्राप्त प्रमाणपत्र',
    },
    stats: {
      stat1Value: '१००+',
      stat1Label: 'तालुका प्रशिक्षण केंद्रे लक्ष्य',
      stat2Value: '५०००+',
      stat2Label: 'प्रशिक्षित महिलांचे ध्येय',
      stat3Value: '४०-५०%',
      stat3Label: 'स्थानिक जाहिरात सहकार्य',
      stat4Value: '१००%',
      stat4Label: 'व्यावसायिक व प्रॅक्टिकल सपोर्ट',
    },
    benefits: {
      title: 'DPDC SKILL फ्रँचायझीची प्रमुख वैशिष्ट्ये',
      subtitle: 'आपल्या तालुक्यात दर्जेदार ब्युटी पार्लर ट्रेनिंग सेंटर स्थापन करण्यासाठी कंपनीकडून मिळणारे पूर्ण सहकार्य',
      card1Title: 'पारदर्शक फ्रँचायझी नियम',
      card1Desc: 'कंपनीच्या अधिकृत मंजुरीनुसार स्पष्ट व पारदर्शक आर्थिक नियम. कोणतेही छुपे शुल्क नाही.',
      card2Title: 'संपूर्ण सेंटर सेटअप व साहित्य',
      card2Desc: 'आधुनिक ब्युटी पार्लर उपकरणे, फर्निचर मार्गदर्शन आणि प्रशिक्षण साहित्याची पूर्ण रचना.',
      card3Title: '४० ते ५०% मार्केटिंग सपोर्ट',
      card3Desc: 'स्थानिक स्तरावर बॅनर, सोशल मीडिया, जाहिरात पत्रके व विद्यार्थी प्रवेशासाठी प्रत्यक्ष प्रचार सहकार्य.',
      card4Title: 'विद्यार्थी ट्रेनिंग किट्स',
      card4Desc: 'प्रत्येक विद्यार्थ्याला प्रॅक्टिकल शिक्षणासाठी दर्जेदार कॉस्मेटिक्स आणि व्यावसायिक टूल्स किट.',
      card5Title: 'मान्यताप्राप्त प्रमाणपत्रे',
      card5Desc: 'अधिकृत कंपनी व संस्थात्मक निकषांनुसार विद्यार्थ्यांना वैध आणि सन्माननीय प्रमाणपत्रे.',
      card6Title: 'व्यवसाय व संचालन मार्गदर्शन',
      card6Desc: 'सेंटरचे दैनंदिन व्यवस्थापन, ट्रेनर ट्रेनिंग आणि विद्यार्थी कौन्सिलिंगचे निरंतर मार्गदर्शन.',
      partnerTitle: 'भागीदाराची (पार्टनरची) जबाबदारी',
      partnerSubtitle: 'यशस्वी सेंटर चालवण्यासाठी स्थानिक भागीदाराने खालील गोष्टींची पूर्तता करणे आवश्यक आहे:',
      partnerResp1: 'योग्य आणि सुरक्षित व्यावसायिक जागा (२५० ते ५०० चौ.फूट) उपलब्ध करणे.',
      partnerResp2: 'जागेचे मासिक भाडे, वीज बिल व स्थानिक व्यवस्थापन खर्च भरणे.',
      partnerResp3: 'दैनंदिन सेंटर संचालन, विद्यार्थ्यांचे स्वागत व शिस्तबद्ध कामकाज सांभाळणे.',
      complianceNote:
        'महत्त्वाची नोंद: फ्रँचायझी अटी व सवलती कंपनीच्या अधिकृत धोरणानुसार लागू राहतील. कोणत्याही खोट्या दाव्यांवर विश्वास ठेवू नका; सर्व तपशील अधिकृत कराराद्वारे निश्चित केले जातात.',
    },
    courses: {
      title: 'व्यावसायिक सौंदर्य शिक्षण अभ्यासक्रम',
      subtitle: 'आंतरराष्ट्रीय मानकांनुसार तयार केलेला आधुनिक आणि प्रॅक्टिकल अभ्यासक्रम',
      course1Title: 'मास्टर डिप्लोमा इन ब्युटी पार्लर',
      course1Tag: 'सर्वाधिक लोकप्रिय',
      course1Desc: 'स्किन केअर, हेअर कटिंग, स्पा थेरपी, आधुनिक ब्रायडल मेकअप आणि सलोन मॅनेजमेंटचे संपूर्ण प्रशिक्षण.',
      course2Title: 'अॅडव्हान्स ब्रायडल व मेकअप आर्टिस्ट्री',
      course2Tag: 'हाय डिमांड',
      course2Desc: 'एचडी मेकअप, एअरब्रश तंत्र, पारंपरिक व आधुनिक नवरी मेकअप आणि हेअर स्टाइलिंगचे परिपूर्ण ज्ञान.',
      course3Title: 'स्किन, हेअर आणि केमिकल ट्रिटमेंट',
      course3Desc: 'हेअर स्ट्रेटनिंग, केराटिन, बोटॉक्स, फेशियल सायन्स आणि त्वचारोग प्राथमिक उपायांचे सखोल प्रशिक्षण.',
      course3Tag: 'तज्ज्ञ स्तर',
    },
    form: {
      badge: 'मर्यादित जागा उपलब्ध • मोफत नोंदणी',
      title: 'DPDC SKILL प्रशिक्षण / फ्रँचायझी नोंदणी फॉर्म',
      subtitle: 'आपल्या तालुक्यातील सेंटरसाठी किंवा विद्यार्थी प्रवेशासाठी खालील माहिती भरा. आमची टीम २४ तासांत संपर्क करेल.',
      step1: 'वैयक्तिक माहिती',
      step2: 'पत्ता व तालुका',
      step3: 'शिक्षण व आवड',
      step4: 'अपॉइंटमेंट व संमती',
      fullName: 'पूर्ण नाव (Full Name) *',
      fullNamePlaceholder: 'उदा. अनिता सचिन शिंदे',
      mobile: 'मोबाईल नंबर (Mobile Number) *',
      mobilePlaceholder: '१० अंकी मोबाईल नंबर (उदा. 9822012345)',
      sameAsMobile: 'हाच व्हॉट्सअ‍ॅप नंबर आहे',
      whatsapp: 'व्हॉट्सअ‍ॅप नंबर (WhatsApp Number)',
      whatsappPlaceholder: 'व्हॉट्सअ‍ॅप नंबर प्रविष्ट करा',
      email: 'ईमेल पत्ता (Email Address - ऐच्छिक)',
      emailPlaceholder: 'name@example.com',
      villageCity: 'गाव / शहर (Village / City) *',
      villageCityPlaceholder: 'आपल्या गावाचे किंवा शहराचे नाव',
      taluka: 'तालुका (Taluka) *',
      talukaPlaceholder: 'आपला तालुका',
      district: 'जिल्हा (District) *',
      selectDistrict: '-- जिल्हा निवडा --',
      state: 'राज्य (State)',
      pincode: 'पिन कोड (PIN Code) *',
      pincodePlaceholder: '६ अंकी पिन कोड (उदा. 411001)',
      completeAddress: 'संपूर्ण पत्ता (घर / दुकानाचा पत्ता - ऐच्छिक)',
      completeAddressPlaceholder: 'गल्ली, रस्ता किंवा परिसराचा पत्ता',
      courseStatusTitle: 'आपण यापूर्वी ब्युटी पार्लर कोर्स केला आहे का? *',
      courseOptCompleted: 'होय, पूर्ण केला आहे',
      courseOptLearning: 'सध्या शिकत आहे',
      courseOptNotCompleted: 'कोर्स केलेला नाही',
      courseOptInterested: 'शिकण्यास उत्सुक आहे',
      qualification: 'शैक्षणिक पात्रता (Qualification - ऐच्छिक)',
      qualificationPlaceholder: 'उदा. १० वी, १२ वी, पदवीधर (Graduate)',
      interestTitle: 'आपण कशामध्ये उत्सुक आहात? *',
      interestCentre: 'DPDC SKILL ट्रेनिंग सेंटर सुरू करणे (Franchise)',
      interestStudent: 'विद्यार्थी म्हणून शिकणे (Student Admission)',
      interestBoth: 'दोन्ही (ट्रेनिंग सेंटर आणि स्वतः शिकणे)',
      interestExploring: 'सध्या फक्त प्राथमिक माहिती हवी आहे',
      premisesTitle: 'सेंटरसाठी आपल्याकडे स्वतःची किंवा भाड्याची जागा उपलब्ध आहे का? *',
      premisesYes: 'होय, जागा उपलब्ध आहे',
      premisesNo: 'नाही, जागा उपलब्ध नाही',
      premisesPlanning: 'जागेचे नियोजन सुरू आहे / शोधत आहोत',
      premisesSize: 'जागेचे अंदाजे क्षेत्रफळ (चौ.फूट मध्ये - ऐच्छिक)',
      premisesSizePlaceholder: 'उदा. २५० चौ.फूट किंवा १ दुकान',
      appointmentTitle: 'आपल्याला मोफत वैयक्तिक सल्लामसलत (Consultation) हवी आहे का?',
      appointmentYes: 'होय, मला मोफत मार्गदर्शन भेट हवी आहे',
      appointmentNo: 'सध्या नको, फोनवर चर्चा चालेल',
      preferredDate: 'पसंतीची तारीख (Preferred Date)',
      preferredTime: 'पसंतीची वेळ (Preferred Time Slot)',
      slotMorning: 'सकाळ (१०:०० ते १:००)',
      slotAfternoon: 'दुपार (१:०० ते ४:००)',
      slotEvening: 'संध्याकाळ (४:०० ते ७:००)',
      slotFlexible: 'केव्हाही / सोयीनुसार',
      questions: 'काही प्रश्न किंवा विशेष संदेश असल्यास लिहा (ऐच्छिक)',
      questionsPlaceholder: 'आपल्या मनातील शंका, जागेचा तपशील किंवा प्रश्न येथे नमूद करा...',
      consentContact:
        'मी दिलेली माहिती DPDC SKILL PVT. LTD. कडून माझ्याशी संपर्क साधण्यासाठी आणि माझ्या नोंदणीची प्रक्रिया करण्यासाठी वापरण्यास संमती देतो / देते. *',
      consentMarketing: 'नवीन कोर्सेस, ऑफर्स आणि व्यवसाय संधींबाबत WhatsApp व SMS द्वारे माहिती मिळवण्यासाठी संमती (ऐच्छिक).',
      btnPrev: 'मागे जा',
      btnNext: 'पुढील पायरी',
      btnSubmit: 'नोंदणी पूर्ण करा',
      submitting: 'नोंदणी प्रक्रिया सुरू आहे...',
      successTitle: 'नोंदणी यशस्वी झाली!',
      successMessage:
        'धन्यवाद! DPDC SKILL सोबत जोडल्याबद्दल आपले आभार. आपली नोंदणी यशस्वी झाली आहे. आमची टीम लवकरच आपल्याशी संपर्क करेल.',
      regIdLabel: 'आपला नोंदणी क्रमांक (Registration ID):',
      shareWhatsApp: 'व्हॉट्सअ‍ॅपवर शेअर करा',
      printSlip: 'नोंदणी पावती प्रिंट करा',
      newRegistration: 'नवीन नोंदणी करा',
    },
    contact: {
      title: 'आमच्याशी संपर्क साधा',
      subtitle: 'आपल्या तालुक्यातील सेंटर सुरू करण्यासाठी किंवा मार्गदर्शनासाठी आजच बोला',
      callUs: 'कॉल करा (Helpline)',
      chatWhatsApp: 'व्हॉट्सअ‍ॅपवर बोला',
      emailUs: 'ईमेल पाठवा',
      visitUs: 'पत्ता',
      hours: 'कार्यालयीन वेळ',
    },
    footer: {
      rights: 'सर्व हक्क राखीव. DPDC SKILL PVT. LTD. • BUILD • TRAIN • GROW',
      privacy: 'गोपनीयता धोरण (Privacy Policy)',
      terms: 'नियम व अटी (Terms & Conditions)',
      adminAccess: 'प्रशासक पोर्टल',
    },
  },
  hi: {
    brandName: 'DPDC SKILL PVT. LTD.',
    tagline: 'BUILD • TRAIN • GROW',
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      franchise: 'फ्रेंचाइजी अवसर',
      benefits: 'लाभ एवं सहयोग',
      courses: 'कोर्सेज',
      registration: 'मुफ्त पंजीकरण',
      contact: 'संपर्क',
      admin: 'एडमिन लॉगिन',
    },
    hero: {
      badge: 'सरकारी मानकों के अनुरूप सौंदर्य शिक्षा एवं स्वरोजगार',
      headline: 'अपने तहसील में शुरू करें अपना ब्यूटी पार्लर ट्रेनिंग सेंटर!',
      subheadline:
        'DPDC SKILL के साथ पेशेवर सौंदर्य शिक्षा और कौशल विकास का नया अवसर। महिलाओं को आत्मनिर्भर बनाने वाला प्रतिष्ठित व्यवसाय शुरू करें।',
      ctaRegister: 'आज ही मुफ्त पंजीकरण करें',
      ctaExplore: 'फ्रेंचाइजी के फायदे देखें',
      feature1: '१००% प्रैक्टिकल ट्रेनिंग व मार्गदर्शन',
      feature2: '४०-५०% विज्ञापन व मार्केटिंग सहायता',
      feature3: 'स्टूडेंट किट्स व संपूर्ण सामग्री',
      feature4: 'ISO व कंपनी मान्यताप्राप्त प्रमाण पत्र',
    },
    stats: {
      stat1Value: '१००+',
      stat1Label: 'तहसील प्रशिक्षण केंद्र लक्ष्य',
      stat2Value: '५०००+',
      stat2Label: 'प्रशिक्षित महिलाओं का लक्ष्य',
      stat3Value: '४०-५०%',
      stat3Label: 'स्थानीय विज्ञापन सहायता',
      stat4Value: '१००%',
      stat4Label: 'व्यावसायिक व व्यावहारिक सहयोग',
    },
    benefits: {
      title: 'DPDC SKILL फ्रेंचाइजी की प्रमुख विशेषताएं',
      subtitle: 'अपने क्षेत्र में उच्च स्तरीय ब्यूटी पार्लर ट्रेनिंग सेंटर शुरू करने के लिए कंपनी का पूरा सहयोग',
      card1Title: 'पारदर्शी फ्रेंचाइजी नियम',
      card1Desc: 'कंपनी के आधिकारिक नियमों के अनुसार स्पष्ट आर्थिक शर्तें। कोई छुपा शुल्क नहीं।',
      card2Title: 'संपूर्ण सेंटर सेटअप व सामग्री',
      card2Desc: 'आधुनिक ब्यूटी उपकरण, फर्नीचर मार्गदर्शन और प्रशिक्षण सामग्री का पूरा पैकेज।',
      card3Title: '४० से ५०% मार्केटिंग सहायता',
      card3Desc: 'स्थानीय स्तर पर बैनर, सोशल मीडिया, विज्ञापन पत्रक व एडमिशन हेतु पूरा सहयोग।',
      card4Title: 'स्टूडेंट ट्रेनिंग किट्स',
      card4Desc: 'हर विद्यार्थी को प्रैक्टिकल अभ्यास के लिए उच्च गुणवत्ता वाले प्रोडक्ट्स और टूल्स।',
      card5Title: 'मान्यताप्राप्त प्रमाणपत्र',
      card5Desc: 'कंपनी और संस्थागत मानकों के अनुसार वैध और सम्मानित प्रमाण पत्र।',
      card6Title: 'व्यवसाय व संचालन मार्गदर्शन',
      card6Desc: 'सेंटर के दैनिक संचालन, ट्रेनर ट्रेनिंग और एडमिशन काउंसलिंग का निरंतर साथ।',
      partnerTitle: 'पार्टनर की जिम्मेदारियां',
      partnerSubtitle: 'सफल सेंटर चलाने के लिए पार्टनर द्वारा निम्न आवश्यकताओं की पूर्ति आवश्यक है:',
      partnerResp1: 'उपयुक्त व सुरक्षित व्यावसायिक जगह (२५० से ५०० वर्ग फुट) की व्यवस्था।',
      partnerResp2: 'स्थान का मासिक किराया, बिजली बिल व स्थानीय खर्च वहन करना।',
      partnerResp3: 'दैनिक सेंटर संचालन, विद्यार्थियों की देखरेख व अनुशासन संभालना।',
      complianceNote:
        'महत्वपूर्ण सूचना: फ्रेंचाइजी नियम व शर्तें कंपनी की आधिकारिक नीति के अनुसार लागू होंगी। सभी विवरण औपचारिक अनुबंध में दर्ज किए जाते हैं।',
    },
    courses: {
      title: 'व्यावसायिक सौंदर्य शिक्षा पाठ्यक्रम',
      subtitle: 'आधुनिक और व्यावहारिक दृष्टिकोण से तैयार किया गया अंतरराष्ट्रीय स्तर का पाठ्यक्रम',
      course1Title: 'मास्टर डिप्लोमा इन ब्यूटी पार्लर',
      course1Tag: 'सर्वाधिक लोकप्रिय',
      course1Desc: 'स्किन केयर, हेयर स्टाइलिंग, स्पा थेरेपी, आधुनिक ब्राइडल मेकअप और सैलून प्रबंधन।',
      course2Title: 'एडवांस ब्राइडल एवं मेकअप आर्टिस्ट्री',
      course2Tag: 'उच्च मांग',
      course2Desc: 'एचडी मेकअप, पारंपरिक व आधुनिक दुल्हन श्रृंगार और हेयर स्टाइलिंग का संपूर्ण ज्ञान।',
      course3Title: 'स्किन, हेयर और केमिकल ट्रीटमेंट',
      course3Tag: 'विशेषज्ञ स्तर',
      course3Desc: 'हेयर स्ट्रेटनिंग, केराटिन, बोटोक्स और त्वचा संबंधी प्राथमिक वैज्ञानिक उपचार।',
    },
    form: {
      badge: 'सीमित सीटें उपलब्ध • मुफ्त पंजीकरण',
      title: 'DPDC SKILL प्रशिक्षण / फ्रेंचाइजी पंजीकरण फॉर्म',
      subtitle: 'अपने क्षेत्र में सेंटर या विद्यार्थी प्रवेश के लिए नीचे दी गई जानकारी भरें। हमारी टीम शीघ्र संपर्क करेगी।',
      step1: 'व्यक्तिगत जानकारी',
      step2: 'पता व तहसील',
      step3: 'शिक्षा व रुचि',
      step4: 'अपॉइंटमेंट व सहमति',
      fullName: 'पूरा नाम (Full Name) *',
      fullNamePlaceholder: 'उदा. अनीता सचिन शिंदे',
      mobile: 'मोबाइल नंबर (Mobile Number) *',
      mobilePlaceholder: '१० अंकों का मोबाइल नंबर',
      sameAsMobile: 'यही व्हाट्सएप नंबर है',
      whatsapp: 'व्हाट्सएप नंबर (WhatsApp Number)',
      whatsappPlaceholder: 'व्हाट्सएप नंबर दर्ज करें',
      email: 'ईमेल पता (Email Address - ऐच्छिक)',
      emailPlaceholder: 'name@example.com',
      villageCity: 'गांव / शहर (Village / City) *',
      villageCityPlaceholder: 'अपने गांव या शहर का नाम',
      taluka: 'तहसील (Taluka) *',
      talukaPlaceholder: 'अपनी तहसील का नाम',
      district: 'जिला (District) *',
      selectDistrict: '-- जिला चुनें --',
      state: 'राज्य (State)',
      pincode: 'पिन कोड (PIN Code) *',
      pincodePlaceholder: '६ अंकों का पिन कोड',
      completeAddress: 'पूरा पता (घर / दुकान का पता - ऐच्छिक)',
      completeAddressPlaceholder: 'गली, मोहल्ला या निकटतम लैंडमार्क',
      courseStatusTitle: 'क्या आपने पहले ब्यूटी पार्लर का कोर्स किया है? *',
      courseOptCompleted: 'हाँ, पूरा कर चुकी हूँ',
      courseOptLearning: 'वर्तमान में सीख रही हूँ',
      courseOptNotCompleted: 'कोर्स नहीं किया है',
      courseOptInterested: 'सीखने में रुचि है',
      qualification: 'शैक्षणिक योग्यता (Qualification - ऐच्छिक)',
      qualificationPlaceholder: 'उदा. १०वीं, १२वीं, स्नातक (Graduate)',
      interestTitle: 'आप किसमें रुचि रखते हैं? *',
      interestCentre: 'DPDC SKILL ट्रेनिंग सेंटर शुरू करना (Franchise)',
      interestStudent: 'विद्यार्थी के रूप में सीखना (Student Admission)',
      interestBoth: 'दोनों (सेंटर और स्वयं सीखना)',
      interestExploring: 'अभी सिर्फ सामान्य जानकारी चाहिए',
      premisesTitle: 'क्या आपके पास सेंटर के लिए जगह उपलब्ध है? *',
      premisesYes: 'हाँ, जगह उपलब्ध है',
      premisesNo: 'नहीं, जगह उपलब्ध नहीं है',
      premisesPlanning: 'स्थान की योजना बना रहे हैं',
      premisesSize: 'अनुमानित क्षेत्रफल (वर्ग फुट में - ऐच्छिक)',
      premisesSizePlaceholder: 'उदा. ३०० वर्ग फुट',
      appointmentTitle: 'क्या आप निःशुल्क व्यक्तिगत परामर्श चाहते हैं?',
      appointmentYes: 'हाँ, मुझे व्यक्तिगत मार्गदर्शन चाहिए',
      appointmentNo: 'अभी नहीं, फोन पर बातचीत पर्याप्त है',
      preferredDate: 'पसंदीदा तारीख (Preferred Date)',
      preferredTime: 'पसंदीदा समय (Preferred Time Slot)',
      slotMorning: 'सुबह (१०:०० से १:००)',
      slotAfternoon: 'दोपहर (१:०० से ४:००)',
      slotEvening: 'शाम (४:०० से ७:००)',
      slotFlexible: 'कभी भी / सुविधानुसार',
      questions: 'कोई प्रश्न या संदेश हो तो लिखें (ऐच्छिक)',
      questionsPlaceholder: 'अपने विचार या सवाल यहाँ लिखें...',
      consentContact:
        'मैं पुष्टि करता/करती हूँ कि मेरी दी गई जानकारी का उपयोग DPDC SKILL PVT. LTD. द्वारा संपर्क करने व पंजीकरण हेतु किया जाए। *',
      consentMarketing: 'व्हाट्सएप व एसएमएस द्वारा नए कोर्सेज व ऑफर्स की जानकारी प्राप्त करने की सहमति (ऐच्छिक)।',
      btnPrev: 'पीछे',
      btnNext: 'आगे बढ़ें',
      btnSubmit: 'पंजीकरण पूरा करें',
      submitting: 'पंजीकरण हो रहा है...',
      successTitle: 'पंजीकरण सफल रहा!',
      successMessage:
        'धन्यवाद! DPDC SKILL से जुड़ने के लिए आपका आभार। आपका पंजीकरण सफलतापूर्वक दर्ज हो गया है। हमारी टीम जल्द संपर्क करेगी।',
      regIdLabel: 'आपका पंजीकरण क्रमांक (Registration ID):',
      shareWhatsApp: 'व्हाट्सएप पर साझा करें',
      printSlip: 'रसीद प्रिंट करें',
      newRegistration: 'नया पंजीकरण करें',
    },
    contact: {
      title: 'हमसे संपर्क करें',
      subtitle: 'अपने क्षेत्र में सेंटर शुरू करने के लिए आज ही संपर्क करें',
      callUs: 'कॉल करें (हेल्पलाइन)',
      chatWhatsApp: 'व्हाट्सएप पर बात करें',
      emailUs: 'ईमेल भेजें',
      visitUs: 'पता',
      hours: 'कार्यालय समय',
    },
    footer: {
      rights: 'सर्वाधिकार सुरक्षित। DPDC SKILL PVT. LTD. • BUILD • TRAIN • GROW',
      privacy: 'गोपनीयता नीति (Privacy Policy)',
      terms: 'नियम व शर्तें (Terms & Conditions)',
      adminAccess: 'एडमिन पोर्टल',
    },
  },
  en: {
    brandName: 'DPDC SKILL PVT. LTD.',
    tagline: 'BUILD • TRAIN • GROW',
    nav: {
      home: 'Home',
      about: 'About Us',
      franchise: 'Franchise Opportunity',
      benefits: 'Benefits & Support',
      courses: 'Courses',
      registration: 'Free Registration',
      contact: 'Contact',
      admin: 'Admin Login',
    },
    hero: {
      badge: 'Recognized Beauty Education & Entrepreneurship',
      headline: 'Start Your Own Beauty Parlour Training Centre in Your Taluka!',
      subheadline:
        'Partner with DPDC SKILL to build a prestigious beauty training and skill development venture. Empower women entrepreneurs with a high-growth career.',
      ctaRegister: 'Register for Free Today',
      ctaExplore: 'Explore Franchise Benefits',
      feature1: '100% Practical Training & Mentorship',
      feature2: '40-50% Marketing & Advertising Support',
      feature3: 'Complete Student Training Kits & Materials',
      feature4: 'ISO & Officially Certified Curriculum',
    },
    stats: {
      stat1Value: '100+',
      stat1Label: 'Taluka Training Centres Target',
      stat2Value: '5,000+',
      stat2Label: 'Women Entrepreneurs Goal',
      stat3Value: '40-50%',
      stat3Label: 'Local Marketing Co-Support',
      stat4Value: '100%',
      stat4Label: 'Operational & Business Guidance',
    },
    benefits: {
      title: 'DPDC SKILL Franchise Core Benefits',
      subtitle: 'Complete institutional backing to establish a premier beauty academy in your region',
      card1Title: 'Transparent Commercial Terms',
      card1Desc: 'Clearly defined and officially approved company financial terms with zero hidden fees.',
      card2Title: 'Complete Centre Setup & Materials',
      card2Desc: 'State-of-the-art beauty equipment, layout guidance, and full training supplies.',
      card3Title: '40% to 50% Marketing Support',
      card3Desc: 'Banners, social media promotions, hoardings, and local lead-generation support.',
      card4Title: 'Student Practical Kits',
      card4Desc: 'Professional cosmetics, skin & hair care kits provided for every enrolled student.',
      card5Title: 'Recognized Certifications',
      card5Desc: 'Government-aligned and institutionally verified certificates with career value.',
      card6Title: 'Business & Operational Mentorship',
      card6Desc: 'Ongoing trainer upskilling, curriculum scheduling, and business counseling.',
      partnerTitle: "Partner's Responsibilities",
      partnerSubtitle: 'To ensure center success, the local franchise partner arranges:',
      partnerResp1: 'Suitable commercial premises (250 to 500 sq.ft) with safety and water/power.',
      partnerResp2: 'Payment of monthly property rent and operational utility bills.',
      partnerResp3: 'Daily center operation, welcoming students, and maintaining discipline.',
      complianceNote:
        'Important Notice: Commercial terms and special promotions are governed strictly by the approved company agreements. Always refer to official documentation.',
    },
    courses: {
      title: 'Professional Beauty Curriculum',
      subtitle: 'Designed according to international salon and cosmetology standards',
      course1Title: 'Master Diploma in Beauty Parlour',
      course1Tag: 'Most Popular',
      course1Desc: 'Comprehensive training in skincare, hair styling, spa therapies, bridal makeup, and salon management.',
      course2Title: 'Advanced Bridal & Makeup Artistry',
      course2Tag: 'High Demand',
      course2Desc: 'HD makeup techniques, airbrush training, traditional bridal dressing, and creative hair design.',
      course3Title: 'Skin, Hair & Chemical Treatments',
      course3Tag: 'Specialist Level',
      course3Desc: 'Hair straightening, keratin, botox, facial sciences, and salon-grade dermatological care.',
    },
    form: {
      badge: 'Limited Taluka Slots • Free Registration',
      title: 'DPDC SKILL Training & Franchise Registration',
      subtitle: 'Fill in your details to apply for a taluka center or student enrollment. Our executive will reach out within 24 hours.',
      step1: 'Personal Details',
      step2: 'Address & Taluka',
      step3: 'Education & Interest',
      step4: 'Appointment & Consent',
      fullName: 'Full Name *',
      fullNamePlaceholder: 'e.g. Anita Sachin Shinde',
      mobile: 'Mobile Number *',
      mobilePlaceholder: '10-digit mobile number',
      sameAsMobile: 'Same as WhatsApp number',
      whatsapp: 'WhatsApp Number',
      whatsappPlaceholder: 'Enter WhatsApp number',
      email: 'Email Address (Optional)',
      emailPlaceholder: 'name@example.com',
      villageCity: 'Village / City *',
      villageCityPlaceholder: 'Your town, village or city',
      taluka: 'Taluka *',
      talukaPlaceholder: 'Your taluka name',
      district: 'District *',
      selectDistrict: '-- Select District --',
      state: 'State',
      pincode: 'PIN Code *',
      pincodePlaceholder: '6-digit postal PIN code',
      completeAddress: 'Complete Address (Optional)',
      completeAddressPlaceholder: 'Shop / house / street landmark',
      courseStatusTitle: 'Have you completed a Beauty Parlour course? *',
      courseOptCompleted: 'Yes, Completed',
      courseOptLearning: 'Currently Learning',
      courseOptNotCompleted: 'Not Completed',
      courseOptInterested: 'Interested in Learning',
      qualification: 'Educational Qualification (Optional)',
      qualificationPlaceholder: 'e.g. 10th, 12th, Graduate',
      interestTitle: 'What are you interested in? *',
      interestCentre: 'Starting a DPDC SKILL Training Centre (Franchise)',
      interestStudent: 'Joining as a Student (Admission)',
      interestBoth: 'Both (Centre & Personal Learning)',
      interestExploring: 'Just exploring general information',
      premisesTitle: 'Do you have commercial premises available? *',
      premisesYes: 'Yes, premises available',
      premisesNo: 'No, currently not available',
      premisesPlanning: 'Currently searching / planning premises',
      premisesSize: 'Approximate Space Area (sq.ft - Optional)',
      premisesSizePlaceholder: 'e.g. 350 sq.ft or 1 shop',
      appointmentTitle: 'Would you like a free 1-on-1 consultation appointment?',
      appointmentYes: 'Yes, I would like personal guidance',
      appointmentNo: 'Not right now, telephonic discussion is fine',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time Slot',
      slotMorning: 'Morning (10:00 AM - 1:00 PM)',
      slotAfternoon: 'Afternoon (1:00 PM - 4:00 PM)',
      slotEvening: 'Evening (4:00 PM - 7:00 PM)',
      slotFlexible: 'Flexible / Anytime',
      questions: 'Questions or additional message (Optional)',
      questionsPlaceholder: 'Write any specific queries or premise notes here...',
      consentContact:
        'I consent to DPDC SKILL PVT. LTD. contacting me and processing my submitted registration details. *',
      consentMarketing: 'Optional consent to receive promotional updates, course notifications, and franchise alerts via WhatsApp/SMS.',
      btnPrev: 'Previous',
      btnNext: 'Next Step',
      btnSubmit: 'Complete Registration',
      submitting: 'Submitting Registration...',
      successTitle: 'Registration Successful!',
      successMessage:
        'Thank you for connecting with DPDC SKILL PVT. LTD. Your registration has been submitted successfully. Our team will contact you shortly.',
      regIdLabel: 'Your Registration ID:',
      shareWhatsApp: 'Share on WhatsApp',
      printSlip: 'Print Registration Slip',
      newRegistration: 'Submit Another Registration',
    },
    contact: {
      title: 'Get in Touch with DPDC SKILL',
      subtitle: 'Reach out to our executive desk for taluka allotments and admissions',
      callUs: 'Call Us (Helpline)',
      chatWhatsApp: 'Chat on WhatsApp',
      emailUs: 'Email Address',
      visitUs: 'Corporate Address',
      hours: 'Working Hours',
    },
    footer: {
      rights: 'All Rights Reserved. DPDC SKILL PVT. LTD. • BUILD • TRAIN • GROW',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      adminAccess: 'Admin Portal',
    },
  },
};
