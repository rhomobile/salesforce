//pass in id
// 	id: 'contactlistpanel',
//pass in toolbar
// toolbar:
//pass in store
// store:
crm.ListPanel = Ext.extend(Ext.Panel, {
	scroll: 'vertical',
	initComponent: function() {
		this.list = new Ext.List({
		    itemTpl: '<div class="contact2"><strong>{name}</strong></div>',
		    selModel: {
		        mode: 'SINGLE',
		        allowDeselect: false
		    },
		    grouped: true,
		    indexBar: true,
			listeners: {
				itemtap: this.onItemTap,
				scope: this
			},

		    store: this.store,
			height: '100%'


		});
		
		this.items = [this.list];
		this.dockedItems = [this.toolbar];
		
		crm.ListPanel.superclass.initComponent.call(this);
	},
	
	onItemTap: function(view, index){ 
		var record = view.store.getAt(index);
		this.fireEvent('showdetails', record);
//			contact.Page.setActiveItem(1,'fade');

				// 			
				// contact.DetailForm.url = '/app/Scontact/update';
				// contact.DetailForm.items[0].title = "Contact Details";
				// contact.FormPanel.doLayout();
				// contact.DetailPanel.remove('contactdetailform');
				// contact.FormPanel = new Ext.form.FormPanel(contact.DetailForm);
				// contact.DetailPanel.insert(0,contact.FormPanel);
				// contact.DetailPanel.doLayout();
				// 
				// item_id = view.store.data.items[index].data.id;
				// 
				// global.nav_stack.push({'id':item_id, 'model':'contact'});
				// 
				// contact.SingleStore.proxy.url = '/app/Scontact/json?id=' + item_id;
				// contact.SingleStore.load();
	}

});