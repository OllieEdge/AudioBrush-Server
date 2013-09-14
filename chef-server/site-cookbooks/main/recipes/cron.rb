#execute '--- restore mongo ---'do
#  user 'root'
#  group 'root'
#  cwd '/vagrant/chef-server/data/mongo'
#  command 'mongorestore dump'
#end

#cron "mongobackup" do
#  minute "*"
#
#  action :create
#
#  command %Q{
#    cd /vagrant/chef-server/data/mongo &&
#    mongodump
#  }

#end