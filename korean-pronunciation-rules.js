// KOREAN PRONUNCIATION RULES ENGINE
// Implements all major Korean phonological rules (음운 변화)

class KoreanPronunciation {
    constructor() {
        // Hangul decomposition constants
        this.HANGUL_BASE = 0xAC00;
        this.JONGSEONG_COUNT = 28;
        this.JUNGSEONG_COUNT = 21;
        
        // Jamo mappings
        this.CHOSEONG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        this.JUNGSEONG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
        this.JONGSEONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        
        // Sound categories
        this.PLOSIVES = ['ㄱ', 'ㄷ', 'ㅂ', 'ㄲ', 'ㄸ', 'ㅃ', 'ㅋ', 'ㅌ', 'ㅍ'];
        this.NASALS = ['ㄴ', 'ㅁ', 'ㅇ'];
        this.LIQUIDS = ['ㄹ'];
        this.OBSTRUENTS = ['ㄱ', 'ㄷ', 'ㅂ', 'ㅈ', 'ㅅ', 'ㅆ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        
        // Tensification triggers
        this.TENSIFICATION_TRIGGERS = ['ㄱ', 'ㄷ', 'ㅂ', 'ㅅ', 'ㅈ'];
        this.TENSIFIED = {
            'ㄱ': 'ㄲ', 'ㄷ': 'ㄸ', 'ㅂ': 'ㅃ', 'ㅅ': 'ㅆ', 'ㅈ': 'ㅉ'
        };
        
        // Nasalization mappings
        this.TO_NASAL = {
            'ㄱ': 'ㅇ', 'ㄷ': 'ㄴ', 'ㅂ': 'ㅁ',
            'ㅋ': 'ㅇ', 'ㅌ': 'ㄴ', 'ㅍ': 'ㅁ',
            'ㄲ': 'ㅇ', 'ㄸ': 'ㄴ', 'ㅃ': 'ㅁ',
            'ㅅ': 'ㄴ', 'ㅆ': 'ㄴ', 'ㅈ': 'ㄴ', 'ㅊ': 'ㄴ', 'ㅎ': 'ㄴ'
        };
        
        // Final consonant simplification (음절 말 자음군 단순화)
        this.COMPLEX_JONGSEONG_SIMPLIFICATION = {
            'ㄳ': 'ㄱ', 'ㄵ': 'ㄴ', 'ㄶ': 'ㄴ', 'ㄺ': 'ㄱ', 'ㄻ': 'ㅁ',
            'ㄼ': 'ㄹ', 'ㄽ': 'ㄹ', 'ㄾ': 'ㄹ', 'ㄿ': 'ㅂ', 'ㅀ': 'ㄹ', 'ㅄ': 'ㅂ'
        };
        
        // Before ㄴ, ㅁ exceptions
        this.COMPLEX_BEFORE_NASAL = {
            'ㄳ': 'ㅇ', 'ㄺ': 'ㅇ', 'ㄼ': 'ㅁ', 'ㄽ': 'ㄴ', 
            'ㄾ': 'ㄴ', 'ㄿ': 'ㅁ', 'ㅀ': 'ㄴ', 'ㅄ': 'ㅁ'
        };
        
        // Aspiration (격음화)
        this.ASPIRATION_MAP = {
            'ㄱㅎ': 'ㅋ', 'ㄷㅎ': 'ㅌ', 'ㅂㅎ': 'ㅍ', 'ㅈㅎ': 'ㅊ',
            'ㅎㄱ': 'ㅋ', 'ㅎㄷ': 'ㅌ', 'ㅎㅂ': 'ㅍ', 'ㅎㅈ': 'ㅊ'
        };
    }
    
    // Decompose Hangul syllable into jamo
    decompose(syllable) {
        if (!syllable || syllable.length !== 1) return null;
        
        const code = syllable.charCodeAt(0);
        if (code < this.HANGUL_BASE || code > 0xD7A3) return null;
        
        const index = code - this.HANGUL_BASE;
        const choseongIndex = Math.floor(index / (this.JUNGSEONG_COUNT * this.JONGSEONG_COUNT));
        const jungseongIndex = Math.floor((index % (this.JUNGSEONG_COUNT * this.JONGSEONG_COUNT)) / this.JONGSEONG_COUNT);
        const jongseongIndex = index % this.JONGSEONG_COUNT;
        
        return {
            choseong: this.CHOSEONG[choseongIndex],
            jungseong: this.JUNGSEONG[jungseongIndex],
            jongseong: this.JONGSEONG[jongseongIndex],
            hasJongseong: jongseongIndex !== 0
        };
    }
    
    // Compose jamo back into Hangul syllable
    compose(choseong, jungseong, jongseong = '') {
        const choseongIndex = this.CHOSEONG.indexOf(choseong);
        const jungseongIndex = this.JUNGSEONG.indexOf(jungseong);
        const jongseongIndex = this.JONGSEONG.indexOf(jongseong);
        
        if (choseongIndex === -1 || jungseongIndex === -1 || jongseongIndex === -1) {
            return null;
        }
        
        const code = this.HANGUL_BASE + 
                     (choseongIndex * this.JUNGSEONG_COUNT * this.JONGSEONG_COUNT) +
                     (jungseongIndex * this.JONGSEONG_COUNT) +
                     jongseongIndex;
        
        return String.fromCharCode(code);
    }
    
    // Main pronunciation conversion function
    getPronunciation(text) {
        // Remove spaces for processing
        let working = text.replace(/\s+/g, '');
        
        // Apply rules in order (order matters!)
        working = this.applyComplexJongseongSimplification(working);
        working = this.applyLiaisonRule(working);
        working = this.applyAspirationRule(working);
        working = this.applyNasalizationRule(working);
        working = this.applyLiquidNasalizationRule(working);
        working = this.applyPalatalizationRule(working);
        working = this.applyTensificationRule(working);
        working = this.applyHDeletionRule(working);
        
        return working;
    }
    
    // Rule 1: Complex jongseong simplification (받침 단순화)
    applyComplexJongseongSimplification(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            if (!current) {
                result += text[i];
                continue;
            }
            
            let jongseong = current.jongseong;
            
            // Check if next syllable starts with a nasal
            if (i < text.length - 1) {
                const next = this.decompose(text[i + 1]);
                if (next && this.NASALS.includes(next.choseong)) {
                    // Special handling before nasals
                    if (this.COMPLEX_BEFORE_NASAL[jongseong]) {
                        jongseong = this.COMPLEX_BEFORE_NASAL[jongseong];
                    }
                }
            }
            
            // General simplification for complex jongseong
            if (this.COMPLEX_JONGSEONG_SIMPLIFICATION[jongseong] && !this.NASALS.includes(jongseong)) {
                const nextChar = text[i + 1];
                const next = this.decompose(nextChar);
                
                // If next is vowel-initial, might need different handling
                if (!next || next.choseong !== 'ㅇ') {
                    if (!this.COMPLEX_BEFORE_NASAL[jongseong] || !next || !this.NASALS.includes(next.choseong)) {
                        jongseong = this.COMPLEX_JONGSEONG_SIMPLIFICATION[jongseong];
                    }
                }
            }
            
            result += this.compose(current.choseong, current.jungseong, jongseong);
        }
        
        return result;
    }
    
