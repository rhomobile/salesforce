Ext.ns('login', 'Ext.ux');

login.LoginButton = new Ext.Button({
    text: 'Login',
	ui: 'confirm',
	margin: '5 25 1 25',
    iconMask: true,
    handler: function() {
        window.location = '/app/Settings/oauth';
	}
});
login.LoginForm = {
	scroll: 'vertical',
	url   : '/app/Settings/do_login',
	standardSubmit : false,
	items: [{
        cls: 'loading',
        html: '<div><h1>Rhoforce</h1><p>Please make sure you are connected to the internet, and then select the login button to log in to your Salesforce account</p></div>'
    }, 
	login.LoginButton
	]
};

login.MainForm = new Ext.form.FormPanel(login.LoginForm);

