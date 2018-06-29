module Tatoc::Views
    def finish
        h1.finish "End"
        br
        span.finish "Obstacle Course is Complete!"
        br
        br
        br
        br
        a "Basic Course", :href=>R(TatocBasic)
        br
        a "Advanced Course", :href=>R(TatocAdvanced)
        br
        br
    end
end
