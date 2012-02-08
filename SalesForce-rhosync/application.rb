

class Application < Rhosync::Base
  class << self
    def authenticate(username,password,session)
      
      puts "USER: #{username}, token: #{password}"
      begin
        requesturl = "https://login.salesforce.com/services/oauth2/token"
        params = "code=" + password
        params += "&grant_type=authorization_code"
        params += "&client_id=" + Application.get_settings[:oauth_id]
        params += "&client_secret=" + Application.get_settings[:oauth_secret].to_s
        params += "&redirect_uri=" + "rhoforce%3A%2Fapp%2FSettings%2Foauth2"
      
        headers = {
          "Accept" => "*/*", 
          "X-PrettyPrint" => "1"
        }
        
        data = JSON.parse(RestClient.post(requesturl, params, headers))
        puts "Logged in"
        headers["Authorization"] = "OAuth #{data["access_token"].split('!')[1]}" 
        
        id_data = JSON.parse(RestClient.get(data["id"],headers))
        
        username = id_data["username"] 
        
        Store.put_value("#{username}:endpoint_url",data["instance_url"])
        Store.put_value("#{username}:refresh_token",data["refresh_token"])
        Store.put_value("#{username}:session",data["access_token"])
        Store.put_value("#{username}:uid",id_data["user_id"])
        
        success = username
      rescue Exception => e
        puts "LOGIN ERROR"
        puts e.inspect
        puts e.backtrace.join("\n")
        raise e
      end
      success     
    end
    
    # Add hooks for application startup here
    # Don't forget to call super at the end!
    def initializer(path)
      super
    end

    def get_settings
      return @settings if @settings
      begin
        file = YAML.load_file(File.join(ROOT_PATH,'settings','settings.yml'))
        env = (ENV['RHO_ENV'] || :development).to_sym
        @settings = file[env]
      rescue Exception => e
        puts "Error opening settings file: #{e}"
        puts e.backtrace.join("\n")
        raise e
      end
    end
    
    # Calling super here returns rack tempfile path:
    # i.e. /var/folders/J4/J4wGJ-r6H7S313GEZ-Xx5E+++TI
    # Note: This tempfile is removed when server stops or crashes...
    # See http://rack.rubyforge.org/doc/Multipart.html for more info
    # 
    # Override this by creating a copy of the file somewhere
    # and returning the path to that file (then don't call super!):
    # i.e. /mnt/myimages/soccer.png
    def store_blob(blob)
      super #=> returns blob[:tempfile]
    end
  end
  
  
end

Application.initializer(ROOT_PATH)