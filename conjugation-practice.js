// KOREAN CONJUGATION PRACTICE MODULE
// Speech recognition-based conjugation trainer

// Conjugation data from the uploaded images
const conjugationData = {
    "Vowel Ending Verbs": [
        // Rule 1 - Vst/Ast ends in vowel
        { base: "읽다", romanization: "ikda", meaning: "to read" },
        { base: "넓다", romanization: "neolda", meaning: "to hang up/to dry out (laundry)" },
        { base: "짚다", romanization: "jipda", meaning: "to pick" },
        { base: "밀다", romanization: "milda", meaning: "to believe" },
        { base: "벗다", romanization: "beotda", meaning: "to wear off" },
        { base: "매다", romanization: "maeda", meaning: "to tie" },
        
        // Rule 2 - Vst ends in vowel ㅏ add ㅏ = 아
        { base: "오다", romanization: "oda", meaning: "to come" },
        
        // Rule 3 - Vst/Ast ends in vowel ㅣ change to ㅕ
        { base: "마시다", romanization: "masida", meaning: "to drink" },
        
        // Rule 4 - Vst/Ast ends in vowel ㅜ add ㅓ = 워
        { base: "두다", romanization: "duda", meaning: "to put" },
        
        // Rule 5 - Vst/Ast ends in vowel Irregular ㅡ
        { base: "고프다", romanization: "kopeuda", meaning: "to be hungry" },
        { base: "기쁘다", romanization: "gippeuda", meaning: "to be please" },
        
        // Rule 6 - Vst/Ast ends in vowel Irregular ㅡ
        { base: "다르다", romanization: "dareuda", meaning: "to be diferent" },
        { base: "흐르다", romanization: "heureuda", meaning: "to flow" },
        
        // Rule 7-8 - Vst/Ast ends in vowel ㅓ/ㅕ add 어
        { base: "서다", romanization: "seoda", meaning: "to spend (time, holiday)/to observe birthday/anniversary" },
        { base: "켜다", romanization: "kyeoda", meaning: "to bend" },
        
        // Rule 9 - Vst/Ast ends in 하다 change to 해
        { base: "산책하다", romanization: "sanchaekhada", meaning: "to take a walk" },
        
        // Rule 11 - Vst/Ast ends in Irregular ㅂ
        { base: "아름답다", romanization: "areumdapda", meaning: "to be beautiful" },
        { base: "시끄럽다", romanization: "siggeuleopda", meaning: "to be noisy" },
        
        // Rule 12 - Vst/Ast ends in Irregular ㄷ change ㄷ to ㄹ and add 어
        { base: "듣다", romanization: "deutda", meaning: "to listen" },
        
        // Rule 13 - Vst/Ast ends Irregular ㅅ
        { base: "짓다", romanization: "jitda", meaning: "to build" }
    ],
    
    "Consonant Ending Verbs": [
        // Formal Present/Future - ㅂ니다
        { base: "가다", romanization: "gada", meaning: "to go" },
        { base: "들다", romanization: "deulda", meaning: "to enter" },
        { base: "높다", romanization: "nopda", meaning: "to be high" },
        { base: "차다", romanization: "chada", meaning: "to kick" },
        { base: "걸다", romanization: "geolda", meaning: "to hang" },
        { base: "붙다", romanization: "butda", meaning: "to unplug" },
        
        // Formal Future and Polite Future
        { base: "자다", romanization: "jada", meaning: "to sleep" },
        { base: "썰다", romanization: "sseolda", meaning: "to chop" },
        { base: "춥다", romanization: "chupda", meaning: "to be cold (Irregular ㅂ)" },
        { base: "좁다", romanization: "jopda", meaning: "to be narrow (Regular ㅂ)" },
        { base: "깊다", romanization: "gipda", meaning: "to be deep" },
        { base: "닫다", romanization: "datda", meaning: "to close (Regular ㄷ)" },
        { base: "싣다", romanization: "sitda", meaning: "to load (Irregular ㄷ)" },
        { base: "빗다", romanization: "bitda", meaning: "to comb (Regular ㅅ)" },
        { base: "잇다", romanization: "itda", meaning: "to connect (Irregular ㅅ)" },
        
        // More verbs
        { base: "먹다", romanization: "meokda", meaning: "to eat" },
        { base: "팔다", romanization: "palda", meaning: "to sell" },
        { base: "미끄럽다", romanization: "mikkeuleopda", meaning: "to be slippery (Irregular ㅂ)" },
        
        // Regular and Irregular verbs
        { base: "입다", romanization: "ipda", meaning: "to wear" },
        { base: "잡다", romanization: "japda", meaning: "to catch/hold" },
        { base: "집다", romanization: "jipda", meaning: "to pick" },
        { base: "좁다", romanization: "jopda", meaning: "to pick" },
        { base: "씹다", romanization: "ssipda", meaning: "to chew/bite" },
        { base: "좁다", romanization: "jopda", meaning: "to narrow" },
        { base: "걷다", romanization: "geotda", meaning: "to gather/collect" },
        { base: "닫다", romanization: "datda", meaning: "to close" },
        { base: "받다", romanization: "batda", meaning: "to receive" },
        { base: "믿다", romanization: "mitda", meaning: "to believe" },
        { base: "굳다", romanization: "gutda", meaning: "to be stiff/hard" },
        { base: "얻다", romanization: "eotda", meaning: "to get/obtain" },
        { base: "쏟다", romanization: "ssotda", meaning: "to spill" },
        { base: "묻다", romanization: "mutda", meaning: "to bury" },
        
        // Irregular verbs from images
        { base: "덥다", romanization: "deopda", meaning: "to be hot [weather]" },
        { base: "춥다", romanization: "chupda", meaning: "to be cold [weather]" },
        { base: "쉽다", romanization: "swipda", meaning: "to be easy" },
        { base: "어렵다", romanization: "eoryeopda", meaning: "to be difficult" },
        { base: "맵다", romanization: "maepda", meaning: "to be spicy" },
        { base: "싱겁다", romanization: "singgeopda", meaning: "to be bland" },
        { base: "가볍다", romanization: "gabyeopda", meaning: "to be light" },
        { base: "무겁다", romanization: "mugeopda", meaning: "to be heavy" },
        { base: "차갑다", romanization: "chagapda", meaning: "to be cold [touch]" },
        { base: "뜨겁다", romanization: "tteugeopda", meaning: "to be hot [touch]" },
        { base: "더럽다", romanization: "deoreopda", meaning: "to be dirty" },
        { base: "어지럽다", romanization: "eojireopda", meaning: "to be dizzy" },
        { base: "시끄럽다", romanization: "siggeuleopda", meaning: "to be noisy" },
        { base: "미끄럽다", romanization: "mikkeuleopda", meaning: "to be slippery" },
        { base: "외롭다", romanization: "oeropda", meaning: "to be lonely" },
        { base: "고맙다", romanization: "gomapda", meaning: "to be thankful" },
        { base: "가깝다", romanization: "gakkapda", meaning: "to be near" },
        { base: "즐겁다", romanization: "jeulgeopda", meaning: "to be enjoyable" },
        { base: "무섭다", romanization: "museopda", meaning: "to be scary" },
        { base: "아름답다", romanization: "areumdapda", meaning: "to be beautiful" },
        { base: "그립다", romanization: "geuripda", meaning: "to miss [person]" },
        { base: "굽다", romanization: "gupda", meaning: "to roast/bake" },
        { base: "돕다", romanization: "dopda", meaning: "to help" },
        { base: "눕다", romanization: "nupda", meaning: "to lie down" },
        { base: "부럽다", romanization: "bureop da", meaning: "to be envious" },
        
        // Irregular ㄹ ending
        { base: "살다", romanization: "salda", meaning: "to live" },
        { base: "팔다", romanization: "palda", meaning: "to sell" },
        { base: "만들다", romanization: "mandeulda", meaning: "to make" },
        { base: "열다", romanization: "yeolda", meaning: "to open" },
        { base: "놀다", romanization: "nolda", meaning: "to play/hang out" },
        { base: "알다", romanization: "alda", meaning: "to know" },
        { base: "울다", romanization: "ulda", meaning: "to cry" },
        { base: "걸다", romanization: "geolda", meaning: "to call/hang" },
        { base: "졸다", romanization: "jolda", meaning: "to doze off/sleepy" },
        { base: "쓸다", romanization: "sseulda", meaning: "to sweep" },
        { base: "풀다", romanization: "pulda", meaning: "to loosen" },
        { base: "널다", romanization: "neolda", meaning: "to hang [laundry]" },
        { base: "갈다", romanization: "galda", meaning: "to sharpen [knife]" },
        { base: "멀다", romanization: "meolda", meaning: "to be far" },
        { base: "달다", romanization: "dalda", meaning: "to be sweet" },
        { base: "길다", romanization: "gilda", meaning: "to be long" },
        { base: "썰다", romanization: "sseolda", meaning: "to chop [thinly/small]" },
        { base: "힘들다", romanization: "himdeulda", meaning: "to be hard [physically]" },
        { base: "밀다", romanization: "milda", meaning: "to push" },
        { base: "끌다", romanization: "kkeulda", meaning: "to pull/drag" },
        { base: "말다", romanization: "malda", meaning: "to roll" },
        { base: "들다", romanization: "deulda", meaning: "to enter/to hold" },
        { base: "물다", romanization: "mulda", meaning: "to bite" },
        { base: "돌다", romanization: "dolda", meaning: "to turn/rotate" },
        
        // Irregular ㅡ ending
        { base: "아프다", romanization: "apeuda", meaning: "to be sick/in pain" },
        { base: "예쁘다", romanization: "yeppeuda", meaning: "to be pretty" },
        { base: "바쁘다", romanization: "bappeuda", meaning: "to be busy" },
        { base: "슬프다", romanization: "seulpeuda", meaning: "to be sad" },
        { base: "고프다", romanization: "gopeuda", meaning: "to be hungry" },
        { base: "크다", romanization: "keuda", meaning: "to be big" },
        { base: "쓰다", romanization: "sseuda", meaning: "to be bitter" },
        { base: "쓰다", romanization: "sseuda", meaning: "to write" },
        { base: "쓰다", romanization: "sseuda", meaning: "to use" },
        { base: "쓰다", romanization: "sseuda", meaning: "to wear [head]" },
        { base: "나쁘다", romanization: "nappeuda", meaning: "to be bad" },
        { base: "기쁘다", romanization: "gippeuda", meaning: "to be please" },
        { base: "잠그다", romanization: "jamgeuda", meaning: "to lock" },
        { base: "끄다", romanization: "kkеuda", meaning: "to turn off" },
        { base: "뜨다", romanization: "tteuda", meaning: "to float" },
        { base: "빠르다", romanization: "ppareuda", meaning: "to be fast" },
        { base: "바르다", romanization: "bareuda", meaning: "to apply on [lotion]" },
        { base: "누르다", romanization: "nureuda", meaning: "to press" },
        { base: "부르다", romanization: "bureuda", meaning: "to call [out]" },
        { base: "오르다", romanization: "oreuda", meaning: "to ascend" },
        { base: "자르다", romanization: "jareuda", meaning: "to cut" },
        { base: "서투르다", romanization: "seotureuda", meaning: "to be clumsy" },
        { base: "다르다", romanization: "dareuda", meaning: "to be different" },
        { base: "노르다", romanization: "noreuda", meaning: "to be surprise/shock" },
        
        // Irregular ㄷ ending
        { base: "걷다", romanization: "geotda", meaning: "to walk" },
        { base: "듣다", romanization: "deutda", meaning: "to listen" },
        { base: "묻다", romanization: "mutda", meaning: "to ask" },
        { base: "싣다", romanization: "sitda", meaning: "to load [vehicles]" },
        { base: "깊다", romanization: "gitda", meaning: "to draw water [well]" },
        { base: "깨닫다", romanization: "kkaedat da", meaning: "to realize" },
        
        // Irregular ㅅ ending
        { base: "낫다", romanization: "natda", meaning: "to recover" },
        { base: "짓다", romanization: "jitda", meaning: "to build" },
        { base: "붓다", romanization: "butda", meaning: "to swell/to pour" },
        { base: "잇다", romanization: "itda", meaning: "to connect or link" },
        { base: "젓다", romanization: "jeotda", meaning: "to stir/whip" },
        { base: "긋다", romanization: "geutda", meaning: "to draw [a line]" },
        
        // More verbs from conjugation rules
        { base: "끝나다", romanization: "kkeutnada", meaning: "to end/finish" },
        { base: "맑다", romanization: "malkda", meaning: "to be clear in weather" },
        { base: "없다", romanization: "eopda", meaning: "to do not have" },
        { base: "갈다", romanization: "galda", meaning: "to sharpen (blade)" },
        { base: "줍다", romanization: "jupda", meaning: "to pick/select" },
        { base: "문다", romanization: "munda", meaning: "to be hard/stiff" },
        { base: "씻다", romanization: "ssitda", meaning: "to wash" },
        { base: "지키다", romanization: "jikida", meaning: "to follow/obey" },
        { base: "빌리다", romanization: "billida", meaning: "to borrow" },
        { base: "피우다", romanization: "piuda", meaning: "to smoke" },
        { base: "나누다", romanization: "nanuda", meaning: "to divide" },
        { base: "바쁘다", romanization: "bappeuda", meaning: "to be busy" },
        { base: "크다", romanization: "keuda", meaning: "to be big" },
        { base: "끄다", romanization: "kkeuda", meaning: "to turn off" },
        { base: "나쁘다", romanization: "nappeuda", meaning: "to be bad" },
        { base: "담그다", romanization: "damgeuda", meaning: "to soak" },
        { base: "빠르다", romanization: "ppareuda", meaning: "to be fast" },
        { base: "오르다", romanization: "oreuda", meaning: "to ascend" },
        { base: "마르다", romanization: "mareuda", meaning: "to be dry" },
        { base: "이르다", romanization: "ireuda", meaning: "to be early" },
        { base: "기르다", romanization: "gireuda", meaning: "to raise/grow" },
        { base: "되다", romanization: "doeda", meaning: "to become/possible/permittable" },
        { base: "쥐다", romanization: "jwida", meaning: "to hold" },
        { base: "뛰다", romanization: "ttwida", meaning: "to run/leap/jump" },
        { base: "마무리하다", romanization: "mamurihada", meaning: "pack up/finishing up" },
        { base: "부지런하다", romanization: "bujireonhada", meaning: "to be diligent" },
        { base: "돌아오다", romanization: "doraoda", meaning: "to come back" },
        { base: "올라오다", romanization: "ollaoda", meaning: "to come up" },
        { base: "싸다", romanization: "ssada", meaning: "to be cheap" },
        { base: "피다", romanization: "pida", meaning: "to spread open" }
    ]
};

