// MAIN JAVASCRIPT FILE - Controls all the flashcard behavior

// VARIABLES TO TRACK STATE
let currentCategory = null; // Which category is selected
let currentCards = []; // Array of cards in current category
let currentCardIndex = 0; // Which card we're on (starts at 0)
let isFlipped = false; // Is the card showing the back?

// GET REFERENCES TO HTML ELEMENTS
const categoryContainer = document.getElementById('category-container');
const categoryButtonsDiv = document.getElementById('category-buttons');
const flashcardArea = document.getElementById('flashcard-area');
const flashcard = document.getElementById('flashcard');
const cardContent = flashcard.querySelector('.card-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const cardCounter = document.getElementById('card-counter');
const backToCategoriesBtn = document.getElementById('back-to-categories');

// KOREAN NUMBER CONVERTERS

// Sino-Korean numbers (일, 이, 삼, 사...)
const sinoKoreanDigits = {
    0: '', 1: '일', 2: '이', 3: '삼', 4: '사',
    5: '오', 6: '육', 7: '칠', 8: '팔', 9: '구'
};

const sinoKoreanDigitsRoman = {
    0: '', 1: 'il', 2: 'i', 3: 'sam', 4: 'sa',
    5: 'o', 6: 'yuk', 7: 'chil', 8: 'pal', 9: 'gu'
};

// Native Korean numbers (하나, 둘, 셋...)
const nativeKoreanNumbers = {
    1: { korean: '하나', roman: 'hana' },
    2: { korean: '둘', roman: 'dul' },
    3: { korean: '셋', roman: 'set' },
    4: { korean: '넷', roman: 'net' },
    5: { korean: '다섯', roman: 'daseot' },
    6: { korean: '여섯', roman: 'yeoseot' },
    7: { korean: '일곱', roman: 'ilgop' },
    8: { korean: '여덟', roman: 'yeodeol' },
    9: { korean: '아홉', roman: 'ahop' },
    10: { korean: '열', roman: 'yeol' },
    11: { korean: '열하나', roman: 'yeol-hana' },
    12: { korean: '열둘', roman: 'yeol-dul' },
    13: { korean: '열셋', roman: 'yeol-set' },
    14: { korean: '열넷', roman: 'yeol-net' },
    15: { korean: '열다섯', roman: 'yeol-daseot' },
    16: { korean: '열여섯', roman: 'yeol-yeoseot' },
    17: { korean: '열일곱', roman: 'yeol-ilgop' },
    18: { korean: '열여덟', roman: 'yeol-yeodeol' },
    19: { korean: '열아홉', roman: 'yeol-ahop' },
    20: { korean: '스물', roman: 'seumul' }
};

// Sino-Korean numbers for hours (0-23) and minutes
// Hours use Sino-Korean: 0시, 1시, 2시... 23시
// Minutes use Sino-Korean: 0분, 5분, 10분... 55분

function numberToSinoKoreanHour(hour) {
    const korean = [];
    const roman = [];

    if (hour === 0) {
        korean.push('공');
        roman.push('gong');
    } else if (hour >= 10) {
        const tens = Math.floor(hour / 10);
        const ones = hour % 10;
        if (tens === 1) {
            korean.push('십');
            roman.push('sip');
        } else {
            korean.push(sinoKoreanDigits[tens] + '십');
            roman.push(sinoKoreanDigitsRoman[tens] + 'sip');
        }
        if (ones > 0) {
            korean.push(sinoKoreanDigits[ones]);
            roman.push(sinoKoreanDigitsRoman[ones]);
        }
    } else {
        korean.push(sinoKoreanDigits[hour]);
        roman.push(sinoKoreanDigitsRoman[hour]);
    }

    korean.push('시');
    roman.push('si');

    return { korean: korean.join(''), roman: roman.join(' ') };
}

function numberToSinoKoreanMinute(minute) {
    const korean = [];
    const roman = [];

    if (minute === 0) {
        return { korean: '', roman: '' };
    } else if (minute >= 10) {
        const tens = Math.floor(minute / 10);
        const ones = minute % 10;
        if (tens === 1) {
            korean.push('십');
            roman.push('sip');
        } else {
            korean.push(sinoKoreanDigits[tens] + '십');
            roman.push(sinoKoreanDigitsRoman[tens] + 'sip');
        }
        if (ones > 0) {
            korean.push(sinoKoreanDigits[ones]);
            roman.push(sinoKoreanDigitsRoman[ones]);
        }
    } else {
        korean.push(sinoKoreanDigits[minute]);
        roman.push(sinoKoreanDigitsRoman[minute]);
    }

    korean.push('분');
    roman.push('bun');

    return { korean: korean.join(''), roman: roman.join(' ') };
}

// Convert number to Sino-Korean for prices
function numberToSinoKoreanPrice(num) {
    const korean = [];
    const roman = [];
    
    // Handle ten thousands (만)
    const manValue = Math.floor(num / 10000);
    if (manValue > 0) {
        // Only process the digits if manValue > 1
        if (manValue > 1) {
            const thousands = Math.floor(manValue / 1000);
            const hundreds = Math.floor((manValue % 1000) / 100);
            const tens = Math.floor((manValue % 100) / 10);
            const ones = manValue % 10;
            
            if (thousands > 0) {
                if (thousands > 1) {
                    korean.push(sinoKoreanDigits[thousands] + '천');
                    roman.push(sinoKoreanDigitsRoman[thousands] + 'cheon');
                } else {
                    korean.push('천');
                    roman.push('cheon');
                }
            }
            if (hundreds > 0) {
                if (hundreds > 1) {
                    korean.push(sinoKoreanDigits[hundreds] + '백');
                    roman.push(sinoKoreanDigitsRoman[hundreds] + 'baek');
                } else {
                    korean.push('백');
                    roman.push('baek');
                }
            }
            if (tens > 0) {
                korean.push(sinoKoreanDigits[tens] + '십');
                roman.push(sinoKoreanDigitsRoman[tens] + 'sip');
            }
            if (ones > 0) {
                korean.push(sinoKoreanDigits[ones]);
                roman.push(sinoKoreanDigitsRoman[ones]);
            }
        }
        
        korean.push('만');
        roman.push('man');
    }
    
    // Handle thousands
    const remainder = num % 10000;
    const thousands = Math.floor(remainder / 1000);
    if (thousands > 0) {
        if (thousands > 1) {
            korean.push(sinoKoreanDigits[thousands] + '천');
            roman.push(sinoKoreanDigitsRoman[thousands] + 'cheon');
        } else {
            korean.push('천');
            roman.push('cheon');
        }
    }
    
    // Handle hundreds
    const hundreds = Math.floor((remainder % 1000) / 100);
    if (hundreds > 0) {
        if (hundreds > 1) {
            korean.push(sinoKoreanDigits[hundreds] + '백');
            roman.push(sinoKoreanDigitsRoman[hundreds] + 'baek');
        } else {
            korean.push('백');
            roman.push('baek');
        }
    }
    
    // Add 원 (won)
    korean.push('원');
    roman.push('won');
    
    return {
        korean: korean.join(''),
        roman: roman.join(' ')
    };
}

// Convert date to Sino-Korean (month and day only)
function dateToSinoKoreanMonthDay(month, day) {
    const korean = [];
    const roman = [];
    
    // Month
    if (month >= 10) {
        if (month === 10) {
            korean.push('십');
            roman.push('sip');
        } else {
            korean.push('십' + sinoKoreanDigits[month % 10]);
            roman.push('sip' + sinoKoreanDigitsRoman[month % 10]);
        }
    } else {
        korean.push(sinoKoreanDigits[month]);
        roman.push(sinoKoreanDigitsRoman[month]);
    }
    korean.push('월');
    roman.push('wol');
    
    // Day
    if (day >= 20) {
        korean.push(sinoKoreanDigits[Math.floor(day / 10)] + '십');
        roman.push(sinoKoreanDigitsRoman[Math.floor(day / 10)] + 'sip');
        if (day % 10 > 0) {
            korean.push(sinoKoreanDigits[day % 10]);
            roman.push(sinoKoreanDigitsRoman[day % 10]);
        }
    } else if (day >= 10) {
        korean.push('십');
        roman.push('sip');
        if (day % 10 > 0) {
            korean.push(sinoKoreanDigits[day % 10]);
            roman.push(sinoKoreanDigitsRoman[day % 10]);
        }
    } else {
        korean.push(sinoKoreanDigits[day]);
        roman.push(sinoKoreanDigitsRoman[day]);
    }
    korean.push('일');
    roman.push('il');
    
    return {
        korean: korean.join(''),
        roman: roman.join(' ')
    };
}

// Convert phone number to Korean
function phoneNumberToKorean(phoneNumber) {
    const korean = [];
    const roman = [];
    
    // Split into parts: 010-XXXX-XXXX
    const parts = phoneNumber.split('-');
    
    for (let partIndex = 0; partIndex < parts.length; partIndex++) {
        const part = parts[partIndex];
        
        for (let i = 0; i < part.length; i++) {
            const digit = parseInt(part[i]);
            
            if (digit === 0) {
                korean.push('공');
                roman.push('gong');
            } else {
                korean.push(sinoKoreanDigits[digit]);
                roman.push(sinoKoreanDigitsRoman[digit]);
            }
        }
        
        // Add separator between parts
        if (partIndex < parts.length - 1) {
            korean.push('-');
            roman.push('-');
        }
    }
    
    return {
        korean: korean.join(''),
        roman: roman.join(' ')
    };
}

// GENERATE RANDOM NUMBER CARDS

function generatePriceCards(count = 50) {
    const cards = [];
    for (let i = 0; i < count; i++) {
        // Generate random price between 1000-99900, ending in 00
        const price = (Math.floor(Math.random() * 990) + 10) * 100;
        const converted = numberToSinoKoreanPrice(price);
        
        cards.push({
            korean: price.toLocaleString() + '원',
            romanization: converted.roman,
            meaning: `₩${price.toLocaleString()}`,
            spokenKorean: converted.korean
        });
    }
    return cards;
}

function generateDateCards(count = 50) {
    const cards = [];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    for (let i = 0; i < count; i++) {
        const month = Math.floor(Math.random() * 12) + 1; // 1-12
        
        // Use current year for leap year calculation
        const year = 2024;
        let maxDay = daysInMonth[month - 1];
        if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
            maxDay = 29;
        }
        
        const day = Math.floor(Math.random() * maxDay) + 1; // 1-maxDay
        
        const converted = dateToSinoKoreanMonthDay(month, day);
        
        cards.push({
            korean: `${month}월 ${day}일`,
            romanization: converted.roman,
            meaning: `${month}/${day}`,
            spokenKorean: converted.korean
        });
    }
    return cards;
}

