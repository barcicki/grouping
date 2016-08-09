/**
 * Checks if items can be processed by grouping.
 *
 * Valid items:
 * - array of strings
 * - array of WeightedItem (object with 'label' and 'weight' property)
 * - object with multiple properties of on of above type
 *
 * @param {*} items
 * @returns {boolean}
 */
function canGroup(items) {
    if (Array.isArray(items)) {
        return isArrayOfStringsOrWeightedItems(items);
    }

    if (typeof items === 'object') {
        return Object
            .keys(items)
            .map(key => items[key])
            .every(isArrayOfStringsOrWeightedItems);
    }

    return false;
}

/**
 * Checks if provided items is an array of strings or of WeightedItem (object
 * with 'label' and 'weight' property).
 *
 * @param {*} items
 * @returns {boolean}
 */
function isArrayOfStringsOrWeightedItems(items) {
    return Array.isArray(items) &&
           items.every(item => typeof item === 'string' || isWeightedItem(item));
}

/**
 * Checks if provided item is a WeightedItem - an object with 'label' property.
 *
 * @param {*} item
 * @returns {boolean}
 */
function isWeightedItem(item) {
    return typeof item === 'object' && !!item.label;
}

/**
 * Creates mapper function able to extract weight from string.
 *
 * @param {object} params - additional parameters to be included in the output
 * @returns {function(*)}
 */
function createToWeightedItemConverter(params = {}) {
    return (item) => {
        const weightedItem = {
            label: null,
            weight: 0
        };

        if (isWeightedItem(item)) {
            Object.assign(weightedItem, item);

        } else {
            const comaPos = item.lastIndexOf(',');
            const hasWeight = comaPos !== -1;

            if (hasWeight) {
                weightedItem.label = item.slice(0, comaPos);
                weightedItem.weight = parseInt(item.slice(comaPos + 1), 10);

            } else {
                weightedItem.label = item;
            }
        }

        return Object.assign(weightedItem, params);
    }
}

/**
 * Comparator for WeightedItem.
 * Orders items by weight or randomly if weight is the same.
 *
 * @param {WeightedItem} itemA
 * @param {WeightedItem} itemB
 * @returns {number}
 */
function sortByWeight(itemA, itemB) {
    if (itemA.weight === itemB.weight) {
        return 0.5 - Math.random();
    }

    return itemB.weight - itemA.weight;
}

/**
 * Flattens the list if composed of baskets.
 * Extracts weight from strings and converts items to WeightedItem.
 * Shuffles the list based on weight and basket ownership.
 *
 * @param {object|Array.<string>} data - data to divide
 * @returns {Array.<WeightedItem>}
 */
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

/**
 * Divides items from data into certain number of groups.
 *
 * @param {object|Array.<string>} data - data to divide
 * @param {number} [maxGroupSize=2] - max numbers of items in group
 * @param {boolean} [isStrict=false] - flag informing whether the script should
 * check if the data can be evenly divided
 * @returns {Array.<Array.<string>>}
 */
function group(data, { maxGroupSize = 2, isStrict = false } = {}) {
    const items = convertAndShuffleItems(data);

    if (maxGroupSize === 1) {
        return items.map(weightedItem => [weightedItem.item]);
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
        groups[groupIndex].push(items.shift().label);
        groupIndex = (groupIndex + 1) % groupsCount;
    }

    return groups;
}

module.exports = {
    canGroup,
    group
};

/**
 * @typedef {object} WeightedItem
 * @property {string} label
 * @property {number} [weight]
 * @property {string} [basket]
 */