module Tatoc::Controllers
    class TatocBasicGridGate
        
        # GET /tatoc/basic/grid/gate
        def get
            @page_name = "Grid Gate - Basic Course"
            log.info "Controller: #{TatocBasicGridGate}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :grid_gate
        end # def get
    
    end # class TatocBasic ... 
end # module Tatoc::Controllers
