const WEIGHTED_PATTERN = /, ?[0-9]+/;

function canPair(items) {
    let anyWeighted = false;

    if (!Array.isArray(items)) {
        return false;
    }

    for (const item of items) {
        if (typeof item !== 'string') {
            return false;
        }

        if (item.match(WEIGHTED_PATTERN)) {
            anyWeighted = true;
        }
    }

    return anyWeighted;
}

function sortByWeight(itemA, itemB) {
    if (itemA.weight === itemB.weight) {
        return 0.5 - Math.random();
    }

    return itemB.weight - itemA.weight;
}

function toWeightedItem(item) {
    const splitItem = item.split(',');

    return {
        player: splitItem[0],
        weight: parseInt(splitItem[1], 10) || 0
    };
}

function pairWeightedItems(weightedItems) {
    const orderedItems = weightedItems
        .filter(item => item.weight > 0);

    const randomItems = weightedItems
        .filter(item => item.weight === 0);

    const pairs = [];

    while (orderedItems.length || randomItems.length) {
        let homes = orderedItems;
        let aways = randomItems;

        if (!homes.length) {
            homes = aways;
        } else if (!aways.length) {
            aways = homes;
        }

        pairs.push({
            home: homes.shift().player,
            away: aways.pop().player
        });
    }

    return pairs;
}

function pair(items) {
    if (items.length % 2 != 0) {
        throw new Error(`Can't make pairs using odd number of players`);
    }

    const weightedItems = items
        .map(toWeightedItem)
        .sort(sortByWeight);

    return pairWeightedItems(weightedItems)
}

module.exports = {
    name: 'Weighted Pairing',
    priority: 2,
    toWeightedItem,
    sortByWeight,
    pairWeightedItems,
    canPair,
    pair
};