// Conjugation rules and patterns
const conjugationRules = {
    // Helper function to get verb stem
    getStem: function(verb) {
        // Remove 다 from the end
        return verb.slice(0, -1);
    },
    
    // Helper function to check last character type
    getLastVowel: function(stem) {
        const lastChar = stem[stem.length - 1];
        const code = lastChar.charCodeAt(0) - 0xAC00;
        const jongseong = code % 28; // Final consonant
        const jungseong = Math.floor((code % 588) / 28); // Vowel
        
        return {
            hasJongseong: jongseong !== 0,
            jungseong: jungseong,
            jongseong: jongseong
        };
    },
    
    // Conjugation patterns for each tense
    conjugate: function(verb, tense) {
        const stem = this.getStem(verb);
        const info = this.getLastVowel(stem);
        
        switch(tense) {
            case 'formal-present':
                return this.formalPresent(stem, info);
            case 'formal-past':
                return this.formalPast(stem, info);
            case 'formal-future':
                return this.formalFuture(stem, info);
            case 'polite-present':
                return this.politePresent(stem, info);
            case 'polite-past':
                return this.politePast(stem, info);
            case 'polite-future':
                return this.politeFuture(stem, info);
            default:
                return stem;
        }
    },
    
    formalPresent: function(stem, info) {
        // ㅂ니다/습니다
        if (info.hasJongseong) {
            return stem + '습니다';
        } else {
            return stem + 'ㅂ니다';
        }
    },
    
    formalPast: function(stem, info) {
        // 았/었/했 + 습니다
        const pastStem = this.getPastStem(stem, info);
        return pastStem + '습니다';
    },
    
    formalFuture: function(stem, info) {
        // ㄹ/을 것입니다
        if (info.hasJongseong) {
            return stem + '을 것입니다';
        } else {
            return stem + 'ㄹ 것입니다';
        }
    },
    
    politePresent: function(stem, info) {
        // 아/어/해요
        return this.getPastStem(stem, info) + '요';
    },
    
    politePast: function(stem, info) {
        // 았/었/했어요
        return this.getPastStem(stem, info) + '어요';
    },
    
    politeFuture: function(stem, info) {
        // ㄹ/을 거예요
        if (info.hasJongseong) {
            return stem + '을 거예요';
        } else {
            return stem + 'ㄹ 거예요';
        }
    },
    
    getPastStem: function(stem, info) {
        // This is simplified - actual Korean conjugation is more complex
        // In a real implementation, you'd need to handle all irregular verbs
        
        // Check for 하다 verbs
        if (stem.endsWith('하')) {
            return stem.slice(0, -1) + '했';
        }
        
        // Check vowel harmony (simplified)
        const lastChar = stem[stem.length - 1];
        const hasPositiveVowel = /[ㅏㅗ]/.test(lastChar);
        
        if (hasPositiveVowel) {
            return stem + '았';
        } else {
            return stem + '었';
        }
    }
};

