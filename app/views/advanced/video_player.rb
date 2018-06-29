module Tatoc::Views
    def video_player
        h1 "Ooyala Video Player"
        br
        script :type=>"text/javascript" do
        "
            function gonext(){
                if(played==true){
                    document.location=\"#{R(TatocAdvancedRest)}\";
                } else {
                    document.location=\"#{R(TatocError)}\";
                }
                return false;
            }
        "
        end
        style do
        "
        "
        end
        div :id=>'ooyalaplayer', :style=>'width:370px;height:250px'
        script :src=>"http://player.ooyala.com/v3/YmY2Njc1MWJjYzlhODVlMDViMTk4YjFj"
        script do 
        "
            var player = null;
            var played = false;
            OO.ready(function() { 
                player = OO.Player.create(
                    'ooyalaplayer',
                    '#{@video_id}'
                );
                player.mb.subscribe(OO.EVENTS.PLAYED, 'keynote', function(){played=true;});
            });
            
        "
        end
        br
        a "Proceed", :href=>"#", :onclick=>"gonext();"
        br
        h3 "Instructions"
        ul do
            li "Play the video"
            li "When video playback is finished click 'Proceed' to go to next page"
            li "Clicking 'Proceed' when video playback is not completed will display error page"
            li do
                span "Read link for Ooyala Player JS API: "
                ul do
                  li do
                    span "Player API: "
                    a "http://support.ooyala.com/developers/documentation/api/player_v3_apis.html", :href=>"http://support.ooyala.com/developers/documentation/api/player_v3_apis.html"
                  end
                  li do
                    span "Player JS Events:"
                    a "http://support.ooyala.com/developers/documentation/reference/player_v3_dev_pubsub.html", :href=>"http://support.ooyala.com/developers/documentation/reference/player_v3_dev_pubsub.html"
                  end
                end
                
            end
        end
        br
    end
end
