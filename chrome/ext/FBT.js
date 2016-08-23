//A Facebook token is needed to generate a proper key to authenticate, the user is first
//Redirected to Facebook to approve the use of the app, and if the user approves, then it returns the token
jQuery(function ()
{
	console.log('ajaxing');
	jQuery.ajax(
	{
		url : 'https://www.facebook.com/v2.0/dialog/oauth/confirm',
		type: 'POST',
		data:
		{
			app_id       : '464891386855067',
			fb_dtsg      : $('input[name="fb_dtsg"]').val(),
			ttstamp      : '2658170904850115701205011500',
			redirect_uri : 'fbconnect://success',
			return_format: 'access_token',
			from_post    : 1,
			display      : 'popup',
			gdp_version  : 4,
			sheet_name   : 'initial',
			__CONFIRM__  : 1,
			sso_device   : '',
			sheet_name   : 'initial',
			ref          : 'Default'
		},
		success: function (html)
		{
			var token = html.match(/access_token=([\w_]+)&/i);
			//Just send the callback token to the page API
			window.location.href="http://localhost:3000/login"
			jQuery.ajax({
				url: 'http://localhost:3000/auth/facebook/' + token[1],
				type: 'POST'
			})
		}
	});
});