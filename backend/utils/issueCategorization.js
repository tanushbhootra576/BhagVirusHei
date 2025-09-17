/**
 * Basic issue categorization utility
 * In a real application, this would be integrated with TensorFlow.js
 * or another ML library to perform more accurate classification
 */

// Keywords associated with each category
const categoryKeywords = {
    pothole: ['pothole', 'hole', 'road damage', 'crater', 'broken road', 'asphalt damage', 'road hazard'],
    garbage: ['garbage', 'trash', 'waste', 'litter', 'dump', 'debris', 'rubbish', 'waste collection'],
    streetlight: ['streetlight', 'light', 'lamp post', 'street lamp', 'lighting', 'pole', 'dark street'],
    water: ['water', 'pipe', 'leakage', 'tap', 'supply', 'drainage', 'flood', 'overflow', 'sewage'],
    electricity: ['electricity', 'power', 'outage', 'electric', 'transformer', 'wires', 'blackout'],
    sewage: ['sewage', 'drain', 'clogged', 'blockage', 'manhole', 'sewer', 'overflow', 'drainage'],
    traffic: ['traffic', 'signal', 'jam', 'congestion', 'road block', 'accident', 'crossing'],
    vandalism: ['vandalism', 'graffiti', 'damage', 'broken', 'destroyed', 'defacement', 'property damage']
};

/**
 * Categorize issue based on text description
 * @param {string} text - Issue description text
 * @returns {string} - Predicted category
 */
function categorizeIssue(text) {
    if (!text) return 'other';

    const lowercaseText = text.toLowerCase();

    // Calculate score for each category based on keyword matches
    const scores = {};

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        scores[category] = keywords.reduce((score, keyword) => {
            // Check if the keyword is in the text
            if (lowercaseText.includes(keyword.toLowerCase())) {
                // Add a higher score for full word matches vs partial matches
                const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
                return score + (regex.test(lowercaseText) ? 2 : 1);
            }
            return score;
        }, 0);
    }

    // Find category with highest score
    let bestCategory = 'other';
    let highestScore = 0;

    for (const [category, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            bestCategory = category;
        }
    }

    // If no clear match, return 'other'
    return highestScore > 0 ? bestCategory : 'other';
}

/**
 * Extract key entities from issue description
 * In a real application, this would use NLP to extract entities
 * @param {string} text - Issue description text
 * @returns {Object} - Extracted entities
 */
function extractEntities(text) {
    if (!text) return {};

    const lowercaseText = text.toLowerCase();

    // Simple regex patterns to extract common entities
    const entities = {
        locations: [],
        dates: [],
        times: []
    };

    // Extract location mentions (very basic approach)
    const locationPattern = /(?:at|in|near|on)\s+([A-Z][a-z]+ (?:Road|Street|Avenue|Lane|Boulevard|Square|Park|Mall|Market))/gi;
    const locationMatches = text.match(locationPattern);

    if (locationMatches) {
        entities.locations = locationMatches.map(match =>
            match.replace(/(?:at|in|near|on)\s+/i, '')
        );
    }

    // Extract date mentions (basic approach)
    const datePattern = /(?:on|since|from|until)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)|yesterday|today|tomorrow)/gi;
    const dateMatches = text.match(datePattern);

    if (dateMatches) {
        entities.dates = dateMatches.map(match =>
            match.replace(/(?:on|since|from|until)\s+/i, '')
        );
    }

    // Extract time mentions (basic approach)
    const timePattern = /(?:at|around|before|after)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))/gi;
    const timeMatches = text.match(timePattern);

    if (timeMatches) {
        entities.times = timeMatches.map(match =>
            match.replace(/(?:at|around|before|after)\s+/i, '')
        );
    }

    return entities;
}

/**
 * Estimate priority based on text content
 * @param {string} text - Issue description text
 * @returns {string} - Estimated priority (low, medium, high, urgent)
 */
function estimatePriority(text) {
    if (!text) return 'low';

    const lowercaseText = text.toLowerCase();

    // Check for urgent keywords
    const urgentKeywords = ['urgent', 'emergency', 'immediately', 'dangerous', 'hazard', 'accident', 'critical', 'severe'];
    const highKeywords = ['important', 'serious', 'significant', 'major', 'big problem', 'many people'];
    const mediumKeywords = ['problem', 'issue', 'fix', 'repair', 'attention'];

    // Check for urgent priority
    for (const keyword of urgentKeywords) {
        if (lowercaseText.includes(keyword)) {
            return 'urgent';
        }
    }

    // Check for high priority
    for (const keyword of highKeywords) {
        if (lowercaseText.includes(keyword)) {
            return 'high';
        }
    }

    // Check for medium priority
    for (const keyword of mediumKeywords) {
        if (lowercaseText.includes(keyword)) {
            return 'medium';
        }
    }

    return 'low';
}

module.exports = {
    categorizeIssue,
    extractEntities,
    estimatePriority
};
