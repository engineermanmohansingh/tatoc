module Tatoc::Views
    def grid_gate
        h1 "Grid Gate"
        script do
            "
            function passthru() {
                document.location = \"#{R(TatocBasicFrameDungeon)}\";
            }
            function failthru() {
                document.location = \"#{R(TatocError)}\";
            }

            function printgrid() {
                var clickcell = Math.floor(Math.random()*16) + 1;
                var grid = \"\";
                grid += \"<table>\";
                for(var i=0; i<4; i++){
                    grid += \"<tr>\";
                    for(var j=0; j<4; j++) {
                        if(clickcell == (i*4) + j + 1 ) {
                            grid += \"<td><div class='greenbox' onClick=passthru();></div></td>\";
                        } else {
                            grid += \"<td><div class='redbox' onClick=failthru();></div></td>\";
                        }
                    }
                    grid += \"</tr>\";
                }
                grid +=\"</table>\";
                document.write(grid);
            }
            "
        end
        style :type=>"text/css" do
            "            table{
                border: 0px solid black;
            }
            td {
                border: 0px solid black;
                height: 50px;
                width: 50px;
                padding: 0px;
            }
            div.redbox {
                width: 100%;
                height:100%;
                background-color:red;
            }
            div.greenbox {
                width: 100%;
                height:100%;
                background-color:green;
            }"
        end
        br
        br
        script "printgrid();"
        br
        h3 "Instructions"
        ul do
            li "Click on Green Box to proceed to next page"
            li "Clicking on Red Box will take you to Error Page"
        end
        br
    end
end