function generateNativeNumberCards(count = 20) {
    const cards = [];
    for (let i = 1; i <= 20; i++) {
        const num = nativeKoreanNumbers[i];
        cards.push({
            korean: i.toString(),
            romanization: num.roman,
            meaning: `Number ${i}`,
            spokenKorean: num.korean
        });
    }
    return shuffleArray(cards);
}

function generatePhoneNumberCards(count = 50) {
    const cards = [];
    
    for (let i = 0; i < count; i++) {
        // Generate Korean phone number: 010-XXXX-XXXX
        const part2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const part3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const phoneNumber = `010-${part2}-${part3}`;
        
        const converted = phoneNumberToKorean(phoneNumber);
        
        cards.push({
            korean: phoneNumber,
            romanization: converted.roman,
            meaning: 'Phone Number',
            spokenKorean: converted.korean
        });
    }
    return cards;
}

function generateTellingTimeCards() {
    const cards = [];
    const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    for (let hour24 = 0; hour24 <= 23; hour24++) {
        for (let m = 0; m < minuteOptions.length; m++) {
            const minute = minuteOptions[m];

            const isPM = hour24 >= 12;
            const periodKorean = isPM ? '오후' : '오전';
            const periodRoman = isPM ? 'ohu' : 'ojeon';

            let hour12 = hour24 % 12;
            if (hour12 === 0) hour12 = 12;

            // Native Korean numbers change form before counters like 시
            const nativeHourForms = {
                1:  { korean: '한',   roman: 'han' },
                2:  { korean: '두',   roman: 'du' },
                3:  { korean: '세',   roman: 'se' },
                4:  { korean: '네',   roman: 'ne' },
                5:  { korean: '다섯', roman: 'daseot' },
                6:  { korean: '여섯', roman: 'yeoseot' },
                7:  { korean: '일곱', roman: 'ilgop' },
                8:  { korean: '여덟', roman: 'yeodeol' },
                9:  { korean: '아홉', roman: 'ahop' },
                10: { korean: '열',   roman: 'yeol' },
                11: { korean: '열한', roman: 'yeol-han' },
                12: { korean: '열두', roman: 'yeol-du' }
            };
            const hourNative = nativeHourForms[hour12];
            const hourConverted = { korean: hourNative.korean + '시', roman: hourNative.roman + ' si' };
            const minuteConverted = numberToSinoKoreanMinute(minute);

            const displayTime = periodKorean + ' ' + hour12 + ':' + minute.toString().padStart(2, '0');
            const spokenKorean = (periodKorean + ' ' + hourConverted.korean + (minuteConverted.korean ? ' ' + minuteConverted.korean : '')).trim();
            const romanization = (periodRoman + ' ' + hourConverted.roman + (minuteConverted.roman ? ' ' + minuteConverted.roman : '')).trim();

            cards.push({
                korean: displayTime,
                romanization: romanization,
                meaning: (isPM ? 'PM' : 'AM') + ' ' + hour12 + ':' + minute.toString().padStart(2, '0'),
                spokenKorean: spokenKorean
            });
        }
    }
    return shuffleArray(cards);
}

