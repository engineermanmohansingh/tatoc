module Tatoc::Controllers
    class TatocAdvancedFileHandle

        # GET /tatoc/advanced/file/handle
        def get
            @page_name = "File Handle - Advanced Course"
            log.info "Controller: #{TatocAdvancedFileHandle}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :file_handle
        end # def get

        def post
            @page_name = "File Handle - Advanced Course"
            log.info "Controller: #{TatocAdvancedFileHandle}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            now = Time.now.to_f
            time = input.signature.reverse.to_f
            if(now-time < 30)
                redirect TatocEnd
            else
                redirect TatocError
            end
        end

    end # class TatocBasic ...

    class TatocAdvancedFileHandleDownload

      # GET /tatic/advanced/file/handle/download
      def get
        @page_name = "File Handle Download - Advanced Course"
        log.info "Controller: #{TatocAdvancedFileHandleDownload}, Method: GET"
        log.debug "Session: #{@state}"
        @layout = "raw"
        @headers['Content-Type'] = "application/gzip"
        @headers['Content-Disposition'] = "attachment; filename=\"file_handle_test.dat\""
        @file = File.read("./data/file_handle_test.dat")
        @file.gsub("^SIGN^", Time.now.to_f.to_s.reverse)
        #@file
      end
    end
end # module Tatoc::Controllers
