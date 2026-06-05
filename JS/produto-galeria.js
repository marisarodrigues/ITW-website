$(function () {
    var thumbs = $('.gallery-thumb');
    var currentImage = 0;

    function showImage(index) {
        var thumb;

        if (index < 0) {
            index = thumbs.length - 1;
        }

        if (index >= thumbs.length) {
            index = 0;
        }

        currentImage = index;
        thumb = thumbs.eq(currentImage);

        $('#main-product-image')
            .attr('src', thumb.data('image'))
            .attr('alt', thumb.data('alt'));

        thumbs.removeClass('active');
        thumb.addClass('active');
    }

    thumbs.on('click', function () {
        showImage(thumbs.index(this));
    });

    $('.gallery-arrow').on('mouseenter click', function () {
        var direction = $(this).data('direction');
        showImage(currentImage + (direction === 'next' ? 1 : -1));
    });
});
