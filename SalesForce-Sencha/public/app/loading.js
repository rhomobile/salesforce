Ext.ns('index', 'Ext.ux');
Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,

    onReady: function() {
			index.Page = new Ext.Panel({
				fullscreen: true,
				scroll: false,
				items: [{
			        cls: 'loading',
			        html: '<div></div>'
			    }]
			});
	    index.Page.show();
			index.Page.setLoading(true);
    }
});