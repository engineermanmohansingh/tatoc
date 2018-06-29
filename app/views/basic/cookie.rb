module Tatoc::Views
    def cookie
        h1 "Cookie Handling"
        br
        br
        style do
        "
            span#token {
                background-color: #aaa; 
                text-shadow: 0px 0px;
                color: white;
                padding: 10px;
            }
        "
        end
        script :type=>"text/javascript", :src=>"#{self.URL}tatoc/scripts/basic/cookie_md5.js" do
        end
        script :type=>"text/javascript", :src=>"#{self.URL}tatoc/scripts/basic/cookie_tokenizer.js" do
        end
        script :type=>"text/javascript" do
        "
            function generateToken() {
                $(\"#token\").text(\"Token: \" + tokenize());
            }
            function gonext() {
                var cookies = document.cookie;
                var c = \"\";
                var digest = \"\";
                var timestamp = \"\";
                if(cookies.split(\"Token=\")[1]) {
                    c = cookies.split(\"Token=\")[1]
                    if(cookies.split(\"Token=\")[1].split(\";\")[0]) {
                        c = cookies.split(\"Token=\")[1].split(\";\")[0];
                    }
                digest = c.split(\"_\")[0];
                timestamp = c.split(\"_\")[1];
                }
                if(checkTimestamp(timestamp)){
                    if(checkToken(timestamp, digest)){
                        document.location.href=\"#{R(TatocEnd)}\"
                    } else {
                        document.location.href = \"#{R(TatocError)}\";
                    }
                } else {
                    document.location.href = \"#{R(TatocError)}\";
                }
            }
        "
        end        
        a "Generate Token", :href=>"#", :onclick=>"generateToken();"
        span " | "
        a "Proceed", :href=>"#", :onclick=>"gonext();"
        br
        br
        span "Token", :id=>"token"
        br
        br
        
        h3 "Instructions"
        ul do
            li "Clicking on \"Generate Token\" will print token in Token box"
            li "Copy token value and create a Cookie on this page (Token=[VALUE])"
            li "Clicking on 'Proceed' link when Token cookie is set properly and Token is valid will take you to next page"
            li "Clicking on 'Proceed' link when Token cookie is not set properly or Token is not valid will take you to Error page"
        end
        br
    end
end
