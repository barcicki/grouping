function canGroup(items) {
    if (Array.isArray(items)) {
        return isArrayOfStrings(items);
    }

    if (typeof items === 'object') {
        return Object
            .keys(items)
            .map(key => items[key])
            .every(isArrayOfStrings);
    }

    return false;
}

function isArrayOfStrings(items) {
    return Array.isArray(items) && items.every(item => typeof item === 'string');
}

function createToWeightedItemConverter(additionalParams) {
    return (string) => {
        const [item, weight] = string.split(',');

        return Object.assign({
            item,
            weight: weight ? parseInt(weight, 10) : 0
        }, additionalParams);
    }
}

function sortByWeight(itemA, itemB) {
    if (itemA.weight === itemB.weight) {
        return 0.5 - Math.random();
    }

    return itemB.weight - itemA.weight;
}

function convertAndShuffleItems(data) {
    if (Array.isArray(data)) {
        return data
            .map(createToWeightedItemConverter())
            .sort(sortByWeight)
    }

    return Object.keys(data)
        .map(key => ({ basket: key, data: data[key] }))
        .reduce((items, { basket, data }) => {
            const toWeightedItem = createToWeightedItemConverter({ basket });
            const itemsFromBasket = data
                .map(toWeightedItem)
                .sort(sortByWeight);

            return items.concat(itemsFromBasket);
        }, []);
}

function group(data, { maxGroupSize = 2, isStrict = false } = {}) {
    const items = convertAndShuffleItems(data);

    if (maxGroupSize === 1) {
        return items
            .map(weightedItem => [weightedItem.item]);
    }

    if (isStrict && items.length % maxGroupSize !== 0) {
        throw new Error(`Can't divide items evenly`);
    }

    if (isStrict && items.length < maxGroupSize) {
        throw new Error(`No enough items to form a group!`);
    }

    const groupsCount = Math.ceil(items.length / maxGroupSize);
    const groups = Array.from({ length: groupsCount }, () => []);

    let groupIndex = 0;

    while (items.length) {
        groups[groupIndex].push(items.shift().item);
        groupIndex = (groupIndex + 1) % groupsCount;
    }

    return groups;
}

module.exports = {
    canGroup,
    group
};