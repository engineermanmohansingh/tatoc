module Tatoc::Views
    def rest
        h1 "Restful"
        br
        script :type=>"text/javascript" do
        "
            function gonext(){
                $.get('#{R(TatocAdvancedRestServiceCheckRegisterN, @session_id)}', function(data){
                        if(data == \"0\"){
                            document.location=\"#{R(TatocAdvancedFileHandle)}\";
                        } else {
                            document.location=\"#{R(TatocError)}\";
                        }
                    });
            }
        "
        end
        style do
        "
        "
        end
        span "Session ID: #{@session_id}", :id=>"session_id"
        br
        br
        a "Proceed", :onclick=>"gonext();", :href=>"#"
        br
        br
        h3 "Instructions"
        ul do
            li do
                span "Steps to proceed:"
                ol do
                    li "Generate Token for current session id using rest service"
                    li "Register for access using generated token and register rest service"
                    li "Click proceed link"
                end
            end
            li "Rest Service to generate token: GET http://#{@config['mysql_user_server']}/tatoc/advanced/rest/service/token/[Session ID] . Response is in JSON"
             li "Rest Service to register for access: POST http://#{@config['mysql_user_server']}/tatoc/advanced/rest/service/register . POST BODY: id=[Session ID], signature=[Token], allow_access=1"
            li "Clicking proceed once register service is called will take you to next page"
            li "In case you are not registered via the register service clicking proceed will display error page"
        end
        br
    end
end
