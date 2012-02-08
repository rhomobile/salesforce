Ext.ns('contact');

contact.Page = '';

// model field definition
Ext.regModel('Contact', {
	fields: ['name','id']
});

contact.DataStore = new Ext.data.JsonStore({
	autoDestroy: true,
	autoLoad: true,
	storeId: 'contactStore',

	model: 'Contact',
	sorters: 'name',
	getGroupString : function(record) {
		return record.get('name')[0];
	},
	proxy: {
		type: 'ajax',
		url: '/app/Scontact/json',
		reader: {
			type: 'json',
			root: 'contacts',
			idProperty: 'id'
		}
	},
	idProperty: 'id',
});



Ext.regModel('SingleContact', {
	fields: ['name','phone','email','id', 'account_id']
});

//contact.SingleStore = '';
contact.SingleStore = new Ext.data.JsonStore({
	autoDestroy: true,
	autoLoad: false,	
	storeId: 'singleContactStore',

	model: 'SingleContact',
	sorters: 'name',
	getGroupString : function(record) {
		return record.get('name')[0];
	},
	proxy: {
		type: 'ajax',
		url: '/app/Scontact/json',
		reader: {
			type: 'json',
			root: 'contacts',
			idProperty: 'id'
		}
	},
	idProperty: 'id',
	listeners: {
		load: {
			fn: function(store,array,success) {
				index.ContactPanel.DetailPanel.user = store.data.items[0];
				index.ContactPanel.DetailForm.loadModel(index.ContactPanel.DetailPanel.user);
				index.ContactPanel.fireEvent('onStoreLoaded');
			}
		}
	}
});





function new_contact(clone) {
	global.nav_stack.push({'model':'contact'});
	
	contact.DetailForm.url = '/app/Scontact/create';
	contact.DetailForm.items[0].title = "New contact";
	contact.FormPanel = new Ext.form.FormPanel(contact.DetailForm);
	contact.FormPanel.doLayout();
	contact.FormPanel.reset();

	contact.DetailPanel.remove('contactdetailform');
	contact.DetailPanel.insert(0,contact.FormPanel);
	contact.DetailPanel.doLayout();
	
	if(clone) {
		contact.DetailForm.user.data.object = "";
		contact.FormPanel.loadModel(contact.DetailForm.user);
	}
	
	contact.Page.setActiveItem(1,'fade');
}

function delete_contact() {
	getPage('/app/Scontact/delete?id=' + contact.DetailForm.user.data.object,false);
	contact.DataStore.load();
	contact.ContactList.refresh(); 
	global.nav_stack.push({'model':'contact'});
	navigate(); 
}



contact.DetailForm = {
	id: 'contactdetailform',
    scroll: false,
    url   : '/app/Scontact/update',
    standardSubmit : false,
    items: [
        {
            xtype: 'fieldset',
            title: 'Contact Details',
            instructions: 'Please enter the information above.',
			width: 300,
            defaults: {
//                required: true,
                labelAlign: 'left',
                labelWidth: '35%'
            },
            items: [
            {
                xtype: 'textfield',
                name : 'name',
                label: 'Name',
                useClearIcon: true,
                autoCapitalize : false
            }, {
	            xtype: 'textfield',
	            name : 'phone',
	            label: 'Phone',
	            useClearIcon: true,
	            autoCapitalize : false
	        }, {
                xtype: 'emailfield',
                name : 'email',
                label: 'Email',
                placeHolder: 'john@example.com',
                useClearIcon: true
            }, 	{
                xtype: 'hiddenfield',
                name : 'id',
                label: 'id'
	        }]
        }
    ],
    listeners : {
        submit : function(form, result){
			global.nav_stack.push({'model':'contact'});
			navigate();
			contact.DataStore.load();
			contact.ContactList.refresh(); 
			
        },
        exception : function(form, result){
			global.nav_stack.push({'model':'contact'});
			navigate();
			contact.DataStore.load();
			contact.ContactList.refresh(); 
			
        },
		afterlayout : function() {
			this.items.items[0].items.items.forEach(function(item){
				if(item.link_to && item.link_to != "") {
					if(item.value == "") {
						item.setVisible(false);
					} else {
						item.setVisible(true);
					}
				}
				if(item.name == "object") {
					item.setVisible(false);
				}
			});
		}
    },

    
};

