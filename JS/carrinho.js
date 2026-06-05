(function () {
    var CART_KEY = 'techzoneCarrinho';
    var COUPON_KEY = 'techzoneCupao';
    var IPCB_COUPON = 'IPCB20';
    var IPCB_DISCOUNT = 0.20;
    var FREE_SHIPPING_LIMIT = 200;
    var SHIPPING_COST = 4.99;

    function parsePrice(priceText) {
        return parseFloat(priceText.replace(' EUR', '').replace(',', '.'));
    }

    function formatPrice(value) {
        return value.toFixed(2).replace('.', ',') + ' EUR';
    }

    function getCart() {
        var savedCart = localStorage.getItem(CART_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();
    }

    function getCartQuantity() {
        return getCart().reduce(function (total, item) {
            return total + item.quantity;
        }, 0);
    }

    function updateCartBadge() {
        var quantity = getCartQuantity();

        $('a[href$="carrinho.html"]').each(function () {
            var link = $(this);
            var badge = link.find('.cart-badge');

            if (!badge.length) {
                badge = $('<span class="cart-badge"></span>');
                link.append(badge);
            }

            if (quantity > 0) {
                badge.text(quantity).show();
            } else {
                badge.hide();
            }
        });
    }

    function getCoupon() {
        return localStorage.getItem(COUPON_KEY) || '';
    }

    function saveCoupon(couponCode) {
        localStorage.setItem(COUPON_KEY, couponCode);
    }

    function clearCoupon() {
        localStorage.removeItem(COUPON_KEY);
    }

    function isValidCoupon(couponCode) {
        return couponCode.toUpperCase() === IPCB_COUPON;
    }

    function moveCartToRight() {
        $('.navbar-collapse').each(function () {
            var navbar = $(this);
            var cartItem = navbar.find('a[href$="carrinho.html"]').closest('li');
            var rightNav = navbar.find('.cart-nav-right');

            if (!cartItem.length) {
                return;
            }

            if (!rightNav.length) {
                rightNav = $('<ul class="nav navbar-nav navbar-right cart-nav-right"></ul>');
                navbar.append(rightNav);
            }

            rightNav.append(cartItem);
        });
    }

    function removeFromCart(productName) {
        var cart = getCart();

        $.each(cart, function (index, item) {
            if (item.name === productName) {
                item.quantity -= 1;
            }
        });

        cart = cart.filter(function (item) {
            return item.quantity > 0;
        });

        saveCart(cart);
        renderCart();
    }

    function increaseCartQuantity(productName) {
        var cart = getCart();

        $.each(cart, function (index, item) {
            if (item.name === productName) {
                item.quantity += 1;
            }
        });

        saveCart(cart);
        renderCart();
    }

    function addToCart(product) {
        var cart = getCart();
        var existingProduct = cart.filter(function (item) {
            return item.name === product.name;
        })[0];

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        saveCart(cart);
    }

    function getProductFromButton(button) {
        var productBox = button.closest('[data-product]');

        if (productBox.length) {
            return {
                name: productBox.data('name'),
                price: parseFloat(productBox.data('price')),
                quantity: 1
            };
        }

        return {
            name: button.data('name'),
            price: parseFloat(button.data('price')),
            quantity: 1
        };
    }

    function showAddedFeedback(button) {
        var originalText = button.html();
        button.html('<span class="glyphicon glyphicon-ok"></span> Adicionado');

        setTimeout(function () {
            button.html(originalText);
        }, 1200);
    }

    function renderCart() {
        var cart = getCart();
        var tableBody = $('#cart-items');
        var subtotalCell = $('#cart-subtotal');
        var discountRow = $('#cart-discount-row');
        var discountCell = $('#cart-discount');
        var shippingCell = $('#cart-shipping');
        var totalCell = $('#cart-total');
        var emptyMessage = $('#cart-empty');
        var checkoutButton = $('#checkout-button');
        var coupon = getCoupon();
        var discount = 0;
        var shipping = 0;
        var total = 0;

        tableBody.empty();

        if (!cart.length) {
            emptyMessage.show();
            checkoutButton.addClass('disabled');
            subtotalCell.text(formatPrice(0));
            discountRow.hide();
            discountCell.text('-' + formatPrice(0));
            shippingCell.text(formatPrice(0));
            totalCell.text(formatPrice(0));
            return;
        }

        emptyMessage.hide();
        checkoutButton.removeClass('disabled');

        $.each(cart, function (index, item) {
            var lineTotal = item.price * item.quantity;
            total += lineTotal;

            tableBody.append(
                '<tr>' +
                    '<td>' + item.name + '</td>' +
                    '<td>' + item.quantity + '</td>' +
                    '<td>' + formatPrice(item.price) + '</td>' +
                    '<td>' + formatPrice(lineTotal) + '</td>' +
                    '<td>' +
                        '<button type="button" class="btn btn-success btn-sm add-one-cart" data-name="' + item.name + '">' +
                            '<span class="glyphicon glyphicon-plus"></span> Adicionar' +
                        '</button> ' +
                        '<button type="button" class="btn btn-danger btn-sm remove-from-cart" data-name="' + item.name + '">' +
                            '<span class="glyphicon glyphicon-minus"></span> Remover' +
                        '</button>' +
                    '</td>' +
                '</tr>'
            );
        });

        subtotalCell.text(formatPrice(total));

        if (isValidCoupon(coupon)) {
            discount = total * IPCB_DISCOUNT;
            discountCell.text('-' + formatPrice(discount));
            discountRow.show();
        } else {
            discountRow.hide();
            discountCell.text('-' + formatPrice(0));
        }

        shipping = total >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_COST;
        shippingCell.text(shipping === 0 ? 'Gratis' : formatPrice(shipping));
        totalCell.text(formatPrice(total - discount + shipping));
    }

    function applyCoupon() {
        var couponInput = $('#coupon-code');
        var couponMessage = $('#coupon-message');
        var couponCode = $.trim(couponInput.val()).toUpperCase();

        if (!couponCode) {
            couponMessage.removeClass('text-success').addClass('text-danger').text('Introduz um código de cupão.');
            return;
        }

        if (isValidCoupon(couponCode)) {
            saveCoupon(couponCode);
            couponInput.val(couponCode);
            couponMessage.removeClass('text-danger').addClass('text-success').text('Cupao IPCB aplicado: 20% de desconto.');
            renderCart();
        } else {
            clearCoupon();
            couponMessage.removeClass('text-success').addClass('text-danger').text('Cupao invalido.');
            renderCart();
        }
    }

    $(function () {
        moveCartToRight();

        $('.add-to-cart').on('click', function (event) {
            event.preventDefault();

            var button = $(this);
            addToCart(getProductFromButton(button));
            showAddedFeedback(button);
        });

        if ($('#cart-items').length) {
            if (getCoupon()) {
                $('#coupon-code').val(getCoupon());
            }

            renderCart();
        }

        updateCartBadge();

        $('#cart-items').on('click', '.remove-from-cart', function () {
            removeFromCart($(this).data('name'));
        });

        $('#cart-items').on('click', '.add-one-cart', function () {
            increaseCartQuantity($(this).data('name'));
        });

        $('#apply-coupon').on('click', function () {
            applyCoupon();
        });

        $('#coupon-code').on('keypress', function (event) {
            if (event.which === 13) {
                event.preventDefault();
                applyCoupon();
            }
        });
    });
}());
