// Show modal on first visit

window.onload = function () {
    
    if(localStorage.getItem('popUpShown') === null) {
    OpenBootstrapPopup();

    localStorage.setItem('popUpShown', 'shown');
}
};

function OpenBootstrapPopup() {
    $("#modal").modal('show');
};

// Generic function to select html elements

const selectElement = (element) => document.querySelector(element);

//Open and close navbar on click

selectElement('.menu-icons').addEventListener('click', () => {
    selectElement('nav').classList.toggle('active')
})



// Toggles 'featured' class for first div




$('#search-icon').click(function () {
    $('#search-bar').slideToggle(200);
});

// Search function

$('#search-bar').keyup(function () {
    const filter = $(this).val();
    $('.item').each(function () {
        if ($(this).text().search(new RegExp(filter, 'i')) < 0) {
            $(this).fadeOut();
            $('.product-grid').attr('class', 'product-grid-search');
            $('.featured').attr('class', 'item');
        } else {
            $(this).show();
            $('.product-grid-search').attr('class', 'product-grid');
        }
    });
});


//Toggle shopping cart on click

$('#cart-icon').click(function () {
    $('.shopping-cart-container').fadeToggle();
});