contact.FormPanel = new Ext.form.FormPanel(contact.DetailForm);






contact.Page = Ext.extend (Ext.Panel,{
			layout:"card",
			activeItem:0,
            // fullscreen: true,
			model_name:'contact',
            cardSwitchAnimation: 'fade',
			scroll: false,
			initComponent: function() {
				this.DetailForm = new crm.DetailForm({
					url: '/app/Scontact/update',
					formTitle: 'Contacts',
					formItems: [
		            {
		                xtype: 'textfield',
		                name : 'name',
		                label: 'Name',
		                useClearIcon: true,
		                autoCapitalize : false
		            }, {
			            xtype: 'textfield',
			            name : 'phone',
			            label: 'Phone',
			            useClearIcon: true,
			            autoCapitalize : false
			        }, {
		                xtype: 'emailfield',
		                name : 'email',
		                label: 'Email',
		                placeHolder: 'john@example.com',
		                useClearIcon: true
		            }, 	{
		                xtype: 'hiddenfield',
		                name : 'id',
		                label: 'id'
			        }] 
				});
				
				this.SaveButton = new Ext.Button({
				    text: 'Save changes',
					ui: 'confirm',
					margin: '5 25 1 25',
				    iconMask: true,
				    handler: function() {
				        if(this.DetailForm.user){
				            this.DetailForm.updateRecord(this.DetailForm.user, true);
				        }
				        this.DetailForm.submit({
				            waitMsg : {message:'Submitting', cls : 'demos-loading'}
				        })
					}
				});
				
				this.DetailPanel = new crm.DetailPanel({
					id: 'contactdetail',
					items: [ this.DetailForm, this.SaveButton ]
				});
				
				this.toolbar = new Ext.Toolbar({
					dock: 'bottom',
					items: [
					{
						text: 'New',
						handler: function() {
							new_contact();
						}
					}
					]		
				});
				
				this.ListPanel = new crm.ListPanel({
					id: 'contactlistpanel',	
					toolbar: this.toolbar,
					store: contact.DataStore,
					listeners: {
						showdetails: this.onShowDetails,
						scope: this
					}
				});
				this.items = [this.ListPanel,this.DetailPanel]
				
				
	        	contact.Page.superclass.initComponent.call(this);
			    
			},
			onShowDetails: function(record) {
//				this.DetailForm.loadRecord(record);
//				this.activeRecord = record;
				item_id = record.data.id;
				contact.SingleStore.proxy.url = '/app/Scontact/json?id=' + item_id;
				contact.SingleStore.load();
//				this.layout.setActiveItem(this.DetailPanel, 'slide');
			},			
			onStoreLoaded: function() {
				this.layout.setActiveItem(this.DetailPanel, 'slide');
			}			


});



function contact_sync_finished(){
	contactfields = getPage('/app/Scontact/model',true);
	Ext.regModel('SingleContact', {
		fields: contactfields
	});


	oldurl = contact.SingleStore.proxy.url;
	olddata = contact.DetailForm.user;
	
	contact.SingleStore = new Ext.data.JsonStore({
		autoDestroy: true,
		storeId: 'singleContactStore',

		model: 'SingleContact',
		sorters: 'name',
		getGroupString : function(record) {
			return record.get('name')[0];
		},
		proxy: {
			type: 'ajax',
			url: oldurl,
			reader: {
				type: 'json',
				root: 'contacts',
				idProperty: 'id'
			}
		},
		idProperty: 'id',
		listeners: {
			load: {
				fn: function(store,array,success) {
					contact.DetailForm.user = store.data.items[0];
					contact.FormPanel.loadModel(contact.DetailForm.user);
					contact.Page.show();
					contact.Page.setActiveItem(1,'fade');
				}
			}
		}
	});	
	
	
	
	contact.DetailForm.items[0].items = getPage('/app/Scontact/metafields',true);

	contact.DetailPanel.remove('contactdetailform');
	contact.FormPanel = new Ext.form.FormPanel(contact.DetailForm);
	contact.FormPanel.loadModel(olddata);

	contact.DetailPanel.insert(0,contact.FormPanel);
	contact.DetailPanel.doLayout();
	
	contact.DataStore.load();
	//contact.SingleStore.load();

	contact.ContactList.refresh(); 
	contact.ContactList.setLoading(false,false);
}
