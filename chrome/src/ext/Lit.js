var Lit = (function ()
{
	//The whole purpose of this extension is to get a token to enable authenthication and to provide a quick access to Lit
	var url = 'http://localhost:3000/login';

	function newTab(tab)
	{
		if (tab)
		{
			chrome.tabs.update(tab,
				{
					url: url
				});
		}
		else
		{
			chrome.tabs.create(
				{
					url: url
				});
		}
	}

	function chromeListener()
	{
		chrome.browserAction.onClicked.addListener(function ()
		{
			newTab();
		});
	}

	return{
		newTab: newTab,

		init: function ()
		{
			Lit.Facebook.init();
			chromeListener();
		}
	};
})();