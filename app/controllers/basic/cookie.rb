module Tatoc::Controllers
    class TatocBasicCookie
        
        # GET /tatoc/basic/cookie
        def get
            @page_name = "Cookie Handling - Basic Course"
            log.info "Controller: #{TatocBasicCookie}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :cookie
        end # def get
    
    end # class TatocBasic ... 
end # module Tatoc::Controllers
