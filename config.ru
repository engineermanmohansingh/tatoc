require './tatoc'
require 'sass/plugin/rack'

# enable SASS for RACK
use Sass::Plugin::Rack

# configure SASS to pick css from correct location
Sass::Plugin.options[:css_location] = "app/public/tatoc/chrome/css"

# configure correct location of chrome & js folders from app/public location
use Rack::Static, :urls => ["/tatoc/chrome", "/tatoc/scripts"], :root => "app/public"

# middleware for db connection 
use ActiveRecord::ConnectionAdapters::ConnectionManagement

# Run migrations
Tatoc::Models.create_schema

run Tatoc
