Ext.ns('login', 'Ext.ux');

login.MainForm = Ext.extend(Ext.form.FormPanel, {
	scroll: 'vertical',
	url   : '/app/Settings/do_login',
	baseCls: 'loginForm',
	standardSubmit : false,
	initComponent: function() {   
		this.LoginButton = new Ext.Button({
		    text: 'Login',
			ui: 'confirm',
			margin: '5 25 1 25',
		    iconMask: true,
		    handler: function() {
		        window.location = '/app/Settings/oauth';
			}
		});
		
		this.items =  [{
	        cls: 'loading',
	        html: '<div class="welcome"><header id="header"><p>Please make sure you are connected to the internet and then select the button below to log in</p></header></div><br/><br/>'
	    	}, 
			this.LoginButton
		]; 
		
		login.MainForm.superclass.initComponent.call(this); 
    }
});

