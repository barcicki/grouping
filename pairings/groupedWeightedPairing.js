const randomPairing = require('./randomPairing');
const weightedPairing = require('./weightedPairing');

function canPair(items) {
    if (typeof items !== 'object' || Array.isArray(items)) {
        return false;
    }

    return Object
        .keys(items)
        .map(key => items[key])
        .every(randomPairing.canPair);
}

function pair(data) {
    const groups = Object
        .keys(data)
        .map(key => data[key]);

    const count = groups.reduce((sum, group) => sum + group.length, 0);

    if (count % 2 != 0) {
        throw new Error(`Can't make pairs using odd number of players`);
    }

    const flattenedWeightedItems = groups.reduce((list, group) => list.concat(group
        .map(weightedPairing.toWeightedItem)
        .sort(weightedPairing.sortByWeight)
    ), []);

    return weightedPairing.pairWeightedItems(flattenedWeightedItems);
}

module.exports = {
    name: 'Grouped Weighted Pairing',
    priority: 3,
    canPair,
    pair
};