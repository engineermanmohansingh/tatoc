module Tatoc::Controllers
    class TatocBasicDrag
        
        # GET /tatoc/basic/drag
        def get
            @page_name = "Drag - Basic Course"
            log.info "Controller: #{TatocBasicDrag}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :drag
        end # def get
    
    end # class TatocBasic ... 
    
    class TatocBasicDragFrame
        
        # GET /tatoc/basic/drag/frame
        def get
            @page_name = "Drag Frame - Basic Course"
            log.info "Controller: #{TatocBasicDragFrame}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "raw"
            render :drag_frame
        end # def get
    
    end # class TatocBasic ... 

end # module Tatoc::Controllers
