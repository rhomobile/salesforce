
crm.DetailPanel = Ext.extend(Ext.Panel, {
//	layout: 'fit',
	cls: 'detailpanel',
	//scroll: 'vertical',
	initComponent: function() {
		this.toolbar = new Ext.Toolbar({
			dock: 'bottom',
			items: [
			{
				text: 'Back',
				ui: 'back',
				handler: this.onBackTap,
				scope: this
			},{
				text: 'Clone',
				handler: this.onCloneTap,
				scope: this
			},{
				text: 'Delete',
				handler: this.onDeleteTap,
				scope: this
			}
			]			
		});
		this.dockedItems = [this.toolbar];
		crm.DetailPanel.superclass.initComponent.call(this);
	},
	onBackTap: function() { this.fireEvent('back'); },
	onCloneTap: function() { this.fireEvent('clone'); },
	onDeleteTap: function() { this.fireEvent('delete'); }

});