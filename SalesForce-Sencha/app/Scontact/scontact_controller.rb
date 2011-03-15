require 'rho/rhocontroller'
require 'helpers/browser_helper'
require 'json'

class ScontactController < Rho::RhoController
  include BrowserHelper
  
  def json
    if @params['id'] && @params['id'] != ""
      @contacts = Scontact.find("{#{@params['id']}}")
      @contacts = [ @contacts ]
    else
      @contacts = Scontact.find(:all)
    end
    temp = []
    if @contacts.length > 1
      @contacts.each do |contact|
        temp << { 
                  :name => contact.name,
                  :id => contact.object 
                }
      end
    else
      meta = Scontact.metadata
      @contacts.each do |contact|
        contact.vars.each do |k,v| 
          key = k.to_s.strip
          if meta['datafields'][key] && meta['datafields'][key]["type"] == "reference"
            begin
              model = Object.const_get("S#{Scontact.metadata['datafields'][key]["referenceTo"][0].downcase}".to_sym)
              contact.vars[k] = model.find(v).name
            rescue Exception => e
            end
          end
        end
        temp << contact.vars
      end
    end


    all = { :contacts => temp }
    render :string => ::JSON.generate(all)
    
  end
  
  def id_for_field
    contact = Scontact.find("{#{@params['id']}}")
    id = ""
    puts contact.inspect
    if contact
      id = contact.vars[@params["name"].to_sym]
    end
    puts id
    render :string => ::JSON.generate(id)
  end
  
  def metafields
    metadata = render_metadata('showfields')
    metadata = "[]" if metadata.nil? or metadata == ""
    render :string => metadata
  end
  
  def model
    contact = Scontact.find(:first)
    vars = contact.vars if contact 
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

  #GET /Scontact
  def index
    if @params["account"]
       @scontacts = Scontact.find(:all, :conditions => {'account_id' => @params["account"]})
     else
       @scontacts = Scontact.find(:all)
     end
     render
  end

  # GET /Scontact/{1}
  def show
    @scontact = Scontact.find(@params['id'])
    if @scontact
      @saccount = Saccount.find(@scontact.account_id)
      render :action => :show
    else
      redirect :action => :index
    end
  end

  # GET /Scontact/new
  def new
    @scontact = Scontact.new
    render :action => :new
  end

  # GET /Scontact/{1}/edit
  def edit
    @scontact = Scontact.find(@params['id'])
    if @scontact
      render :action => :edit
    else
      redirect :action => :index
    end
  end

  # POST /Scontact/create
  def create
    @params.reject! do |k,v|
      k == "object"
    end
    puts @params.inspect
    @scontact = Scontact.create(@params)
    render :string => "0"
  end

  # POST /Scontact/{1}/update
  def update
    @scontact = Scontact.find(@params['object'])
    
    @params.reject! do |k,v|
      k == "object"
    end
    
    @scontact.update_attributes(@params) if @scontact
    SyncEngine.dosync
    
    render :string => "0"
  end

  # POST /Scontact/{1}/delete
  def delete
    @scontact = Scontact.find(@params['id'])
    @scontact.destroy if @scontact
    redirect :action => :index
  end
end
