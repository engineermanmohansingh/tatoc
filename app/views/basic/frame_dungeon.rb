module Tatoc::Views
    def frame_dungeon
        h1 "Frame Dungeon"
        br
        iframe :width=>"260px", :height=>"200px", :id=>"main",
            :src=>"#{R(TatocBasicFrameDungeonMain)}",
            :seamless=>"seamless", :style=>"border:0"
        br
        h3 "Instructions"
        ul do
            li "Click on 'Reload' link to change color 2nd box"
            li "When the color of both boxes are same click 'Proceed' link to move on"
            li "When the color of both boxes does not match 'Proceed' link will take you to Error page"
        end
        br
    end

    def frame_dungeon_child
        head do
            # load jquery min js
            script :type=>"text/javascript",
                :src=>"#{self.URL}tatoc/scripts/jquery-1.8.3.min.js" do
            end
            
            # load Application functions
            script :type=>"text/javascript",
                :src=>"#{self.URL}tatoc/scripts/function.js" do
            end
            
            # load Chrome css and ui js
            link :type => "text/css", :rel => "stylesheet",
                :href => "#{self.URL}tatoc/chrome/css/main.css"
            script :type=>"text/javascript",
                :src=>"#{self.URL}tatoc/chrome/js/ui.js" do
            end
           
            # Page title
            title "#{@page_name} - T.A.T.O.C"
            
            link :type=>"text/css", :rel=> "stylesheet", 
                :href=>"#{self.URL}tatoc/scripts/basic/frame_dungeon.css"
            script :type=>'text/javascript', 
                :src=>"#{self.URL}tatoc/scripts/basic/frame_dungeon.js" do
            end         
        
        end
        body do
            div "Box 2", :id=>"answer"
            script :type=>'text/javascript' do
                "
                    var color = location.href.split('?')[1];
                    if(color == null) {
                        color='white';
                    }
                    document.getElementById('answer').className=color;
                "
            end
        end # body
    end

    def frame_dungeon_main
        head do
            # load jquery min js
            script :type=>"text/javascript",
                :src=>"#{self.URL}tatoc/scripts/jquery-1.8.3.min.js" do
            end
            
            # load Application functions
            script :type=>"text/javascript",
                :src=>"#{self.URL}tatoc/scripts/function.js" do
            end
            
            # load Chrome css and ui js
            link :type => "text/css", :rel => "stylesheet",
                :href => "#{self.URL}tatoc/chrome/css/main.css"
            script :type=>"text/javascript",
                :src=>"#{self.URL}tatoc/chrome/js/ui.js" do
            end
           
            # Page title
            title "#{@page_name} - T.A.T.O.C"
            
            link :type=>"text/css", :rel=> "stylesheet", 
                :href=>"#{self.URL}tatoc/scripts/basic/frame_dungeon.css"
            script :type=>'text/javascript', :src=>"#{self.URL}tatoc/scripts/basic/frame_dungeon.js" do
            end         
        
        end
        body do
            center do
                div "Box 1", :id=>"answer"
                iframe :width=>"120px", :height=>"120px",
                    :id=>"child",
                    :src=>"#{R(TatocBasicFrameDungeonChild)}",
                    :seamless=>"seamless",
                    :style=>"border:0;"
                script :language=>"JavaScript" do
                    "
                        var answercolor = paintanswer();
                        var questioncolor = 'grey';
                        function reloadChildFrame() {
                            questioncolor = paintquestion();
                            document.getElementById('child').src = 'child?' + questioncolor;
                        }
                        function gonext() {
                            if(answercolor == questioncolor){
                                parent.document.location.href = '#{R(TatocBasicDrag)}';
                            } else {
                                parent.document.location.href = '#{R(TatocError)}'
                            }
                        }                
                    "
                end
                script :language=>"JavaScript" do
                    "document.getElementById('answer').className=answercolor;"
                end
                br
                br
                a "Repaint Box 2", :href=>"#",
                    :onClick=>"reloadChildFrame();"
                br
                a "Proceed", :href=>"#",
                    :onClick=>"gonext();"
                
            end # center
        end # body
    end    
end
