const Medicine = require('../models/Medicine');
const Stock = require('../models/Stock');

class MatchingService {
    // Find matching medicine when adding stock
    async findScheduleMatches(userId, stockItem) {
        try {
            // Get medicines without stock
            const medicinesWithoutStock = await Medicine.find({
                user: userId,
                hasStock: false,
                status: 'active'
            });

            const matches = [];

            for (const medicine of medicinesWithoutStock) {
                const score = this.calculateMatchScore(medicine, stockItem);

                if (score > 50) { // Threshold for matching
                    matches.push({
                        medicine,
                        score,
                        matchReasons: this.getMatchReasons(medicine, stockItem)
                    });
                }
            }

            // Sort by score descending
            matches.sort((a, b) => b.score - a.score);

            return matches;
        } catch (error) {
            console.error('Error finding schedule matches:', error);
            throw error;
        }
    }

    // Calculate match score between medicine and stock item
    calculateMatchScore(medicine, stockItem) {
        let score = 0;
        const reasons = [];

        // Name matching (40 points)
        const nameScore = this.calculateNameSimilarity(medicine.name, stockItem.name);
        if (nameScore > 0.7) {
            score += 40;
            reasons.push('Name matches');
        }

        // Generic name matching (20 points)
        if (medicine.genericName && stockItem.genericName) {
            const genericScore = this.calculateNameSimilarity(medicine.genericName, stockItem.genericName);
            if (genericScore > 0.8) {
                score += 20;
                reasons.push('Generic name matches');
            }
        }

        // Strength matching (20 points)
        if (medicine.strength && stockItem.strength) {
            if (this.normalizeStrength(medicine.strength) === this.normalizeStrength(stockItem.strength)) {
                score += 20;
                reasons.push('Strength matches');
            }
        }

        // Form matching (10 points)
        if (medicine.form && stockItem.form) {
            if (medicine.form.toLowerCase() === stockItem.form.toLowerCase()) {
                score += 10;
                reasons.push('Form matches');
            }
        }

        // Prescriber matching (10 points)
        if (medicine.prescriber && stockItem.purchasedFrom) {
            // Simple check - can be enhanced
            if (medicine.prescriber.toLowerCase().includes('dr') &&
                stockItem.purchasedFrom.toLowerCase().includes('pharmacy')) {
                score += 10;
                reasons.push('Likely from same source');
            }
        }

        return score;
    }

    // Calculate string similarity (simple version)
    calculateNameSimilarity(str1, str2) {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const s1 = normalize(str1);
        const s2 = normalize(str2);

        // Check if one contains the other
        if (s1.includes(s2) || s2.includes(s1)) {
            return 0.9;
        }

        // Levenshtein distance (simplified)
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        const longerLength = longer.length;

        if (longerLength === 0) return 1.0;

        const distance = this.levenshteinDistance(longer, shorter);
        return (longerLength - distance) / longerLength;
    }

    // Levenshtein distance implementation
    levenshteinDistance(a, b) {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
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

        return matrix[b.length][a.length];
    }

    // Normalize strength for comparison
    normalizeStrength(strength) {
        return strength.toLowerCase()
            .replace('mg', '')
            .replace('gm', '')
            .replace('ml', '')
            .trim();
    }

    // Get match reasons
    getMatchReasons(medicine, stockItem) {
        const reasons = [];

        if (medicine.name && stockItem.name &&
            this.calculateNameSimilarity(medicine.name, stockItem.name) > 0.7) {
            reasons.push(`Name: "${medicine.name}" matches "${stockItem.name}"`);
        }

        if (medicine.strength && stockItem.strength &&
            this.normalizeStrength(medicine.strength) === this.normalizeStrength(stockItem.strength)) {
            reasons.push(`Strength: ${medicine.strength}`);
        }

        if (medicine.form && stockItem.form &&
            medicine.form.toLowerCase() === stockItem.form.toLowerCase()) {
            reasons.push(`Form: ${medicine.form}`);
        }

        return reasons;
    }

    // Link stock to medicine
    async linkStockToMedicine(stockId, medicineId) {
        try {
            const stock = await Stock.findById(stockId);
            const medicine = await Medicine.findById(medicineId);

            if (!stock || !medicine) {
                throw new Error('Stock or Medicine not found');
            }

            // Update stock
            stock.medicine = medicineId;
            stock.isLinked = true;
            await stock.save();

            // Update medicine
            medicine.hasStock = true;
            medicine.stock = stockId;
            await medicine.save();

            return { stock, medicine };
        } catch (error) {
            console.error('Error linking stock to medicine:', error);
            throw error;
        }
    }
}

module.exports = new MatchingService();