// Speech recognition setup
let recognition = null;
let currentVerb = null;
let currentTense = null;
let attemptedTenses = new Set();

function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            checkConjugation(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            showError('음성 인식 오류가 발생했습니다. 다시 시도해주세요.');
        };
        
        return true;
    } else {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
        return false;
    }
}

function startConjugationPractice(category) {
    const verbs = conjugationData[category];
    if (!verbs || verbs.length === 0) return;
    
    // Shuffle and pick a random verb
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    currentVerb = randomVerb;
    attemptedTenses = new Set();
    
    displayConjugationCard();
}

function displayConjugationCard() {
    const cardContent = document.querySelector('.card-content');
    
    cardContent.innerHTML = `
        <div class="conjugation-practice">
            <div class="verb-display">
                <h2>${currentVerb.base}</h2>
                <p class="romanization">${currentVerb.romanization}</p>
                <p class="meaning">${currentVerb.meaning}</p>
            </div>
            
            <div class="conjugation-buttons">
                <h3>활용형을 말해보세요:</h3>
                <div class="tense-grid">
                    <button class="tense-btn" data-tense="formal-present">
                        <span class="tense-label">Formal Present</span>
                        <span class="check-mark">✓</span>
                    </button>
                    <button class="tense-btn" data-tense="formal-past">
                        <span class="tense-label">Formal Past</span>
                        <span class="check-mark">✓</span>
                    </button>
                    <button class="tense-btn" data-tense="formal-future">
                        <span class="tense-label">Formal Future</span>
                        <span class="check-mark">✓</span>
                    </button>
                    <button class="tense-btn" data-tense="polite-present">
                        <span class="tense-label">Polite Present</span>
                        <span class="check-mark">✓</span>
                    </button>
                    <button class="tense-btn" data-tense="polite-past">
                        <span class="tense-label">Polite Past</span>
                        <span class="check-mark">✓</span>
                    </button>
                    <button class="tense-btn" data-tense="polite-future">
                        <span class="tense-label">Polite Future</span>
                        <span class="check-mark">✓</span>
                    </button>
                </div>
            </div>
            
            <div id="feedback-area" class="feedback-area"></div>
            
            <div class="action-buttons">
                <button id="next-verb-btn" class="next-verb-btn">Next Verb →</button>
            </div>
        </div>
    `;
    
    // Add event listeners to tense buttons
    document.querySelectorAll('.tense-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tense = this.getAttribute('data-tense');
            startRecording(tense);
        });
    });
    
    // Add event listener to next verb button
    document.getElementById('next-verb-btn').addEventListener('click', function() {
        const category = currentVerb.base.endsWith('다') ? 
            (conjugationData["Vowel Ending Verbs"].includes(currentVerb) ? 
                "Vowel Ending Verbs" : "Consonant Ending Verbs") : 
            "Vowel Ending Verbs";
        startConjugationPractice(category);
    });
}

