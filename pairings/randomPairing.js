function canPair(items) {
    return Array.isArray(items) && items.every(item => typeof item === 'string');
}

function pair(items) {
    if (items.length % 2 != 0) {
        throw new Error(`Can't make pairs using odd number of players`);
    }

    items.sort(() => 0.5 - Math.random());

    const pairs = [];

    while (items.length) {
        const [home, away] = items.splice(0, 2);

        pairs.push({
            home,
            away
        });
    }

    return pairs;
}

module.exports = {
    name: 'Random Pairing',
    priority: 1,
    canPair,
    pair
};