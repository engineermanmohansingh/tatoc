module Tatoc::Controllers
    class TatocAdvanced
        
        # GET /tatoc/basic
        def get
            @page_name = "Advanced Course"
            log.info "Controller: #{TatocAdvanced}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            redirect TatocAdvancedHoverMenu
        end # def get
    
    end # class TatocAdvanced ... 
end # module Tatoc::Controllers
