module Tatoc::Models
  class User < Base
  end

  class UserFields < V 1.0
    def self.up
      create_table User.table_name do |table|
        table.string :email, :name, :password, :api_key
        table.boolean :verified, :default=>false
      end

      # Add admin user
      user = User.new
      user.email = "su@tatoc.tap.qait.com"
      user.name = "Super Admin"
      user.password = Digest::SHA1.hexdigest "qait"
      user.api_key = Digest::SHA256.hexdigest(Digest::SHA1.hexdigest("#{'su@tatoc.tao.qait.com'.to_s.reverse}#{'qait'.to_s.reverse}"))
      user.verified = true
      user.save
    end
  
    def self.down
      drop_table User.table_name
    end
  end
end
