module Tatoc::Controllers
    class TatocAdvancedQueryGate

        # GET /tatoc/advanced/query/gate
        def get
            @page_name = "Query Gate - Advanced Course"
            log.info "Controller: #{TatocAdvancedQueryGate}, Method: GET"
            log.debug "Session: #{@state}"

            db = Mysql.new(config['mysql_server'], config['mysql_admin'], config['mysql_admin_password'], "tatoc")
            @symbol = "nil"
            symbols = db.query("select symbol from identity where id=#{Random.new.rand(26)+1}")
            symbols.each do |row|
                @symbol = row[0]
            end
            @config = config
            @layout = "default"
            render :query_gate
        end # def get

        def post
            @page_name = "Query Gate - Advanced Course"
            log.info "Controller: #{TatocAdvancedQueryGate}, Method: POST"
            log.debug "Session: #{@state}"
            id = nil
            name = nil
            passkey = nil
            db = Mysql.new(config['mysql_server'], config['mysql_admin'], config['mysql_admin_password'], "tatoc")
            ids = db.query("select id from identity where symbol=\"#{input.symbol}\"")
            ids.each do |row|
                id = row[0]
            end
            creds = db.query("select name,passkey from credentials where id=#{id}")
            creds.each do |row|
                name = row[0]
                passkey = row[1]
            end
            if(name.to_s == input.name.to_s and passkey.to_s == input.passkey.to_s)
                redirect TatocAdvancedVideoPlayer
            else
                redirect TatocError
            end
        end # def post

    end # class TatocBasic ...
end # module Tatoc::Controllers
