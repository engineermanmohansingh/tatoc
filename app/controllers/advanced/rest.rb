module Tatoc::Controllers
    class TatocAdvancedRest

        # GET /tatoc/advanced/rest
        def get
            @page_name = "Restful - Advanced Course"
            log.info "Controller: #{TatocAdvancedRest}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            @session_id = rest_session_id
            @config = config
            render :rest
        end # def get

    end # class TatocBasic ...

    class TatocAdvancedRestServiceTokenN

        # GET /tatoc/advanced/rest/service/token/session_id
        def get(session_id)
            log.info "Controller: #{TatocAdvancedRestServiceTokenN}, Method: GET"
            log.debug "Session: #{@state}"
            token_response = rest_generate_token(session_id)
            @headers['Content-Type'] = "application/json"
            return token_response.to_json
        end # def get

    end # class TatocBasic ...

    class TatocAdvancedRestServiceRegister

        # GET /tatoc/advanced/rest/service/register
        def post
            log.info "Controller: #{TatocAdvancedRestServiceRegister}, Method: GET"
            log.debug "Session: #{@state}"
            rest_check_register(input)
        end # def get

    end # class TatocBasic ...

    class TatocAdvancedRestServiceCheckRegisterN

        # GET /tatoc/advanced/rest/service/check/register/session_id
        def get(session_id)
            log.info "Controller: #{TatocAdvancedRestServiceCheckRegisterN}, Method: GET"
            log.debug "Session: #{@state}"
            rest_check_registered(session_id)
        end # def get

    end # class TatocBasic ...

end # module Tatoc::Controllers