function startRecording(tense) {
    if (!recognition) {
        if (!initSpeechRecognition()) return;
    }
    
    currentTense = tense;
    
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.innerHTML = `
        <div class="recording-indicator">
            <div class="pulse"></div>
            <p>🎤 말하고 있습니다...</p>
        </div>
    `;
    
    try {
        recognition.start();
    } catch (e) {
        console.error('Recognition start error:', e);
    }
}

function checkConjugation(spokenText) {
    const correctAnswer = conjugationRules.conjugate(currentVerb.base, currentTense);
    const normalized = spokenText.trim().replace(/\s+/g, '');
    const normalizedCorrect = correctAnswer.trim().replace(/\s+/g, '');
    
    const feedbackArea = document.getElementById('feedback-area');
    
    if (normalized === normalizedCorrect || spokenText.includes(correctAnswer)) {
        // Correct!
        attemptedTenses.add(currentTense);
        const btn = document.querySelector(`[data-tense="${currentTense}"]`);
        btn.classList.add('correct');
        
        feedbackArea.innerHTML = `
            <div class="feedback correct-feedback">
                <h3>✅ 정답입니다!</h3>
                <p><strong>당신의 답변:</strong> ${spokenText}</p>
                <p><strong>정답:</strong> ${correctAnswer}</p>
            </div>
        `;
        
        // Speak the correct answer
        speakKorean(correctAnswer);
    } else {
        // Incorrect
        feedbackArea.innerHTML = `
            <div class="feedback incorrect-feedback">
                <h3>❌ 다시 시도해보세요</h3>
                <p><strong>당신의 답변:</strong> ${spokenText}</p>
                <p><strong>정답:</strong> ${correctAnswer}</p>
                <button class="try-again-btn" onclick="startRecording('${currentTense}')">
                    🔄 다시 시도
                </button>
            </div>
        `;
    }
}

function showError(message) {
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.innerHTML = `
        <div class="feedback error-feedback">
            <p>⚠️ ${message}</p>
        </div>
    `;
}

// Export functions for use in main script
window.conjugationPractice = {
    init: initSpeechRecognition,
    start: startConjugationPractice,
    data: conjugationData
};