Ext.ns('index', 'Ext.ux');

index.MainTabs = {
    fullscreen: true,
    type: 'dark',
    sortable: true,
	width: '100%',
	height: '100%',
    items: [{
        title: 'Contacts',
        items: contact.Page,
		layout: 'fit'
    }, {
        title: 'Accounts',
        items: account.Page,
		layout: 'fit'
    }]
};

Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,

    onReady: function() {
		if(rho_logged_in() == 1) {
			contact_sync_finished();
			account.AccountList.setLoading(true,true);
			contact.ContactList.setLoading(true,true);
			//rho_sync();

        	index.Panel = new Ext.TabPanel(index.MainTabs);
			tabbar = index.Panel.child('tabbar');
			tabbar.add ({xtype: 'spacer'});
			tabbar.add ({
				text: 'Sync',
				handler: function() {
					account.AccountList.setLoading(true,true);
					contact.ContactList.setLoading(true,true);
					rho_sync();
				}
			});
			tabbar.doLayout();
		} else {
			//login.LoginForm.fullscreen = true;
			login.Page = new Ext.Panel({
				layout:"card",
				activeItem:0,
				fullscreen: true,
				cardSwitchAnimation: 'slide',
				scroll: false,
				items: [login.MainForm]
			});
	        login.Page.show();
		}
    }
});



