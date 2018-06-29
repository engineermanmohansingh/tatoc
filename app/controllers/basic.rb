module Tatoc::Controllers
    class TatocBasic
        
        # GET /tatoc/basic
        def get
            @page_name = "Basic Course"
            log.info "Controller: #{TatocBasic}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            redirect TatocBasicGridGate
        end # def get
    
    end # class TatocBasic ... 
end # module Tatoc::Controllers