    // Rule 2: Liaison (연음 법칙)
    applyLiaisonRule(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            
            if (!current) {
                result += text[i];
                continue;
            }
            
            // Check if next syllable starts with ㅇ (vowel-initial)
            if (i < text.length - 1 && current.hasJongseong) {
                const next = this.decompose(text[i + 1]);
                
                if (next && next.choseong === 'ㅇ') {
                    // Move jongseong to next syllable's choseong
                    let transferredConsonant = current.jongseong;
                    
                    // Handle complex jongseong in liaison
                    const complexToTransfer = {
                        'ㄳ': 'ㅅ', 'ㄵ': 'ㅈ', 'ㄶ': 'ㄴ', 'ㄺ': 'ㄱ', 'ㄻ': 'ㅁ',
                        'ㄼ': 'ㅂ', 'ㄽ': 'ㄹ', 'ㄾ': 'ㄹ', 'ㄿ': 'ㅂ', 'ㅀ': 'ㄹ', 'ㅄ': 'ㅂ'
                    };
                    
                    let remainingJongseong = '';
                    
                    if (complexToTransfer[transferredConsonant]) {
                        // For complex jongseong, split appropriately
                        if (transferredConsonant === 'ㄳ') {
                            remainingJongseong = 'ㄱ';
                            transferredConsonant = 'ㅅ';
                        } else if (transferredConsonant === 'ㄵ') {
                            remainingJongseong = 'ㄴ';
                            transferredConsonant = 'ㅈ';
                        } else if (transferredConsonant === 'ㄶ') {
                            remainingJongseong = 'ㄴ';
                            transferredConsonant = 'ㅎ';
                        } else if (transferredConsonant === 'ㄺ') {
                            remainingJongseong = 'ㄹ';
                            transferredConsonant = 'ㄱ';
                        } else if (transferredConsonant === 'ㄻ') {
                            remainingJongseong = 'ㄹ';
                            transferredConsonant = 'ㅁ';
                        } else if (transferredConsonant === 'ㄼ') {
                            remainingJongseong = 'ㄹ';
                            transferredConsonant = 'ㅂ';
                        } else if (transferredConsonant === 'ㄽ') {
                            remainingJongseong = 'ㄹ';
                            transferredConsonant = 'ㅅ';
                        } else if (transferredConsonant === 'ㄾ') {
                            remainingJongseong = 'ㄹ';
                            transferredConsonant = 'ㅌ';
                        } else if (transferredConsonant === 'ㄿ') {
                            remainingJongseong = 'ㄹ';
                            transferredConsonant = 'ㅍ';
                        } else if (transferredConsonant === 'ㅀ') {
                            remainingJongseong = 'ㄹ';
                            transferredConsonant = 'ㅎ';
                        } else if (transferredConsonant === 'ㅄ') {
                            remainingJongseong = 'ㅂ';
                            transferredConsonant = 'ㅅ';
                        }
                        
                        result += this.compose(current.choseong, current.jungseong, remainingJongseong);
                    } else {
                        // Simple jongseong transfer
                        result += this.compose(current.choseong, current.jungseong, '');
                    }
                    
                    // Add modified next syllable
                    const nextModified = this.compose(transferredConsonant, next.jungseong, next.jongseong);
                    result += nextModified;
                    i++; // Skip next syllable as we've processed it
                    continue;
                }
            }
            
            result += text[i];
        }
        
