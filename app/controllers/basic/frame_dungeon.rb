module Tatoc::Controllers
    class TatocBasicFrameDungeon
        
        # GET /tatoc/basic/frame/dungeon
        def get
            @page_name = "Frame Dungeon - Basic Course"
            log.info "Controller: #{TatocBasicFrameDungeon}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "default"
            render :frame_dungeon
        end # def get
    
    end # class TatocBasicFrameDungeon 

    class TatocBasicFrameDungeonMain
        
        # GET /tatoc/basic/frame/dungeon/main
        def get
            @page_name = "Frame Dungeon Main - Basic Course"
            log.info "Controller: #{TatocBasicFrameDungeonMain}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "raw"
            render :frame_dungeon_main
        end # def get
    
    end # class TatocBasicFrameDungeonMain

    class TatocBasicFrameDungeonChild
        
        # GET /tatoc/basic/frame/dungeon/child
        def get
            @page_name = "Frame Dungeon Child - Basic Course"
            log.info "Controller: #{TatocBasicFrameDungeonChild}, Method: GET"
            log.debug "Session: #{@state}"
            @layout = "raw"
            render :frame_dungeon_child
        end # def get
    
    end # class TatocBasicFrameDungeonChild

end # module Tatoc::Controllers
