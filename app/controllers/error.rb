module Tatoc::Controllers
    class TatocError
        
        # GET /tatoc/error
        def get
            @page_name = "Error"
            log.info "Controller: #{TatocError}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :error
        end # def get
    
    end # class TatocBasic ... 
end # module Tatoc::Controllers
