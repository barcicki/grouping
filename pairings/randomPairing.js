const _ = require('lodash');

function canPair(items) {
    return _.every(items, _.isString);
}

function pair(items) {
    if (items.length % 2 != 0) {
        throw new Error(`Can't make pairs using odd number of players`);
    }

    return _(items)
        .shuffle()
        .reduce((result, item, index) => {
            if (index % 2 == 0) {
                result.push({
                    home: item
                });
            } else {
                _.last(result).away = item;
            }

            return result;
        }, []);
}

module.exports = {
    name: 'Random Pairing',
    priority: 1,
    canPair,
    pair
};