// SHUFFLE FUNCTION - Randomizes an array
function shuffleArray(array) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

// STEP 1: CREATE CATEGORY BUTTONS WHEN PAGE LOADS
function createCategoryButtons() {
    // Add conjugation practice categories
    const conjugationCategories = [
        "Conjugation Practice - Vowel Ending",
        "Conjugation Practice - Consonant Ending"
    ];
    
    // Add conjugation practice buttons first
    conjugationCategories.forEach(categoryName => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = categoryName;
        button.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        
        button.addEventListener('click', function() {
            loadCategory(categoryName);
        });
        
        categoryButtonsDiv.appendChild(button);
    });
    
    // Add all other categories
    for (let categoryName in flashcardData) {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = categoryName;
        
        button.addEventListener('click', function() {
            loadCategory(categoryName);
        });
        
        categoryButtonsDiv.appendChild(button);
    }
}

// STEP 2: LOAD A CATEGORY
function loadCategory(categoryName) {
    currentCategory = categoryName;
    
    // Check if this is a conjugation practice category
    if (categoryName === "Conjugation Practice - Vowel Ending" || 
        categoryName === "Conjugation Practice - Consonant Ending") {
        
        categoryContainer.classList.add('hidden');
        flashcardArea.classList.remove('hidden');
        
        // Hide navigation buttons for conjugation practice
        document.querySelector('.navigation').style.display = 'none';
        
        // Make flashcard non-clickable for conjugation practice
        flashcard.style.cursor = 'default';
        flashcard.onclick = null;
        
        // Start conjugation practice
        const verbCategory = categoryName === "Conjugation Practice - Vowel Ending" ? 
            "Vowel Ending Verbs" : "Consonant Ending Verbs";
        
        if (window.conjugationPractice) {
            window.conjugationPractice.init();
            window.conjugationPractice.start(verbCategory);
        }
        
        return;
    }
    
    // Show navigation for regular flashcards
    document.querySelector('.navigation').style.display = 'flex';
    
    // Make flashcard clickable for regular practice
    flashcard.style.cursor = 'pointer';
    flashcard.onclick = function() {
        isFlipped = !isFlipped;
        displayCard();
    };
    
    // Check if this is a number practice category
    if (categoryName === "Numbers Practice - Prices (Sino-Korean)") {
        currentCards = generatePriceCards();
    } else if (categoryName === "Numbers Practice - Dates (Sino-Korean)") {
        currentCards = generateDateCards();
    } else if (categoryName === "Numbers Practice - Native Korean (1-20)") {
        currentCards = generateNativeNumberCards();
    } else if (categoryName === "Numbers Practice - Phone Numbers") {
        currentCards = generatePhoneNumberCards();
    } else if (categoryName === "Telling Time (12hr)") {
        currentCards = generateTellingTimeCards();
    } else if (categoryName === "Counter Units (Native)" || categoryName === "Counter Units (Sino)") {
        // Regular category - shuffle the cards
        currentCards = shuffleArray(flashcardData[categoryName]);
    } else {
        // Regular category - shuffle the cards
        currentCards = shuffleArray(flashcardData[categoryName]);
    }
    
    currentCardIndex = 0;
    isFlipped = false;
    
    categoryContainer.classList.add('hidden');
    flashcardArea.classList.remove('hidden');
    
    displayCard();
}

