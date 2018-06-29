module Tatoc::Controllers
    class TatocEnd
        
        # GET /tatoc/end
        def get
            @page_name = "End"
            log.info "Controller: #{TatocEnd}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :finish
        end # def get
    
    end # class TatocBasic ... 
end # module Tatoc::Controllers
