const _ = require('lodash');

function pairEqually(data = []) {
    if (data.length % 2 != 0) {
        throw new Error(`Can't make pairs using odd number of players`);
    }

    return _(data)
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

function process(data) {
    if (_.every(data, _.isString)) {
        return pairEqually(data);
    }

    return data;
}


module.exports = process;