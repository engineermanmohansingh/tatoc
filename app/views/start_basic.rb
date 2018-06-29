module Tatoc::Views
    def start_basic
        h1 "Basic Course"
        br
        br
            a "Start Obstacle Course", :href=>R(TatocBasicGridGate)
    end
end
