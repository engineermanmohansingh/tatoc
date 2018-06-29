module Tatoc::Views
    def query_gate
        h1 "Query Gate"
        br
        style do
        "
        .queryform {
            width: 150px;
            padding: 10px;
            text-align: left;
            background: gray;
            color: white;
        }
        .queryform input[type='text'], input[type='password']{
            width: 140px;
        }
        .queryform label{
            font-weight: bold;
        }
        .queryform div{
            font-size: 1.2em;
            font-weight: bold;
            width: 140px;
            text-align: center;
            color: greenyellow;
        }
        "
        end
        div.queryform do
            form :id=>"symbolform", :action => R(TatocAdvancedQueryGate), :method => 'post'do
                label "Symbol:", :for=>"symboldisplay"
                br
                div "#{@symbol.to_s.upcase}", :id=>"symboldisplay", :name=>"symboldisplay"
                input :type=>"hidden", :value=>"#{@symbol}", :id=>"symbol", :name=>"symbol"
                br
                label "Name:", :for=>"name"
                br
                input :type=>"text", :id=>"name", :name=>"name"
                br
                br
                label "PassKey:", :for=>"passkey"
                br
                input :type=>"password", :id=>"passkey", :name=>"passkey"
                br
                br
                center do
                    input :type=>"submit", :id=>"submit", :value=>"Proceed"
                end
            end
        end
        br
        br
        h3 "Instructions"
        ul do
            li do
              span "Query the mysql database at #{@config['mysql_user_server']} to get the Name and PassKey matching the provided Symbol."
              ul do
                li "Mysql Host: #{@config['mysql_user_server']}"
                li "Mysql username/password: #{@config['mysql_user']}/#{@config['mysql_user_password']}"
                li "Database: 'tatoc'"
                li "Tables to query: 'identity' and 'credentials'"
              end
            end
            li "Submit Valid credentials to proceed"
            li "Invalid credentials will display error page"
        end
        br
    end
end
