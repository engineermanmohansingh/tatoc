module Tatoc::Views
    def drag
        h1 "Drag Around"
        br
        style do
        "
        #dragbox {
            border: 1px solid white;
            width:80px;
            height:20px;
            left: 20px;  
            padding: 5px;
            background: #888;
            color: white;
            text-align: center;
            vertical-align: middle;
        }
        #dropbox{
            width:100px;
            height:50px;
            padding:5px;
            border:4px solid #aaa;
            text-align: center;
            vertical-align: middle; 
            position: relative;
            left: 20px;
 
        }
        "
        end

        br
        div "DROPBOX",
            :id=>"dropbox"
        br
        div "DRAG ME",
            :id=>"dragbox", :width=>"100px", :height=>"50px"
        br
        br
        a "Proceed", :href=>"#", :onclick=>"gonext();"
        br
        script :type=>"text/javascript" do
            "
                function gonext() {
                    var dropboxloc = document.getElementById('dropbox').getBoundingClientRect();
                    var dragboxloc = document.getElementById('dragbox').getBoundingClientRect();
                    if (dropboxloc.top > dragboxloc.top || dropboxloc.bottom < dragboxloc.bottom || 
                        dropboxloc.left > dragboxloc.left || dropboxloc.right < dragboxloc.right){
                            document.location.href = '/tatoc/error';  
                        }
                    else{
                        document.location.href = '/tatoc/basic/windows';                    
                    }
                }           
            "
        end
        script :type=>"text/javascript" do
            "
                $(document).ready(function(){
                    $(\"#dragbox\").draggable();
                });          
            "
        end



        h3 "Instructions"
        ul do
            li "You can Drag and drop the \"DRAG ME\" box"
            li "When the \"DRAG ME\" box is in the cell labeled \"DROPBOX\", click on 'Proceed' link to go to next page"
            li "When the \"DRAG ME\" box is not in the cell labeled \"DROPBOX\" clicking on 'Proceed' link will take you to Error page"
        end
        br
    end
end
