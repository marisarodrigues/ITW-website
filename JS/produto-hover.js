$(function () {
    $('.product-hover-gallery').each(function () {
        var image = $(this);
        var images = image.data('images').split('|');
        var currentImage = 0;
        var wrapper;
        var hoverTimer;

        if (images.length < 2 || image.parent('.product-image-switcher').length) {
            return;
        }

        image.wrap('<div class="product-image-switcher"></div>');
        wrapper = image.parent();

        wrapper.append(
            '<button type="button" class="product-image-arrow product-image-prev" data-direction="prev" aria-label="Imagem anterior">' +
                '<span class="glyphicon glyphicon-chevron-left"></span>' +
            '</button>' +
            '<button type="button" class="product-image-arrow product-image-next" data-direction="next" aria-label="Imagem seguinte">' +
                '<span class="glyphicon glyphicon-chevron-right"></span>' +
            '</button>'
        );

        function showImage(direction) {

            if (direction === 'next') {
                currentImage += 1;
            } else {
                currentImage -= 1;
            }

            if (currentImage < 0) {
                currentImage = images.length - 1;
            }

            if (currentImage >= images.length) {
                currentImage = 0;
            }

            image.attr('src', images[currentImage]);
        }

        wrapper.on('click', '.product-image-arrow', function () {
            showImage($(this).data('direction'));
        });

        wrapper.on('mouseenter', function () {
            hoverTimer = setInterval(function () {
                showImage('next');
            }, 900);
        });

        wrapper.on('mouseleave', function () {
            clearInterval(hoverTimer);
        });
    });
});
