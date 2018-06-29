# Camping
require 'camping'

# Start App
Camping.goes :Tatoc

# Gems
require 'require_all'
require 'yaml'
require 'json'
require 'camping/session'
require 'pony'
require 'logger'
require 'base64'
require 'cgi'
require 'digest/sha1'
require 'mysql'
require 'uuid'
require 'active_support'

# Modules
require './app/helpers'
require './app/controllers'
require './app/views'
require './app/models'

# DB Connection
Tatoc::Models::Base.establish_connection(
  :adapter => 'sqlite3',
  :database => './data/camping.db'
)

# DB Migration
def Tatoc.create
  Tatoc::Models.create_schema
end
