const Issue = require('../models/Issue');
const User = require('../models/User');
const moment = require('moment');

module.exports = {
    // Get overall statistics
    getOverallStats: async (req, res) => {
        try {
            // Get counts by status
            const statusCounts = await Issue.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]);

            // Format counts
            const counts = {
                total: 0,
                submitted: 0,
                'in-progress': 0,
                resolved: 0,
                rejected: 0
            };

            statusCounts.forEach(item => {
                counts[item._id] = item.count;
                counts.total += item.count;
            });

            // Calculate resolution rate
            const resolutionRate = counts.total > 0
                ? ((counts.resolved / counts.total) * 100).toFixed(2)
                : 0;

            // Get counts by category
            const categoryCounts = await Issue.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]);

            // Get average resolution time
            const resolutionTimeData = await Issue.aggregate([
                {
                    $match: {
                        status: 'resolved',
                        'resolutionDetails.resolutionDate': { $exists: true }
                    }
                },
                {
                    $project: {
                        resolutionTime: {
                            $divide: [
                                { $subtract: ['$resolutionDetails.resolutionDate', '$createdAt'] },
                                1000 * 60 * 60 * 24 // Convert to days
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageTime: { $avg: '$resolutionTime' },
                        minTime: { $min: '$resolutionTime' },
                        maxTime: { $max: '$resolutionTime' }
                    }
                }
            ]);

            const resolutionTime = resolutionTimeData.length > 0 ? {
                average: parseFloat(resolutionTimeData[0].averageTime).toFixed(2),
                min: parseFloat(resolutionTimeData[0].minTime).toFixed(2),
                max: parseFloat(resolutionTimeData[0].maxTime).toFixed(2)
            } : { average: 0, min: 0, max: 0 };

            // Get user stats
            const userCount = await User.countDocuments();
            const citizenCount = await User.countDocuments({ role: 'citizen' });
            const governmentCount = await User.countDocuments({ role: 'government' });

            // Get top departments
            const departmentPerformance = await Issue.aggregate([
                { $match: { status: 'resolved' } },
                {
                    $group: {
                        _id: '$assignedTo.department',
                        count: { $sum: 1 },
                        avgTime: {
                            $avg: {
                                $divide: [
                                    { $subtract: ['$resolutionDetails.resolutionDate', '$createdAt'] },
                                    1000 * 60 * 60 * 24 // Convert to days
                                ]
                            }
                        }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);

            res.json({
                issueStats: {
                    counts,
                    resolutionRate: parseFloat(resolutionRate),
                    categoryCounts,
                    resolutionTime
                },
                userStats: {
                    total: userCount,
                    citizens: citizenCount,
                    government: governmentCount
                },
                departmentPerformance: departmentPerformance.map(dept => ({
                    department: dept._id,
                    resolvedCount: dept.count,
                    avgResolutionTime: parseFloat(dept.avgTime).toFixed(2)
                }))
            });
        } catch (error) {
            console.error('Get overall stats error:', error);
            res.status(500).json({ message: 'Server error while fetching stats' });
        }
    },

    // Get trend data over time
    getTrendData: async (req, res) => {
        try {
            const { period = 'week', startDate, endDate } = req.query;

            // Define time range
            let start, end, format, groupBy;

            if (startDate && endDate) {
                start = moment(startDate);
                end = moment(endDate);

                // Determine appropriate format based on date range
                const days = end.diff(start, 'days');

                if (days <= 14) {
                    format = '%Y-%m-%d'; // Daily
                    groupBy = { year: '$year', month: '$month', day: '$day' };
                } else if (days <= 90) {
                    format = '%Y-%m-%d'; // Weekly
                    groupBy = { year: '$year', week: '$week' };
                } else {
                    format = '%Y-%m'; // Monthly
                    groupBy = { year: '$year', month: '$month' };
                }
            } else {
                end = moment();

                switch (period) {
                    case 'week':
                        start = moment().subtract(7, 'days');
                        format = '%Y-%m-%d';
                        groupBy = { year: '$year', month: '$month', day: '$day' };
                        break;
                    case 'month':
                        start = moment().subtract(30, 'days');
                        format = '%Y-%m-%d';
                        groupBy = { year: '$year', month: '$month', day: '$day' };
                        break;
                    case 'quarter':
                        start = moment().subtract(90, 'days');
                        format = '%Y-%m-%d';
                        groupBy = { year: '$year', week: '$week' };
                        break;
                    case 'year':
                        start = moment().subtract(12, 'months');
                        format = '%Y-%m';
                        groupBy = { year: '$year', month: '$month' };
                        break;
                    default:
                        start = moment().subtract(7, 'days');
                        format = '%Y-%m-%d';
                        groupBy = { year: '$year', month: '$month', day: '$day' };
                }
            }

            // Get created issues trend
            const createdTrend = await Issue.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start.toDate(), $lte: end.toDate() }
                    }
                },
                {
                    $project: {
                        date: { $dateToString: { format, date: '$createdAt' } },
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                        week: { $week: '$createdAt' },
                        status: 1
                    }
                },
                {
                    $group: {
                        _id: { date: '$date', ...groupBy },
                        submitted: {
                            $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] }
                        },
                        inProgress: {
                            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
                        },
                        resolved: {
                            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                        },
                        total: { $sum: 1 }
                    }
                },
                { $sort: { '_id.date': 1 } }
            ]);

            // Get category distribution over time
            const categoryTrend = await Issue.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start.toDate(), $lte: end.toDate() }
                    }
                },
                {
                    $project: {
                        date: { $dateToString: { format, date: '$createdAt' } },
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                        week: { $week: '$createdAt' },
                        category: 1
                    }
                },
                {
                    $group: {
                        _id: { date: '$date', category: '$category', ...groupBy },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: '$_id.date',
                        categories: {
                            $push: {
                                category: '$_id.category',
                                count: '$count'
                            }
                        }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);

            res.json({
                timeRange: {
                    start: start.format('YYYY-MM-DD'),
                    end: end.format('YYYY-MM-DD'),
                    period
                },
                issuesTrend: createdTrend.map(item => ({
                    date: item._id.date,
                    submitted: item.submitted,
                    inProgress: item.inProgress,
                    resolved: item.resolved,
                    total: item.total
                })),
                categoryTrend: categoryTrend.map(item => ({
                    date: item._id,
                    categories: item.categories
                }))
            });
        } catch (error) {
            console.error('Get trend data error:', error);
            res.status(500).json({ message: 'Server error while fetching trend data' });
        }
    },

    // Get heatmap data
    getHeatmapData: async (req, res) => {
        try {
            const { bounds, category, status, startDate, endDate } = req.query;

            // Build query
            const query = {};

            // Geographical bounds
            if (bounds) {
                const { north, south, east, west } = JSON.parse(bounds);

                query['location.coordinates'] = {
                    $geoWithin: {
                        $box: [
                            [parseFloat(west), parseFloat(south)], // Southwest corner
                            [parseFloat(east), parseFloat(north)]  // Northeast corner
                        ]
                    }
                };
            }

            // Category filter
            if (category) {
                query.category = category;
            }

            // Status filter
            if (status) {
                query.status = status;
            }

            // Date range filter
            if (startDate || endDate) {
                query.createdAt = {};

                if (startDate) {
                    query.createdAt.$gte = new Date(startDate);
                }

                if (endDate) {
                    query.createdAt.$lte = new Date(endDate);
                }
            }

            // Execute query
            const issues = await Issue.find(query).select('location category status priority votes');

            // Format for heatmap
            const heatmapData = issues.map(issue => ({
                coordinates: issue.location.coordinates,
                intensity: calculateIntensity(issue),
                category: issue.category,
                status: issue.status,
                id: issue._id
            }));

            // Get category distribution
            const categoryDistribution = await Issue.aggregate([
                { $match: query },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            // Get status distribution
            const statusDistribution = await Issue.aggregate([
                { $match: query },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]);

            res.json({
                heatmapData,
                categoryCounts: categoryDistribution,
                statusCounts: statusDistribution,
                total: issues.length
            });
        } catch (error) {
            console.error('Get heatmap data error:', error);
            res.status(500).json({ message: 'Server error while fetching heatmap data' });
        }
    },

    // Get department performance metrics
    getDepartmentMetrics: async (req, res) => {
        try {
            // Get department stats
            const departmentStats = await Issue.aggregate([
                {
                    $group: {
                        _id: '$assignedTo.department',
                        total: { $sum: 1 },
                        resolved: {
                            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                        },
                        inProgress: {
                            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
                        },
                        avgResolutionTime: {
                            $avg: {
                                $cond: [
                                    { $eq: ['$status', 'resolved'] },
                                    {
                                        $divide: [
                                            { $subtract: ['$resolutionDetails.resolutionDate', '$createdAt'] },
                                            1000 * 60 * 60 * 24 // Convert to days
                                        ]
                                    },
                                    null
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        department: '$_id',
                        total: 1,
                        resolved: 1,
                        inProgress: 1,
                        pending: { $subtract: ['$total', { $add: ['$resolved', '$inProgress'] }] },
                        resolutionRate: {
                            $cond: [
                                { $eq: ['$total', 0] },
                                0,
                                { $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }
                            ]
                        },
                        avgResolutionTime: 1
                    }
                },
                { $sort: { resolutionRate: -1 } }
            ]);

            res.json({
                departmentStats: departmentStats.map(dept => ({
                    ...dept,
                    resolutionRate: parseFloat(dept.resolutionRate).toFixed(2),
                    avgResolutionTime: dept.avgResolutionTime
                        ? parseFloat(dept.avgResolutionTime).toFixed(2)
                        : 'N/A'
                }))
            });
        } catch (error) {
            console.error('Get department metrics error:', error);
            res.status(500).json({ message: 'Server error while fetching department metrics' });
        }
    },

    // Get user engagement metrics
    getUserEngagementMetrics: async (req, res) => {
        try {
            // Get user growth over time
            const userGrowth = await User.aggregate([
                {
                    $project: {
                        date: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                        role: 1
                    }
                },
                {
                    $group: {
                        _id: { date: '$date', role: '$role' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: '$_id.date',
                        roles: {
                            $push: {
                                role: '$_id.role',
                                count: '$count'
                            }
                        },
                        total: { $sum: '$count' }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);

            // Get user engagement stats
            const userEngagement = await Issue.aggregate([
                {
                    $group: {
                        _id: '$reportedBy',
                        issuesReported: { $sum: 1 },
                        issuesResolved: {
                            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                        },
                        totalVotes: { $sum: '$votes' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                { $unwind: '$userDetails' },
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },
                        activeUsers: { $sum: 1 },
                        totalIssuesReported: { $sum: '$issuesReported' },
                        totalIssuesResolved: { $sum: '$issuesResolved' },
                        totalVotes: { $sum: '$totalVotes' },
                        avgIssuesPerUser: { $avg: '$issuesReported' },
                        usersWithResolvedIssues: {
                            $sum: { $cond: [{ $gt: ['$issuesResolved', 0] }, 1, 0] }
                        },
                        // Users with more than 5 issues reported
                        powerUsers: {
                            $sum: { $cond: [{ $gte: ['$issuesReported', 5] }, 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalUsers: 1,
                        activeUsers: 1,
                        totalIssuesReported: 1,
                        totalIssuesResolved: 1,
                        totalVotes: 1,
                        avgIssuesPerUser: 1,
                        usersWithResolvedIssues: 1,
                        powerUsers: 1,
                        powerUserPercentage: {
                            $multiply: [{ $divide: ['$powerUsers', '$totalUsers'] }, 100]
                        },
                        issueResolutionRate: {
                            $multiply: [
                                { $divide: ['$totalIssuesResolved', '$totalIssuesReported'] },
                                100
                            ]
                        }
                    }
                }
            ]);

            // Get top users
            const topUsers = await User.aggregate([
                { $match: { role: 'citizen' } },
                { $sort: { points: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        points: 1,
                        badges: { $size: '$badges' }
                    }
                }
            ]);

            res.json({
                userGrowth: userGrowth.map(item => ({
                    date: item._id,
                    citizens: (item.roles.find(r => r.role === 'citizen') || { count: 0 }).count,
                    government: (item.roles.find(r => r.role === 'government') || { count: 0 }).count,
                    total: item.total
                })),
                engagement: userEngagement.length > 0 ? {
                    ...userEngagement[0],
                    avgIssuesPerUser: parseFloat(userEngagement[0].avgIssuesPerUser).toFixed(2),
                    powerUserPercentage: parseFloat(userEngagement[0].powerUserPercentage).toFixed(2),
                    issueResolutionRate: parseFloat(userEngagement[0].issueResolutionRate).toFixed(2)
                } : null,
                topUsers
            });
        } catch (error) {
            console.error('Get user engagement metrics error:', error);
            res.status(500).json({ message: 'Server error while fetching user engagement metrics' });
        }
    }
};

// Helper function to calculate heatmap intensity based on issue properties
function calculateIntensity(issue) {
    // Base intensity based on priority
    const priorityWeight = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'urgent': 4
    };

    // Calculate base intensity
    let intensity = priorityWeight[issue.priority] || 1;

    // Adjust based on votes (more votes = higher intensity)
    intensity += Math.min(issue.votes / 5, 3);

    // Adjust based on status (submitted and in-progress are more "hot" than resolved)
    if (issue.status === 'submitted') {
        intensity += 1;
    } else if (issue.status === 'in-progress') {
        intensity += 0.5;
    } else if (issue.status === 'resolved') {
        intensity -= 1;
    }

    // Ensure intensity is positive
    return Math.max(intensity, 0.5);
}
