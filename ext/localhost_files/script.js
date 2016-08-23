var $siri_classic = document.getElementById('container-classic');
var siri_obj = $($siri_classic);

var am = 0.001;

var SW = new SiriWave({
	width: 259,
	height: 100,
	speed: 0.12,
	amplitude: am,
	container: $siri_classic,
	autostart: true,
});
var si, ci;
var turnOn = function() {
	si = setInterval(function() {
		clearInterval(ci);
		am += 0.05;
		SW.setAmplitude(am);
		siri_obj.css("opacity", am);
		if (am > 1) {
			clearInterval(si);
		}
	}, 50);
};
var turnOff = function() {
	ci = setInterval(function() {
		clearInterval(si);
		am *= 0.85;
		SW.setAmplitude(am);
		siri_obj.css("opacity", am);
		if (am < 0.05) {
			clearInterval(ci);
		}
	}, 50);
};
$('#container-classic').css('opacity', '0');

NProgress.configure({ minimum: 0.45 });
NProgress.start();

$('.deals').jscroll();