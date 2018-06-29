module Tatoc::Views
    def error
        h1.error "Error"
        br
        span.error "The page you are looking for does not exist"
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
