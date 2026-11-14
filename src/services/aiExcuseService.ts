export type ExcusePersona = 'ALARM' | 'HOSTEL' | 'TECH' | 'PHILOSOPHICAL';

export interface GenerateExcuseParams {
  subjectName: string;
  persona: ExcusePersona;
  apiKey?: string;
}

export interface ExcuseResult {
  text: string;
  isAiGenerated: boolean;
}

const PERSONA_PROMPTS: Record<ExcusePersona, string> = {
  ALARM: 'थीम: अलार्म का धोखा, टाइमज़ोन ग्लिच, या फोन का अनचाहा सॉफ्टवेयर अपडेट। बहुत ही फनी और ड्रामेटिक।',
  HOSTEL: 'थीम: कॉलेज हॉस्टल का ड्रामा, वार्डन का छापा, इंडक्शन चूल्हा छुपाना, या गीजर का पानी खत्म होना।',
  TECH: 'थीम: इनफिनिट कोडिंग लूप, गिट (Git) मर्ज कॉन्फ्लिक्ट, या लैपटॉप का हैंग होना।',
  PHILOSOPHICAL: 'थीम: क्वांटम फिजिक्स के बहाने, कमरे की एंट्रॉपी, या 8 बजे की क्लास के अस्तित्व पर गहरा दार्शनिक विचार।',
};

const FALLBACK_EXCUSES: Record<ExcusePersona, string[]> = {
  ALARM: [
    "मेरा अलार्म ठीक 7:59 बजे अपने आप सॉफ्टवेयर अपडेट में फंस गया और फोन बूट लूप में चला गया। जब तक फोन रीस्टार्ट हुआ, तब तक क्लास खत्म हो चुकी थी।",
    "मैंने रात को पूरे पांच अलार्म सेट किए थे, लेकिन मेरी अंतरात्मा ने नींद में ही सब बंद कर दिए। जब तक आंख खुली, तब तक अटेंडेंस रजिस्टर बंद हो चुका था।",
    "मेरा फोन गलती से किसी विदेशी टाइमज़ोन में चला गया और उसे लगा कि भारत में अभी रात के 3 बज रहे हैं। टाइम ट्रैवल के इस तकनीकी ग्लिच के कारण मेरी क्लास छूट गई।",
  ],
  HOSTEL: [
    "जैसे ही मैं जूते पहन रहा था, वार्डन साहब ने अचानक सरप्राइज इंस्पेक्शन शुरू कर दिया और मुझे इंडक्शन चूल्हा छुपाने में आधा घंटा लग गया। बड़ी मुश्किल से चूल्हा और अपनी इज्जत बचाकर बाहर निकला।",
    "हॉस्टल के गीजर ने सिर्फ बीस सेकंड गुनगुना पानी देकर दम तोड़ दिया। बाकी का समय मुझे सीनियर्स से गर्म पानी की बाल्टी मांगने के लिए डिप्लोमैटिक बातचीत में बिताना पड़ा।",
    "हॉस्टल के बाहर एक बंदर मेरी नोटबुक छीनकर छत पर ले गया और वापस देने के बदले बिस्कुट मांगने लगा। जब तक समझौता हुआ, तब तक क्लास समाप्त हो चुकी थी।",
  ],
  TECH: [
    "क्लास से ठीक पहले मैं एक छोटा सा गिट (Git) रीबेस कर रहा था, जो अचानक डिटैच्ड हेड संकट में बदल गया। पूरे प्रोजेक्ट को क्रैश होने से बचाने के चक्कर में मेरा सुबह का लेक्चर छूट गया।",
    "मेरे बैकग्राउंड कोड में एक ऐसा इनफिनिट लूप चला कि लैपटॉप हीटर बन गया और पूरा सिस्टम हैंग हो गया। प्रोसेस किल करते-करते क्लास का समय ही समाप्त हो गया।",
    "मेरा लोकल डेव सर्वर पोर्ट 8080 पर ऐसा अड़ा कि बंद होने का नाम ही नहीं ले रहा था। सिस्टम का ढांचा बचाने के चक्कर में मेरा टाइम टेबल क्रैश हो गया।",
  ],
  PHILOSOPHICAL: [
    "मैं इस विषय के बुनियादी सिद्धांतों पर विचार कर रहा था और मुझे एहसास हुआ कि क्लास जाने से मेरा वेव फंक्शन एक अनतैयार छात्र में बदल जाएगा। श्रोडिंगर के सिद्धांत के अनुसार कमरे में ही रहना ज्यादा सुरक्षित था।",
    "कमरे की एंट्रॉपी अचानक इतनी बढ़ गई कि मेरा दूसरा जूता किसी दूसरे आयाम में गायब हो गया। भौतिकी के नियमों ने मुझे एक पैर में जूते के साथ क्लास जाने की अनुमति नहीं दी।",
    "दरवाजे पर कदम रखते ही मुझे ख्याल आया कि अगर कोई जाग नहीं रहा, तो क्या 8 बजे का लेक्चर वाकई अस्तित्व में होता है? जब तक दर्शनशास्त्र ने जवाब दिया, तब तक घंटी बज चुकी थी।",
  ],
};

export async function generateBunkExcuse(params: GenerateExcuseParams): Promise<ExcuseResult> {
  const { subjectName, persona, apiKey } = params;
  const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (effectiveKey && effectiveKey.trim()) {
    try {
      const prompt = `You are a witty, hilarious excuse generator for an engineering student app called "Bunk-o-Meter".
Write a funny, creative excuse for missing a college class in the subject "${subjectName}".

STRICT RULES FROM SKILL.MD:
1. LANGUAGE: The excuse MUST be written entirely in clean, humorous HINDI (हिन्दी in Devanagari script). Use natural college student humor and slang.
2. MAXIMUM 2 SENTENCES. Keep it crisp, witty, and punchy.
3. Context: ${PERSONA_PROMPTS[persona]}
4. ABSOLUTE GUARDRAIL: NEVER mention any illness, sickness (बीमारी, बुखार, जुकाम, तबीयत खराब), doctor/hospital (डॉक्टर, अस्पताल), medical emergency, death (मौत), funeral, or genuine personal emergencies.
5. Output ONLY the Hindi excuse text. Do not wrap in quotes or add headers.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 150,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (candidateText) {
          const cleanedText = candidateText.replace(/^["'«»]|["'«»]$/g, '').trim();
          return {
            text: cleanedText,
            isAiGenerated: true,
          };
        }
      } else {
        const errorData = await response.json().catch(() => null);
        console.warn('Gemini API call failed, using smart Hindi fallback engine:', errorData);
      }
    } catch (err) {
      console.warn('Network error reaching Gemini API, using smart Hindi fallback engine:', err);
    }
  }

  const list = FALLBACK_EXCUSES[persona];
  const randomIndex = Math.floor(Math.random() * list.length);
  const selected = list[randomIndex];

  return {
    text: selected,
    isAiGenerated: false,
  };
}
