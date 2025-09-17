// Utility to compute automatic priority and reasons for an Issue
// Rules:
// 1. Vote thresholds: >=7 => high, >=2 => medium (baseline before cluster bump)
// 2. Clustering: If there are at least CLUSTER_MIN other issues of SAME category within 100m
//    then bump one level (low->medium, medium->high, high->urgent(rare)).
// 3. Always gather reasons so UI can display transparency.
// 4. If issue.priorityAuto === false we do NOT change its priority (return existing with empty reasons array).
//
// NOTE: We use spherical distance with Mongo $geoNear like logic; here we just query using $near.
// The 100m radius converted to radians is approx 100 / 6378137.

const Issue = require('../models/Issue');

const EARTH_RADIUS_M = 6378137; // WGS84
const CLUSTER_RADIUS_METERS = 100;
const CLUSTER_RADIUS_RADIANS = CLUSTER_RADIUS_METERS / EARTH_RADIUS_M; // ~1.567e-5
// Minimum OTHER issues required for a bump. Override with env CLUSTER_MIN_OTHERS=1 if you want 2 total issues to trigger.
const CLUSTER_MIN = parseInt(process.env.CLUSTER_MIN_OTHERS || '2', 10);

let loggedIndexesOnce = false;

function bumpPriority(level) {
    switch (level) {
        case 'low': return 'medium';
        case 'medium': return 'high';
        case 'high': return 'urgent';
        default: return level;
    }
}

/**
 * Compute automatic priority and reasons (pure logic except for cluster query).
 * @param {Issue} issueDoc Mongoose issue document (NOT yet saved modifications ok)
 * @returns {Promise<{priority: string, reasons: string[]}>}
 */
async function computePriority(issueDoc) {
    if (!issueDoc.priorityAuto) {
        return { priority: issueDoc.priority, reasons: [] };
    }
    const reasons = [];

    try {
        if (!loggedIndexesOnce && Issue?.collection) {
            loggedIndexesOnce = true;
            Issue.collection.indexes().then(idx => {
                console.log('[priority] Existing indexes:', idx.map(i => i.name));
            }).catch(e => console.log('[priority] Could not list indexes:', e.message));
        }
    } catch (_) {
        // ignore
    }

    console.log('[priority] START compute', {
        issueId: issueDoc._id?.toString(),
        category: issueDoc.category,
        votes: issueDoc.votes,
        priorityAuto: issueDoc.priorityAuto,
        coords: issueDoc.location?.coordinates,
        CLUSTER_MIN_OTHERS: CLUSTER_MIN,
        radiusM: CLUSTER_RADIUS_METERS
    });

    // Start from current priority baseline (could be user-set previously)
    let derived = 'low';

    // Vote thresholds
    if (issueDoc.votes >= 7) {
        console.log('[priority] votes>=7 raising baseline to high for issue', issueDoc._id?.toString());
        derived = 'high';
        reasons.push('votes>=7');
    } else if (issueDoc.votes >= 2) {
        console.log('[priority] votes>=2 raising baseline to medium for issue', issueDoc._id?.toString());
        derived = 'medium';
        reasons.push('votes>=2');
    } else {
        console.log('[priority] votes baseline low (votes=', issueDoc.votes, ') for issue', issueDoc._id?.toString());
        derived = 'low';
    }

    // Cluster detection (only if we have coordinates & category)
    if (issueDoc.location && Array.isArray(issueDoc.location.coordinates) && issueDoc.location.coordinates.length === 2) {
        const [lng, lat] = issueDoc.location.coordinates;
        try {
            const start = Date.now();
            // First attempt: $geoWithin sphere (center + radius)
            const sphereFilter = {
                _id: { $ne: issueDoc._id },
                category: issueDoc.category,
                location: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], CLUSTER_RADIUS_METERS / EARTH_RADIUS_M]
                    }
                }
            };
            let nearby = await Issue.countDocuments(sphereFilter);
            let method = 'geoWithin';
            // Fallback to $near only if first returns 0 and we still want to double-check
            if (nearby === 0) {
                try {
                    const nearFilter = {
                        _id: { $ne: issueDoc._id },
                        category: issueDoc.category,
                        'location.coordinates': {
                            $near: {
                                $geometry: { type: 'Point', coordinates: [lng, lat] },
                                $maxDistance: CLUSTER_RADIUS_METERS
                            }
                        }
                    };
                    const nearCount = await Issue.countDocuments(nearFilter);
                    if (nearCount > 0) {
                        nearby = nearCount;
                        method = 'near-fallback';
                    }
                } catch (nearErr) {
                    console.log('[priority] $near fallback failed:', nearErr.message);
                }
            }
            const ms = Date.now() - start;
            console.log('[priority] cluster query result', {
                issueId: issueDoc._id?.toString(),
                nearby,
                durationMs: ms,
                method,
                category: issueDoc.category,
                coords: [lng, lat]
            });
            if (nearby >= CLUSTER_MIN) {
                const previous = derived;
                derived = bumpPriority(derived);
                reasons.push(`cluster(${nearby + 1} issues within 100m)`); // +1 includes current issue
                if (previous !== derived) {
                    reasons.push('cluster-bump');
                }
                console.log('[priority] cluster bump applied issue', issueDoc._id?.toString(), 'nearby=', nearby, 'previous=', previous, 'new=', derived);
            } else {
                console.log('[priority] cluster not large enough issue', issueDoc._id?.toString(), 'nearby=', nearby, 'needed>=', CLUSTER_MIN);
            }
        } catch (e) {
            reasons.push('cluster-error');
            console.error('[priority] Cluster query failed:', e.message);
        }
    }

    const result = { priority: derived, reasons };
    console.log('[priority] END compute', { issueId: issueDoc._id?.toString(), priority: derived, reasons });
    return result;
}

module.exports = {
    computePriority,
    constants: { CLUSTER_RADIUS_METERS, CLUSTER_MIN }
};
