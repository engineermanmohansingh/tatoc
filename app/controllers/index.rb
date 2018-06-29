module Tatoc::Controllers
    class TatocIndex < R '/tatoc'
        
        # GET /tatoc/
        def get
            @page_name = "Welcome"
            log.info "Controller: #{TatocIndex}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :homepage
        end # def get
    
    end # class TatocIndex ... 
end # module Tatoc::Controllers
