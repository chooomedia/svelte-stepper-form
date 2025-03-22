// Create a file ./embed.js for the embed script

(function () {
	// Create iframe element
	const iframe = document.createElement('iframe');
	iframe.id = 'digitalpusher-form-iframe';
	iframe.src = 'https://your-app-url.com'; // Update with actual URL
	iframe.style.width = '100%';
	iframe.style.height = '800px'; // Default height
	iframe.style.border = 'none';
	iframe.style.overflow = 'hidden';

	// Get the element where the form should be embedded
	const target = document.getElementById('digitalpusher-form-container');
	if (target) {
		target.appendChild(iframe);

		// Get computed styles from parent page
		const computedStyle = window.getComputedStyle(document.body);
		const fontFamily = computedStyle.getPropertyValue('font-family');

		// Send font-family to iframe when it's loaded
		iframe.onload = function () {
			iframe.contentWindow.postMessage(
				{
					type: 'FONT_FAMILY',
					fontFamily: fontFamily
				},
				'*'
			);
		};

		// Listen for height changes
		window.addEventListener('message', function (event) {
			if (event.data && event.data.type === 'RESIZE') {
				iframe.style.height = event.data.height + 'px';
			}
		});
	}
})();
