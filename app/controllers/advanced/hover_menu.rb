module Tatoc::Controllers
    class TatocAdvancedHoverMenu
        
        # GET /tatoc/advanced/hover/menu
        def get
            @page_name = "Hover Menu - Advanced Course"
            log.info "Controller: #{TatocAdvancedHoverMenu}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :hover_menu
        end # def get
    
    end # class TatocBasic ... 
end # module Tatoc::Controllers
