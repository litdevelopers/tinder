Lit.Facebook = (function (Lit)
{
	//This redirects the current tab to a Facebook authorization page, nothing is done until the user authorizes the app
	function openAuthTab(tab)
	{
		chrome.tabs.update(tab,
			{
				url: 'https://www.facebook.com/v2.0/dialog/oauth?response_type=token&display=popup&api_key=464891386855067&redirect_uri=fbconnect%3A%2F%2Fsuccess&scope=user_about_me%2Cuser_activities%2Cuser_education_history%2Cuser_location%2Cuser_photos%2Cuser_relationship_details%2Cuser_status'
			});
	}

	function chromeListener()
	{
		chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse)
		{
			if (request.type === 'doAuth')
			{
				openAuthTab(sender.tab.id);
			}
			else if (request.message == "exists")
			{
				sendResponse(
				{
					version: 1.1
				});
			}
		});
	}

	return{
		openAuthTab: openAuthTab,

		init: function ()
		{
			chromeListener();
		}
	};
})(Lit);