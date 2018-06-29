module Tatoc::Views
    def hover_menu
        h1 "Hover Menu"
        br
        script :type=>"text/javascript" do
        "
            function gonext(){
                document.location=\"#{R(TatocAdvancedQueryGate)}\";
            }
        "
        end
        style do
        "
            .menutop{
                position: absolute;
                display: block;
                text-align: center;
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-decoration: none;
                background: gray;
                color: #ddd;
                text-shadow: 0px 0px;
                cursor: pointer;
            }
            .menutab{
                position: absolute;
                display: block;
                text-align: center;
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-decoration: none;
                background: gray;
                color: #ddd;
                text-shadow: 0px 0px;
                cursor: pointer;
            }
            
            .m2{
                left: 112px;
            }
            .m3{
                left: 214px;
            }
            .menutop:hover{
                text-decoration: none;
                border: 0px;
                color: white;
                cursor: pointer;
                height: 140px;
                z-index: 900;
            }
            .menutop .menuitem{
                display: none;
            }
            .menutop:hover .menuitem{
                display: block;
            }
            .menuitem:hover{
                background: #aaa;
            }
            .disabled{
                height: 10px;
                line-height: 10px;
            }
            
            .disabled:hover{
                background: gray;
            }            
            .menutop .menutitle{
                color: #ddd;
                cursor: pointer;
            }
            .menutop:hover, .menutitle:hover{
                color: white;
            }
        "
        end
        div "Menu 1", :class=>"menutab"
        div :class=>"menutop m2" do
            span "Menu 2", :class=>"menutitle"
            span "--", :class=>"menuitem disabled"
            span "Menu Item", :class=>"menuitem"
            span " -- ", :class=>"menuitem disabled"
            span "Go Next", :class=>"menuitem", :onclick=>"gonext();"
            span "Item", :class=>"menuitem"
        end
        div "Menu 3", :class=>"menutab m3"
        br
        br
        br
        h3 "Instructions"
        ul do
            li "Select 'Go Next' from 'Menu 2' to proceed"
        end
        br
    end
end
