module Tatoc::Views

    # Template
    def layout
        @layout ||="default"
        send("#{@layout}_layout"){yield}
    end
    def default_layout
        html do
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
                
            end # head do
            
            body do
                div.wrapper do
                    div.header do
                        div.title "T.A.T.O.C"
                        div.subtext "Test Automation Training Obstacle Course"
                    end # div.header
                    div.page { self << yield }
                    div.footer do
                        span "TAP Group: "
                        a "<tap@qainfotech.net>", :href=>"mailto:tap@qainfotech.net"
                        span " | Site Admin: Ramandeep "
                        a "<ramandeepsingh@qainfotech.net>", :href=>"mailto:ramandeepsingh@qainfotech.net"
                    end # div.footer
                end # div.wrapper
            end # body do
        end # html do
        
    end #def default_layout

    def minimal_layout
        html do
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
            end # head do
            
            body { self << yield }
        end # html do
        
    end #def minimal_layout

    def raw_layout
        html { self << yield }
        
    end #def raw_layout
    
end # Module Tatoc::Views
