module Tatoc::Helpers
  # Read and return app config from yaml
  def config
    YAML.load_file("./tatoc_config.yaml")
  end

  # Logger
  def log
    log = Logger.new(config['LOG_FILE_PATH'], 2, 10240)
  end

  # Application mode
  def app_mode_debug?
    config['APP_MODE'].to_s.downcase == "debug"
  end

  # create session id
  def rest_session_id
    uuid = UUID.new.generate
    timestamp = Time.now.to_i
    db = Mysql.new(config['mysql_server'], config['mysql_admin'], config['mysql_admin_password'], "tatoc")
    db.query("insert into rest values('','#{uuid}',NULL,NULL,#{timestamp},NULL)")
    ids = db.query("select id from rest where uuid=\"#{uuid}\"")
    id = nil
    ids.each do |row|
      id = row[0]
    end
    id
  end

  # generate rest private key
  def rest_generate_token(id)
    db = Mysql.new(config['mysql_server'], config['mysql_admin'], config['mysql_admin_password'], "tatoc")
    uuid = nil
    rows = db.query("select uuid from rest where id=#{id}")
    rows.each do |row|
      uuid = row[0]
    end
    if uuid == nil
      response = Hash.new
      response['error']="Invalid Session ID"
      return response
    end
    timestamp = Time.now.to_i
    private_key = Digest::MD5.hexdigest("#{uuid}#{timestamp}")

    db.query("update rest set private_key=\"#{private_key}\", key_generated_at=#{timestamp} where id=#{id}")
    response = Hash.new
    response['token']=private_key
    response['expires']=timestamp + 30
    response
  end

  # check register post response
  def rest_check_register(input)
    db = Mysql.new(config['mysql_server'], config['mysql_admin'], config['mysql_admin_password'], "tatoc")
    response = "0"
    timestamp = Time.now.to_i
    rows = db.query("select * from rest where id=#{input.id}")
    rows.each do |row|
      generated_signature = row[2]
      if input.signature == generated_signature
        if row[3].to_i >= timestamp-30
          if input.allow_access == "1"
            db.query("update rest set allow_pass=1 where id=#{input.id}")
          else
            response = "3 - Incorrect 'allow_access' value"
          end
        else
          response = "2 - Token expired"
        end
      else
        response = "1 - Token mismatch"
      end
    end
    response
  end

  # check registered
  def rest_check_registered(session_id)
    db = Mysql.new(config['mysql_server'], config['mysql_admin'], config['mysql_admin_password'], "tatoc")
    response = "0"
    rows = db.query("select * from rest where id=#{session_id}")
    rows.each do |row|
      if(row[5].to_s=="1")
        return "0"
      else
        return "1"
      end
    end
    "1"
  end

  # Create new user session
  def create_session user_id
    @state.user_id = user_id
  end

  # End user session
  def kill_session
    @state.user_id = nil
  end

  def is_session_active?
    # IF
    #   user from cookie is identifiable
    # THEN
    #   user is logged in
    if(@state.user_id)
      if get_user
        return true
      else
        return false
      end
    end
    false
  end

  def get_user
    Tatoc::Models::User.find_by_id @state.user_id
  end

  def generate_emailverification_signature user
    tnow = Time.now
    Digest::SHA1.hexdigest("#{user.email}.#{user.password}.#{tnow.to_i.to_s}")+"-#{tnow.to_i.to_s.reverse}-#{user.id}"
  end

  def generate_recover_password_signature user
    tnow = Time.now
    Digest::SHA1.hexdigest("#{user.email}.#{user.password}.#{tnow.to_i.to_s}")+"-#{tnow.to_i.to_s.reverse}-#{user.id}"
  end

  def verify_emailverification_signature user, signature
  tsign = signature.split(/-/)[1].reverse
  Digest::SHA1.hexdigest("#{user.email}.#{user.password}.#{tsign}").to_s ==
  signature.split(/-/)[0].to_s
  end

  def verify_recover_password_signature user, signature
    tsign = signature.split(/-/)[1].reverse
    Digest::SHA1.hexdigest("#{user.email}.#{user.password}.#{tsign}").to_s ==
    signature.split(/-/)[0].to_s
  end

  def verify_ws_signature user, signature
    expires = signature.split("-")[1]
    challenge = ""
    if user == nil
      return "2 - Invalid User - Auth Failed"
    elsif Time.now.to_i - expires.to_i > 20
      return "1 - ERROR: Invalid Signature - Signature expired"
    else
      s = "#{user['api_key']}#{user['email']}#{expires}"
      challenge = "#{Digest::SHA1.hexdigest s}-#{expires}"
      if challenge == signature
        return "0"
      else
        return "1 - ERROR: Invalid Signature - Signature mismatch"
      end
    end
    "0"
  end

  def is_valid_service_sharedkey_signature(sign)
    #return true
    digest = sign.split("-")[0]
    timestamp = sign.split("-")[1]
    shared_secret = config['SHARED_SECRET']

    now = Time.now.to_i
    if(now-timestamp.to_i < 30)
      temp = Digest::SHA1.hexdigest("#{shared_secret}#{timestamp}".reverse)
      return true if temp == digest
    end
    return false
  end

  def send_verification_email user, signature
    body = "Hello #{user.name}, <br/><br/>Thank you for registering to Vyom. Please click the link below to confirm your email address and activate your account. This link will expire in 24 hours. <br /><br /> <a href='#{self.URL}vyom/verifyuser/#{signature}'>#{self.URL}vyom/verifyuser/#{signature}</a><br /><br />Best regards,<br/> Vyom"
    Pony.mail({
      :to => user.email.to_s,
      :from => 'no-reply@vyom.qait.com',
      :subject => 'Vyom: Account verification',
      :html_body => body,
      :via => :sendmail,
      :via_options => {
      :location  => '/usr/sbin/sendmail',
      :arguments => '-t'
      }
    })
  end

  def send_recover_password_email user, signature
    body = "Hello #{user.name}, <br/><br/>Please click the link below to recover your account password. This link will expire in 30 minutes. <br /><br /> <a href='#{self.URL}vyom/recoverpassword/#{signature}'>#{self.URL}vyom/recoverpassword/#{signature}</a><br /><br />Best regards,<br/> Vyom"
    Pony.mail({
      :to => user.email.to_s,
      :from => 'no-reply@vyom.qait.com',
      :subject => 'Vyom: Recover account',
      :html_body => body,
      :via => :sendmail,
      :via_options => {
      :location  => '/usr/sbin/sendmail',
      :arguments => '-t'
      }
    })
  end

  def revision
    `git log --pretty=format:'%h' -n 1`
  end

  def logs
    `cat #{config['LOG_FILE_PATH']}`
  end

  def print_tables
    text = "SCHEMA:\n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} ".schema"`
    text += "\n"
    text += "TABLE: vyom_users \n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} "select * from vyom_users"`
    text += "\n"
    text += "TABLE: vyom_user_quota \n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} "select * from vyom_user_quota"`
    text += "\n"
    text += "TABLE: vyom_group_quota \n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} "select * from vyom_group_quota"`
    text += "\n"
    text += "TABLE: vyom_agent \n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} "select * from vyom_agents"`
    text += "\n"
    text += "TABLE: vyom_test_session \n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} "select * from vyom_test_sessions"`
    text += "\n"
    text += "TABLE: vyom_queues \n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} "select * from vyom_queues"`
    text += "\n"
    text += "TABLE: vyom_test_log \n"
    text += `sqlite3 #{config['SQLITE_DBFILE']} "select * from vyom_test_logs"`
    text
  end
end
