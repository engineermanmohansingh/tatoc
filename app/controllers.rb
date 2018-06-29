module Tatoc
  # Session
  set :secret, "Rom@n0v"
  include Camping::Session
end

require_all './app/controllers'
