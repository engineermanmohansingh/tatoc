module Tatoc::Views
    def windows
        h1 "Popup Windows"
        br
        script :type=>"text/javascript" do
            "
                var name = \"\";
                function launchwindow() {
                    window.open(\"#{R(TatocBasicWindowsPopup)}\", \"popup\");
                }
                function gonext() {
                    if(name != \"\") {
                        document.location.href = \"#{R(TatocBasicCookie)}\";
                    } else {
                        document.location.href = \"#{R(TatocError)}\";
                    }
                }        
            "
        end
        a "Launch Popup Window", :href=>"#", :onclick=>"launchwindow();"
        span " | "
        a "Proceed", :href=>"#", :onclick=>"gonext();"
        br
        br
        
        h3 "Instructions"
        ul do
            li "Clicking on 'launch window' link will launch a popup window with a form"
            li "Submit the form with your name to close it"
            li "If the popup window form was submitted properly clicking on 'Proceed' link will take you to next page"
            li "If the popup window form was not submitted properly clicking on 'Proceed' link will take you to Error page"
        end
        br
    end
    
    def windows_popup
        script :type=>"text/javascript" do
        "
            function setName() {
                opener.name = document.getElementById(\"name\").value;
                window.close();
            }
        "
        end
        br
        br
        
        input :id=>"name", :type=>"text", :size=>"20"
        input :id=>"submit", :type=>"button", :onclick=>"setName();", :value=>"Submit"
        br
        br
    end
end
