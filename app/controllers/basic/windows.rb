module Tatoc::Controllers
    class TatocBasicWindows
        
        # GET /tatoc/basic/windows
        def get
            @page_name = "Windows - Basic Course"
            log.info "Controller: #{TatocBasicWindows}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :windows
        end # def get
    
    end # class TatocBasic ... 
    
    class TatocBasicWindowsPopup
        
        # GET /tatoc/basic/windows/popup
        def get
            @page_name = "Popup - Basic Course"
            log.info "Controller: #{TatocBasicWindowsPopup}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "minimal"
            render :windows_popup
        end # def get
    
    end # class TatocBasic ... 

end # module Tatoc::Controllers
