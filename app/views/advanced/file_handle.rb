module Tatoc::Views
    def file_handle
        h1 "File Handle"
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
        "
        end
        a "Download File", :href=>"#{R(TatocAdvancedFileHandleDownload)}"
        br
        br
        br
        form :action => R(TatocAdvancedFileHandle), :method => 'post' do
            label 'Signature', :for => 'signature'
            input :name => 'signature', :id => 'signature', :type => 'text'
            input :type => 'submit', :class => 'submit', :value => 'Proceed'
        end
        br
        br
        h3 "Instructions"
        ul do
            li "Download the file and read 'Signature'"
            li "Submit signature in the form within 30 seconds to proceed"
            li "Incorrect signature or expired signature will display error page"
        end
        br
    end

    def file_handle_download
      "#{@file}"
    end
end