// STEP 3: DISPLAY A CARD
function displayCard() {
    const card = currentCards[currentCardIndex];
    
    if (isFlipped) {
        // Show BACK of card
        const spokenText = card.spokenKorean || card.korean;
        
        cardContent.innerHTML = `
            <div class="card-back">
                <div class="korean">${spokenText}</div>
                <div class="romanization">${card.romanization}</div>
                <div class="meaning">${card.meaning}</div>
            </div>
        `;
        
        // Speak the Korean text
        speakKorean(spokenText);
    } else {
        // Show FRONT of card
        cardContent.innerHTML = `
            <div class="card-front">${card.korean}</div>
        `;
    }
    
    cardCounter.textContent = `${currentCardIndex + 1} / ${currentCards.length}`;
    updateNavigationButtons();
}

// SPEECH SYNTHESIS FUNCTION
function speakKorean(text) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8; // Slightly slower for learning
    
    window.speechSynthesis.speak(utterance);
}

// STEP 4: UPDATE NAVIGATION BUTTONS
function updateNavigationButtons() {
    if (currentCardIndex === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    
    if (currentCardIndex === currentCards.length - 1) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

// STEP 5: FLIP CARD (when clicked) - Handled in loadCategory now

// STEP 6: PREVIOUS BUTTON
prevBtn.addEventListener('click', function() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        isFlipped = false;
        displayCard();
    }
});

// STEP 7: NEXT BUTTON
nextBtn.addEventListener('click', function() {
    if (currentCardIndex < currentCards.length - 1) {
        currentCardIndex++;
        isFlipped = false;
        displayCard();
    }
});

// STEP 8: BACK TO CATEGORIES BUTTON
backToCategoriesBtn.addEventListener('click', function() {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    flashcardArea.classList.add('hidden');
    categoryContainer.classList.remove('hidden');
    
    currentCategory = null;
    currentCards = [];
    currentCardIndex = 0;
    isFlipped = false;
    
    // Reset navigation display
    document.querySelector('.navigation').style.display = 'flex';
    flashcard.style.cursor = 'pointer';
});

// RUN THIS WHEN PAGE LOADS
createCategoryButtons();