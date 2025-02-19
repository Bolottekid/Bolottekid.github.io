const minEl = document.querySelector('#min');
const maxEl = document.querySelector('#max');

const table = new DataTable('#example');

// Custom range filtering function
table.search.fixed('range', function (searchStr, data, index) {
    var min = parseInt(minEl.value, 10);
    var max = parseInt(maxEl.value, 10);
    var range = parseFloat(data[32]) || 0; // use data for the age column

    if (
        (isNaN(min) && isNaN(max)) ||
        (isNaN(min) && range <= max) ||
        (min <= range && isNaN(max)) ||
        (min <= range && range <= max)
    ) {
        return true;
    }

    return false;
});

// Changes to the inputs will trigger a redraw to update the table
minEl.addEventListener('input', function () {
    table.draw();
});
maxEl.addEventListener('input', function () {
    table.draw();
});
