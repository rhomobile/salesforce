require 'rho'
require 'rho/rhocontroller'
require 'rho/rhoerror'
require 'helpers/browser_helper'
require 'json'

class SettingsController < Rho::RhoController
  include BrowserHelper
  
  def index
    @msg = @params['msg']
    render
  end

  def login
    @msg = @params['msg']
    render :action => :login, :back => '/app'
  end

  def login_callback
    errCode = @params['error_code'].to_i
    if errCode == 0
      # run sync if we were successful
      SyncEngine.dosync
    else
      if errCode == Rho::RhoError::ERR_CUSTOMSYNCSERVER
        @msg = @params['error_message']
      end
        
      if !@msg || @msg.length == 0   
        @msg = Rho::RhoError.new(errCode).message
      end
      
    end
    $firstsync = true 
    #WebView.navigate Rho::RhoConfig.start_path
     
  end
  
  def sync_notify
    puts "SYNC NOTIFY"
    if @params['status'] == "ok"
      WebView.execute_js("contact_sync_finished();") if @params["source_name"] == "Scontact"
      WebView.execute_js("account_sync_finished();") if @params["source_name"] == "Saccount"
    end
    
    if @params['status'] == "complete"
      if $firstsync
        $firstsync = false
        WebView.navigate "/app"
      end
    end
    
    if @params['status'] == "error"
      SyncEngine.stop_sync
      Rhom::Rhom.database_fullclient_reset_and_logout
      WebView.navigate '/app'
    end
  end

  def do_login
    if @params['login'] and @params['password']
      begin
        SyncEngine.login(@params['login'], @params['password'], (url_for :action => :login_callback) )
        render :action => :wait
      rescue Rho::RhoError => e
        @msg = e.message
        render :action => :login
      end
    else
      @msg = Rho::RhoError.err_message(Rho::RhoError::ERR_UNATHORIZED) unless @msg && @msg.length > 0
      render :action => :login
    end
  end
  
  def logout
    SyncEngine.logout
    @msg = "You have been logged out."
    render :action => :login
  end
  
  def reset
    render :action => :reset
  end
  
  def do_reset
    Rhom::Rhom.database_full_reset
    SyncEngine.dosync
    @msg = "Database has been reset."
    redirect :action => :index, :query => {:msg => @msg}
  end
  
  def do_sync
    SyncEngine.dosync
    @msg =  "Sync has been triggered."
    redirect :action => :index, :query => {:msg => @msg}
  end
  
  def logged_in
    json = JSON.generate(SyncEngine.logged_in)
    render :string => json
  end

  def oauth
    auth_url = 'https://login.salesforce.com/services/oauth2/authorize?response_type=code'
    client_id = '3MVG9Km_cBLhsuPwdfTV2lWtYcL6T3SRVdPdz2LRPhWEAUC4WxKvhZTXWKrwvIKKLAiQyVvr5EPP4fm1J1kM1'
    redirect_uri = "rhoforce%3A%2Fapp%2FSettings%2Foauth2"
    
    begin
      System.open_url "#{auth_url}&client_id=#{client_id}&redirect_uri=#{redirect_uri}"
    rescue Exception => e
      puts "Error opening WebView to authorization URL: " + e.message
    end
    
  end
  
  def oauth2
    puts 'OAUTH2 FIRED'
    if @params['code']
      begin
        puts "LOGIN"
        SyncEngine.login("", @params['code'], (url_for :action => :login_callback) )
      rescue Rho::RhoError => e
        puts "LOGIN ERROR"
        @msg = e.message
        redirect :action => :oauth
      end
    else
      @msg = "Error getting authorization token. Please try again."
      redirect :action => :index, :query => {:msg => @msg}
    end
    redirect '/app'
  end
  
  
end
