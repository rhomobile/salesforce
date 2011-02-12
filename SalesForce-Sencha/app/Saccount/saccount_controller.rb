require 'rho/rhocontroller'
require 'helpers/browser_helper'
require 'json'

class SaccountController < Rho::RhoController
  include BrowserHelper
  
  def json
    if @params['id'] && @params['id'] != ""
      @accounts = Saccount.find("{#{@params['id']}}")
      @accounts = [ @accounts ]
    else
      @accounts = Saccount.find(:all)
    end
    temp = []
    if @accounts.length > 1
      @accounts.each do |account|
        temp << { 
                  :name => account.name,
                  :id => account.object 
                }
      end
    else
      meta = Saccount.metadata
      @accounts.each do |account|
        account.vars.each do |k,v| 
          key = k.to_s.strip
          if meta['datafields'][key] && meta['datafields'][key]["type"] == "reference"
            begin
              model = Object.const_get("S#{Saccount.metadata['datafields'][key]["referenceTo"][0].downcase}".to_sym)
              account.vars[k] = model.find(v).name
            rescue Exception => e
            end
          end
        end
        temp << account.vars
      end
    end


    all = { :accounts => temp }
    render :string => ::JSON.generate(all)
    
  end
  
  def metafields
    metadata = render_metadata('showfields')
    metadata = "[]" if metadata.nil? or metadata == ""
    render :string => metadata
  end
  
  def model
    account = Saccount.find(:first)
    vars = account.vars if account 
    keys = vars.nil? ? [] : vars.keys
    render :string => ::JSON.generate(keys)
  end

  def get_model_value(string)
    params = string.split(',')
    model = params[0]
    id = params[1]
    key = params[2]
    
    model = Object.const_get(model.to_sym)
    model.find(id).vars[key]
  end

  #GET /Saccount
  def index
    if @params["account"]
       @saccounts = Saccount.find(:all, :conditions => {'account_id' => @params["account"]})
     else
       @saccounts = Saccount.find(:all)
     end
     render
  end

  # GET /Saccount/{1}
  def show
    @saccount = Saccount.find(@params['id'])
    if @saccount
      @saccount = Saccount.find(@saccount.account_id)
      render :action => :show
    else
      redirect :action => :index
    end
  end

  # GET /Saccount/new
  def new
    @saccount = Saccount.new
    render :action => :new
  end

  # GET /Saccount/{1}/edit
  def edit
    @saccount = Saccount.find(@params['id'])
    if @saccount
      render :action => :edit
    else
      redirect :action => :index
    end
  end

  # POST /Saccount/create
  def create
    @saccount = Saccount.create(@params['saccount'])
    redirect :action => :index
  end

  # POST /Saccount/{1}/update
  def update
    @saccount = Saccount.find(@params['object'])
    
    @params.reject! do |k,v|
      k == "object"
    end
    
    @saccount.update_attributes(@params) if @saccount
    SyncEngine.dosync
    render :string => "0"
  end

  # POST /Saccount/{1}/delete
  def delete
    @saccount = Saccount.find(@params['id'])
    @saccount.destroy if @saccount
    redirect :action => :index
  end
end
