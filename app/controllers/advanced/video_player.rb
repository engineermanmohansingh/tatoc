module Tatoc::Controllers
    class TatocAdvancedVideoPlayer
        
        # GET /tatoc/advanced/video/player
        def get
            @page_name = "Video Player - Advanced Course"
            log.info "Controller: #{TatocAdvancedVideoPlayer}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            videos = ['ByOTNnOTpwhZrIXhaaqtg5ET5qUjWVHX', 'V0OTNnOTpTgJie9ZBpUsRZxHZ4glMWFG', 'J2OTNnOTrfS9pk5ZK_oG0aDStWpO94tt', 'lqYjNnOTpxpttyenx3qihkUWAj0mwNP3']
            @video_id = videos[Random.new.rand(4)]
            render :video_player
        end # def get
    
    end # class TatocBasic ... 
end # module Tatoc::Controllers
