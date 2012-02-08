



Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,

    onReady: function() {
		if(rho_logged_in() == 1) {
			index.ContactPanel = new contact.Page();

			//			contact_sync_finished();
						account_sync_finished();
						account.AccountList.setLoading(true,true);
			//			contact.ContactList.setLoading(true,true);


        	index.Panel = new crm.MainTabs({
				items: [{
				    title: 'Contacts',
				    items: index.ContactPanel,
					layout: 'fit'
				}, {
				    title: 'Accounts',
				    items: account.Page,
					layout: 'fit'
				}],
			});
			
			tabbar = index.Panel.child('tabbar');
			tabbar.add ({xtype: 'spacer'});
			tabbar.add ({
				text: 'Sync',
				handler: function() {
					//account.AccountList.setLoading(true,true);
					//contact.ContactList.setLoading(true,true);
					rho_sync();
				}
			});

			global.nav_stack.push({'model':'contact'});
			tabbar.doLayout();
		} else {
			login.Page = new Ext.Panel({
				layout:"card",
				cls:'loginPage',
				activeItem:0,
				fullscreen: true,
				cardSwitchAnimation: 'fade',
				scroll: false,
				items: [new login.MainForm()]
			});
		}
    }
});



