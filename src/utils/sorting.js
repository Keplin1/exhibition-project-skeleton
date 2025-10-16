const parseHistoricalDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 0;

    const str = dateString.trim().toLowerCase();
    if (!str) return 0;

    let match;

    // --- 1. BCE/BC to CE/AD range: "57 BCE - 668 CE"
    if ((match = str.match(/(\d+)\s*(bce|bc)\s*[-–—]\s*(\d+)\s*(ce|ad)/))) {
        const bceYear = -parseInt(match[1], 10);
        const ceYear = parseInt(match[3], 10);
        return (bceYear + ceYear) / 2;
    }

    // --- 2. BCE/BC to BCE/BC range: "500 BCE - 300 BCE"
    if ((match = str.match(/(\d+)\s*(bce|bc)\s*[-–—]\s*(\d+)\s*(bce|bc)/))) {
        const start = -parseInt(match[1], 10);
        const end = -parseInt(match[3], 10);
        return (start + end) / 2;
    }

    // --- 2b. Range with single BCE/BC at end: "447-432 BCE"
    if ((match = str.match(/(\d+)\s*[-–—]\s*(\d+)\s+(bce|bc)/))) {
        const start = -parseInt(match[1], 10);
        const end = -parseInt(match[2], 10);
        return (start + end) / 2;
    }

    // --- 3. CE/AD to CE/AD range: "1200 CE - 1300 CE"
    if ((match = str.match(/(\d+)\s*(ce|ad)\s*[-–—]\s*(\d+)\s*(ce|ad)/))) {
        const start = parseInt(match[1], 10);
        const end = parseInt(match[3], 10);
        return (start + end) / 2;
    }

    // --- 3b. Range with single CE/AD at end: "1200-1300 CE"
    if ((match = str.match(/(\d+)\s*[-–—]\s*(\d+)\s+(ce|ad)/))) {
        const start = parseInt(match[1], 10);
        const end = parseInt(match[2], 10);
        return (start + end) / 2;
    }

    // --- 4. "early/mid/late Xth century" (check this BEFORE plain century)
    if ((match = str.match(/(early|mid|late)\s+(\d+)\s*(st|nd|rd|th)\s+century\s*(bce|bc|ce|ad)?/))) {
        const qualifier = match[1];
        const century = parseInt(match[2], 10);
        const era = match[4];

        const centuryStart = (century - 1) * 100 + 1;

        // Map qualifiers to approximate years within the century
        const offsets = {
            early: 15,   // early 19th century ≈ 1816
            mid: 50,     // mid 19th century ≈ 1851
            late: 85     // late 19th century ≈ 1886
        };

        const year = centuryStart + (offsets[qualifier] || 50);

        if (era && (era === 'bce' || era === 'bc')) {
            return -year;
        }
        return year;
    }

    // --- 5. "Xth century BC/BCE" or "Xth century CE/AD"
    if ((match = str.match(/(\d+)\s*(st|nd|rd|th)\s+century\s*(bce|bc|ce|ad)?/))) {
        const century = parseInt(match[1], 10);
        const era = match[3];

        // Century calculation: 1st century = years 1-100, 19th century = 1801-1900
        const start = (century - 1) * 100 + 1;
        const end = century * 100;
        const midpoint = (start + end) / 2;

        // If BCE/BC, negate the result
        if (era && (era === 'bce' || era === 'bc')) {
            return -midpoint;
        }
        return midpoint;
    }

    // --- 6. "circa/c. YEAR BCE/CE" or with range "c. 1810-20"
    if ((match = str.match(/c\.?\s*(\d+)\s*[-–—]\s*(\d+)\s*(bce|bc|ce|ad)?/))) {
        // Range with circa
        const start = parseInt(match[1], 10);
        let end = parseInt(match[2], 10);

        // Handle abbreviated ranges like "1810-20" → "1810-1820"
        if (end < 100) {
            const prefix = Math.floor(start / 100) * 100;

            if (end < 10) {
                // "1810-5" → 1815
                end = Math.floor(start / 10) * 10 + end;
            } else {
                // "1810-20" → 1820
                end = prefix + end;
            }
        }

        const midpoint = (start + end) / 2;
        const era = match[3];

        if (era && (era === 'bce' || era === 'bc')) {
            return -midpoint;
        }
        return midpoint;
    }

    // --- 7. "circa/c. YEAR"
    if ((match = str.match(/c\.?\s*(\d+)\s*(bce|bc|ce|ad)?/))) {
        const year = parseInt(match[1], 10);
        const era = match[2];

        if (era && (era === 'bce' || era === 'bc')) {
            return -year;
        }
        return year;
    }

    // --- 8. Numeric range without circa: "1810-20" or "1900-1910"
    if ((match = str.match(/(\d+)\s*[-–—]\s*(\d+)(?!\s*(?:bce|bc|ce|ad))/))) {
        const start = parseInt(match[1], 10);
        let end = parseInt(match[2], 10);

        // Handle abbreviated ranges
        if (end < 100) {
            const prefix = Math.floor(start / 100) * 100;

            if (end < 10) {
                end = Math.floor(start / 10) * 10 + end;
            } else {
                end = prefix + end;
            }
        }

        return (start + end) / 2;
    }

    // --- 9. "early/mid/late 1800s" (decade with qualifier)
    if ((match = str.match(/(early|mid|late)\s+(\d+)0s\s*(bce|bc|ce|ad)?/))) {
        const qualifier = match[1];
        const decade = parseInt(match[2], 10) * 10;
        const era = match[3];

        const offsets = {
            early: 2,   // early 1800s ≈ 1802
            mid: 5,     // mid 1800s ≈ 1805
            late: 8     // late 1800s ≈ 1808
        };

        const year = decade + (offsets[qualifier] || 5);

        if (era && (era === 'bce' || era === 'bc')) {
            return -year;
        }
        return year;
    }

    // --- 10. Decade: "700s" or "1800s"
    if ((match = str.match(/(\d+)0s\s*(bce|bc|ce|ad)?/))) {
        const decade = parseInt(match[1], 10) * 10;
        const era = match[2];
        const midpoint = decade + 5; // midpoint of decade

        if (era && (era === 'bce' || era === 'bc')) {
            return -midpoint;
        }
        return midpoint;
    }

    // --- 11. Single year with BCE/BC/CE/AD
    if ((match = str.match(/(\d+)\s*(bce|bc|ce|ad)/))) {
        const year = parseInt(match[1], 10);
        const era = match[2];

        if (era === 'bce' || era === 'bc') {
            return -year;
        }
        return year;
    }

    // --- 12. Plain number (assume CE)
    if ((match = str.match(/(\d+)/))) {
        return parseInt(match[1], 10);
    }

    // Unable to parse
    return 0;
};

export { parseHistoricalDate };