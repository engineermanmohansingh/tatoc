module Tatoc::Views
    def homepage
        h1 "Test Automation Training Obstacle Course"
        br
        br
        a "Basic Course", :href=>R(TatocBasic)
        br
        a "Advanced Course", :href=>R(TatocAdvanced)
    end
end