        return result;
    }
    
    // Rule 3: Nasalization (비음화)
    applyNasalizationRule(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            
            if (!current) {
                result += text[i];
                continue;
            }
            
            // Check if jongseong is followed by a nasal
            if (i < text.length - 1 && current.hasJongseong) {
                const next = this.decompose(text[i + 1]);
                
                if (next && this.NASALS.includes(next.choseong)) {
                    let jongseong = current.jongseong;
                    
                    // Convert plosive to nasal
                    if (this.TO_NASAL[jongseong]) {
                        jongseong = this.TO_NASAL[jongseong];
                        result += this.compose(current.choseong, current.jungseong, jongseong);
                        continue;
                    }
                }
            }
            
            result += text[i];
        }
        
        return result;
    }
    
    // Rule 4: Liquid nasalization (ㄹ의 비음화)
    applyLiquidNasalizationRule(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            
            if (!current) {
                result += text[i];
                continue;
            }
            
            // ㄴ + ㄹ → ㄹ + ㄹ
            if (current.choseong === 'ㄹ' && i > 0) {
                const prev = this.decompose(text[i - 1]);
                if (prev && prev.jongseong === 'ㄴ') {
                    // Change previous ㄴ to ㄹ
                    const modified = this.compose(prev.choseong, prev.jungseong, 'ㄹ');
                    result = result.slice(0, -1) + modified;
                }
            }
            
            // ㄹ + ㄴ → ㄹ + ㄹ
            if (current.jongseong === 'ㄹ' && i < text.length - 1) {
                const next = this.decompose(text[i + 1]);
                if (next && next.choseong === 'ㄴ') {
                    result += text[i];
                    const modified = this.compose('ㄹ', next.jungseong, next.jongseong);
                    result += modified;
                    i++; // Skip next
                    continue;
                }
            }
            
            result += text[i];
        }
        
        return result;
    }
    
    // Rule 5: Palatalization (구개음화)
    applyPalatalizationRule(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            
            if (!current) {
                result += text[i];
                continue;
            }
            
            // ㄷ, ㅌ + 이 → ㅈ, ㅊ
            if (i < text.length - 1 && (current.jongseong === 'ㄷ' || current.jongseong === 'ㅌ')) {
                const next = this.decompose(text[i + 1]);
                
                if (next && next.jungseong === 'ㅣ') {
                    // Create liaison with palatalization
                    const newChoseong = current.jongseong === 'ㄷ' ? 'ㅈ' : 'ㅊ';
                    result += this.compose(current.choseong, current.jungseong, '');
                    result += this.compose(newChoseong, next.jungseong, next.jongseong);
                    i++; // Skip next
                    continue;
                }
            }
            
            result += text[i];
        }
        
        return result;
    }
    
    // Rule 6: Tensification (경음화)
    applyTensificationRule(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            
            if (!current) {
                result += text[i];
                continue;
            }
            
            // Check if preceded by a tensification trigger
            if (i > 0) {
                const prev = this.decompose(text[i - 1]);
                
                if (prev && prev.hasJongseong && this.TENSIFICATION_TRIGGERS.includes(prev.jongseong)) {
                    // Tensify current choseong if possible
                    if (this.TENSIFIED[current.choseong]) {
                        const tensified = this.compose(
                            this.TENSIFIED[current.choseong],
                            current.jungseong,
                            current.jongseong
                        );
                        result += tensified;
                        continue;
                    }
                }
            }
            
            result += text[i];
        }
        
        return result;
    }
    
    // Rule 7: Aspiration (격음화)
    applyAspirationRule(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            
            if (!current) {
                result += text[i];
                continue;
            }
            
            // ㅎ + obstruent OR obstruent + ㅎ → aspirated
            if (i < text.length - 1) {
                const next = this.decompose(text[i + 1]);
                
                if (next) {
                    const combo = current.jongseong + next.choseong;
                    
                    if (this.ASPIRATION_MAP[combo]) {
                        // Replace with aspirated sound
                        const aspirated = this.ASPIRATION_MAP[combo];
                        
                        if (current.jongseong === 'ㅎ') {
                            // ㅎ is in jongseong position
                            result += this.compose(current.choseong, current.jungseong, '');
                            result += this.compose(aspirated, next.jungseong, next.jongseong);
                        } else {
                            // ㅎ is in next choseong position
                            result += this.compose(current.choseong, current.jungseong, '');
                            result += this.compose(aspirated, next.jungseong, next.jongseong);
                        }
                        
                        i++; // Skip next
                        continue;
                    }
                }
            }
            
            result += text[i];
        }
        
        return result;
    }
    
    // Rule 8: ㅎ deletion (ㅎ 탈락)
    applyHDeletionRule(text) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const current = this.decompose(text[i]);
            
            if (!current) {
                result += text[i];
                continue;
            }
            
            // ㅎ disappears between sonorants or before vowels
            if (current.choseong === 'ㅎ' && i > 0) {
                const prev = this.decompose(text[i - 1]);
                
                if (prev && prev.hasJongseong) {
                    const isSonorant = this.NASALS.includes(prev.jongseong) || 
                                      this.LIQUIDS.includes(prev.jongseong);
                    
                    if (isSonorant && !this.ASPIRATION_MAP[prev.jongseong + 'ㅎ']) {
                        // ㅎ deletes, but check if it's already handled by aspiration
                        result += this.compose('ㅇ', current.jungseong, current.jongseong);
                        continue;
                    }
                }
            }
            
            // ㅎ in jongseong before vowel
            if (current.jongseong === 'ㅎ' && i < text.length - 1) {
                const next = this.decompose(text[i + 1]);
                
                if (next && next.choseong === 'ㅇ') {
                    // ㅎ transfers but may delete
                    result += this.compose(current.choseong, current.jungseong, '');
                    continue;
                }
            }
            
            result += text[i];
        }
        
        return result;
    }
    
    // Helper: Compare two Korean texts considering pronunciation
    pronounciationEquals(text1, text2) {
        const pron1 = this.getPronunciation(text1);
        const pron2 = this.getPronunciation(text2);
        return pron1 === pron2;
    }
    
    // Helper: Get similarity score (0-1)
    getPronunciationSimilarity(text1, text2) {
        const pron1 = this.getPronunciation(text1);
        const pron2 = this.getPronunciation(text2);
        
        if (pron1 === pron2) return 1.0;
        
        // Calculate Levenshtein distance
        const distance = this.levenshteinDistance(pron1, pron2);
        const maxLength = Math.max(pron1.length, pron2.length);
        
        return 1 - (distance / maxLength);
    }
    
    // Levenshtein distance for similarity calculation
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KoreanPronunciation;
}

// Also make available globally
if (typeof window !== 'undefined') {
    window.KoreanPronunciation = KoreanPronunciation;
}