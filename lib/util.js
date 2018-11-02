module.exports = {
    /* Finds and returns the first element to match a given predicate */
    first: function (array, predicate) {
        for (const elem of array) {
            if (predicate(elem)) {
                return elem;
            }
        }
    }
}