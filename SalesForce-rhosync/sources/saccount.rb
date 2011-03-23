gem 'soap4r'
require 'defaultDriver'
require 'json'
require 'rest_client'

class Saccount < SourceAdapter
  def initialize(source,credential)
    super(source,credential)
  end
 
  def login

    auth = ClientAuthHeaderHandler.new
    @sessionid = Store.get_value("#{current_user.login}:session")
    auth.sessionid =  @sessionid
    endpoint_url = Store.get_value("#{current_user.login}:endpoint_url")
    @force = Soap.new(endpoint_url)
    @force.headerhandler << auth

    @resturl = endpoint_url.gsub(/services.*/,"services/data/v20.0")
    @restheaders = {
      "Accept" => "*/*", 
      "Authorization" => "OAuth #{@sessionid.split('!')[1]}", 
      "X-PrettyPrint" => "1"
    }
    
    @postheaders = {
      "Accept" => "*/*", 
      "Content-Type" => "application/json", 
      "Authorization" => "OAuth #{@sessionid.split('!')[1]}", 
      "X-PrettyPrint" => "1"
    }
    
    @fields = []
    #puts "#{resturl}/Account/describe/"
    #puts "Authorization: OAuth #{@sessionid.split('!')[1]}"
    parsed=
    JSON.parse(
      RestClient.get(
        "#{@resturl}/sobjects/Account/describe/", 
        @restheaders
      ).body
    )
    
    parsed["fields"].each do |field|
      #puts "#{field["name"]}::#{field["type"]}::#{field["length"]}"
      @fields << field
    end

  end

  def metadata
    show = []
    data = {}
    @fields.each do |f|


      key = "" + f["name"]
      key[0] = key[0,1].downcase
      key = "object" if key == "id"

      data[key] = f

      field = {}
      type = "sfsenchagenericfield"
      xtype = "textfield"
      if f["type"] == "reference"
        type = 'sfsenchalinkfield'
        f["label"].gsub!(/ ID/,"")
      elsif f["type"] == "id"
        xtype = 'hiddenfield'
      end      
      field = {
        :xtype => xtype,
        :label => f["label"],
        :name => "#{key}",
        :type => type,
        :fieldtype => f["type"]
      }
      show << field
    end

    {'showfields' => {:type => 'senchafieldset', :children => show}, 'datafields' => data}.to_json
  end

  def query(params=nil)

    @result = {}

    fieldquery = ""
    @fields.each do |f|
      fieldquery << ",#{f["name"]}"
    end
    fieldquery[0] = " "

    querystr = "SELECT #{fieldquery} from Account"

    requesturl = @resturl + "/query/?q=" + CGI::escape(querystr)

    raw_data = RestClient.get(requesturl, @restheaders) do |response,request, result, &block| 
      case response.code 
      when 200 
        p "It worked !" 
        response.body
      when 400
        p "It failed !"
        p response.body
        raise "400 error"
      end
    end

    parsed_data = JSON.parse raw_data

    parsed_data["records"].each do |a|
      @result[a["Id"]] = {}
      @fields.each do |f|
        key = "" + f["name"]
        key[0] = key[0,1].downcase
        @result[a["Id"]][key] = a[f["name"]]
      end
    end

  end
  
  def sync
    # Manipulate @result before it is saved, or save it 
    # yourself using the Rhosync::Store interface.
    # By default, super is called below which simply saves @result
    super
  end
 
  def create(create_hash,blob=nil)
    # TODO: Create a new record in your backend data source
    # If your rhodes rhom object contains image/binary data 
    # (has the image_uri attribute), then a blob will be provided

  end
 
  def update(update_hash)
    # TODO: Update an existing record in your backend data source
    account = Account.new
    names = update_hash["name"].split(' ') if update_hash["name"]
    
    account.id = update_hash["id"]
    account.firstName = names[0] if update_hash["name"]
    account.lastName = names[1] if update_hash["name"]
    account.phone = update_hash["phone"]
    account.email = update_hash["email"]
    result = @force.update(Update.new([account]))
    #puts result.inspect
 end
 
  def delete(object_id)
    # TODO: write some code here if applicable
    # be sure to have a hash key and value for "object"
    # for now, we'll say that its OK to not have a delete operation
    # raise "Please provide some code to delete a single object in the backend application using the hash values in name_value_list"
  end
 
  def logoff
    # TODO: Logout from the data source if necessary
  end
end