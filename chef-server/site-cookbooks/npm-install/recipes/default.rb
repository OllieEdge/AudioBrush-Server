#
# Cookbook Name:: npm-install
# Recipe:: default
#
# Copyright 2013, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

bash "install npm modules" do
  code <<-EOH
    su -l vagrant -c "cd /vagrant && npm install"
  EOH
end


bash "start node server" do
  code <<-EOH
    su -l vagrant -c "cd /vagrant && nohup nodemon --debug app.js &"
  EOH
end

	