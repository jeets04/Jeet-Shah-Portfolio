(function ($) {

	var $window = $(window),
		$head = $('head'),
		$body = $('body'),
		$preloader = $('.preloader');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px'],
		'xlarge-to-max': '(min-width: 1681px)',
		'small-to-xlarge': '(min-width: 481px) and (max-width: 1680px)'
	});

	// Handle preloader
	$window.on('load', function () {
		// Remove preload class from body
		$body.removeClass('is-preload');
		
		// Fade out preloader
		setTimeout(function() {
			$preloader.addClass('fade-out');
			setTimeout(function() {
				$preloader.hide();
			}, 500);
		}, 500);
	});

	// ... stopped resizing.
	var resizeTimeout;

	$window.on('resize', function () {

		// Mark as resizing.
		$body.addClass('is-resizing');

		// Unmark after delay.
		clearTimeout(resizeTimeout);

		resizeTimeout = setTimeout(function () {
			$body.removeClass('is-resizing');
		}, 100);

	});

	// Fixes.

	// Object fit images.
	if (!browser.canUse('object-fit')
		|| browser.name == 'safari')
		$('.image.object').each(function () {

			var $this = $(this),
				$img = $this.children('img');

			// Hide original image.
			$img.css('opacity', '0');

			// Set background.
			$this
				.css('background-image', 'url("' + $img.attr('src') + '")')
				.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
				.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

		});

	// Sidebar.
	var $sidebar = $('#sidebar'),
		$sidebar_inner = $sidebar.children('.inner');

	// Initialize sidebar based on page type
	if ($body.hasClass('is-homepage')) {
		// On homepage, sidebar starts inactive
		$sidebar.addClass('inactive');
		
		// Add toggle button
		$('<a href="#sidebar" class="toggle" style="margin-top: 23px;">Toggle</a>')
			.appendTo($sidebar)
			.on('click', function (event) {
				event.preventDefault();
				event.stopPropagation();
				$sidebar.toggleClass('inactive');
			});
	} else {
		// On other pages, sidebar is always visible on large screens
		if (breakpoints.active('>large')) {
			$sidebar.removeClass('inactive');
		}
	}

	// Handle sidebar on window resize
	breakpoints.on('<=large', function () {
		if (!$body.hasClass('is-homepage')) {
			$sidebar.addClass('inactive');
		}
	});

	breakpoints.on('>large', function () {
		if (!$body.hasClass('is-homepage')) {
			$sidebar.removeClass('inactive');
		}
	});

	// Hack: Workaround for Chrome/Android scrollbar position bug.
	if (browser.os == 'android'
		&& browser.name == 'chrome')
		$('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
			.appendTo($head);

	// Events.

	// Link clicks.
	$sidebar.on('click', 'a', function (event) {

		// >large? Bail.
		if (breakpoints.active('>large'))
			return;

		// Vars.
		var $a = $(this),
			href = $a.attr('href'),
			target = $a.attr('target');

		// Prevent default.
		event.preventDefault();
		event.stopPropagation();

		// Check URL.
		if (!href || href == '#' || href == '')
			return;

		// Hide sidebar.
		$sidebar.addClass('inactive');

		// Redirect to href.
		setTimeout(function () {

			if (target == '_blank')
				window.open(href);
			else
				window.location.href = href;

		}, 500);

	});

	// Prevent certain events inside the panel from bubbling.
	$sidebar.on('click touchend touchstart touchmove', function (event) {

		// >large? Bail.
		if (breakpoints.active('>large'))
			return;

		// Prevent propagation.
		event.stopPropagation();

	});

	// Hide panel on body click/tap.
	$body.on('click touchend', function (event) {

		// >large? Bail.
		if (breakpoints.active('>large'))
			return;

		// Deactivate.
		$sidebar.addClass('inactive');

	});

	// Scroll lock.
	// Note: If you do anything to change the height of the sidebar's content, be sure to
	// trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

	$window.on('load.sidebar-lock', function () {

		var sh, wh, st;

		// Reset scroll position to 0 if it's 1.
		if ($window.scrollTop() == 1)
			$window.scrollTop(0);

		$window
			.on('scroll.sidebar-lock', function () {

				var x, y;

				// <=large? Bail.
				if (breakpoints.active('<=large')) {

					$sidebar_inner
						.data('locked', 0)
						.css('position', '')
						.css('top', '');

					return;

				}

				// Calculate positions.
				x = Math.max(sh - wh, 0);
				y = Math.max(0, $window.scrollTop() - x);

				// Lock/unlock.
				if ($sidebar_inner.data('locked') == 1) {

					if (y <= 0)
						$sidebar_inner
							.data('locked', 0)
							.css('position', '')
							.css('top', '');
					else
						$sidebar_inner
							.css('top', -1 * x);

				}
				else {

					if (y > 0)
						$sidebar_inner
							.data('locked', 1)
							.css('position', 'fixed')
							.css('top', -1 * x);

				}

			})
			.on('resize.sidebar-lock', function () {

				// Calculate heights.
				wh = $window.height();
				sh = $sidebar_inner.outerHeight() + 30;

				// Trigger scroll.
				$window.trigger('scroll.sidebar-lock');

			})
			.trigger('resize.sidebar-lock');

	});
	// Modal functionality
	document.addEventListener('DOMContentLoaded', function () {
		var triggers = document.getElementsByClassName('modal-trigger');
		var closes = document.getElementsByClassName('close');
		var galleryTrigger = document.querySelector('.gallery-trigger');
		var galleryModal = document.getElementById('gallery-modal');

		// Gallery modal open
		galleryTrigger.addEventListener('click', function (e) {
			e.preventDefault();
			galleryModal.style.display = 'block';
			setTimeout(() => {
				galleryModal.classList.add('show');
			}, 10);
		});

		// Modal triggers
		Array.from(triggers).forEach(function (trigger) {
			trigger.addEventListener('click', function (e) {
				e.preventDefault();
				var modalId = this.getAttribute('data-modal');
				var modal = document.getElementById(modalId);

				// If clicked from gallery, close gallery first
				if (this.closest('.gallery-modal')) {
					galleryModal.classList.remove('show');
					setTimeout(() => {
						galleryModal.style.display = 'none';
						modal.style.display = 'block';
						setTimeout(() => {
							modal.classList.add('show');
						}, 10);
					}, 300);
				} else {
					modal.style.display = 'block';
					setTimeout(() => {
						modal.classList.add('show');
					}, 10);
				}
			});
		});

		// Close buttons
		Array.from(closes).forEach(function (close) {
			close.addEventListener('click', function () {
				var modal = this.closest('.modal');
				modal.classList.remove('show');
				setTimeout(() => {
					modal.style.display = 'none';
				}, 300);
			});
		});

		// Close when clicking outside
		window.addEventListener('click', function (e) {
			if (e.target.classList.contains('modal')) {
				var modal = e.target;
				modal.classList.remove('show');
				setTimeout(() => {
					modal.style.display = 'none';
				}, 300);
			}
		});
	});
	// Menu.
	var $menu = $('#menu'),
		$menu_openers = $menu.children('ul').find('.opener');

	// Openers.
	$menu_openers.each(function () {

		var $this = $(this);

		$this.on('click', function (event) {

			// Prevent default.
			event.preventDefault();

			// Toggle.
			$menu_openers.not($this).removeClass('active');
			$this.toggleClass('active');

			// Trigger resize (sidebar lock).
			$window.triggerHandler('resize.sidebar-lock');

		});

	});

})(jQuery);