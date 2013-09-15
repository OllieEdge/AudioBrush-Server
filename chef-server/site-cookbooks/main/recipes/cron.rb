#start jenkins
service "jenkins" do
  action :start
end


#get comand line tools
execute "install jenkins command line tools" do

  user "root"

  cwd "/usr/local/bin"
  command "cp /var/cache/jenkins/war/WEB-INF/jenkins-cli.jar /usr/local/bin/"

  action :run
end

directory "/home/vagrant/" do
  action :create
end

#remove jenkins default home folder
execute "-- remove Jenkins settings" do
  user "root"
  cwd "/home"
  command "rm -rf jenkins"
end

#re-create jenkins home dir
directory "/home/jenkins" do
  owner "jenkins"
  action :create
end


#un-tar jenkins config
execute "restore jenkins backup" do
  user "root"

  cwd "/vagrant/chef-server/data/jenkins-backup"
  command  "tar -zxvf back-up-latest.tar.gz -C /home"
end

#install jenkins plugins - git
#execute "install Git for Jenkins" do
#  user "vagrant"
#  cwd "/usr/jenkins/plugins"
#  command  "wget http://updates.jenkins-ci.org/download/plugins/git-client/latest/git-client.hpi"
#end
#
#install jenkins plugins - html output
#execute "install html publisher for Jenkins" do
#  user "vagrant"
#  cwd "/usr/local/bin"
#  command  "java -jar jenkins-cli.jar -s http://localhost:8080 install-plugin http://updates.jenkins-ci.org/download/plugins/htmlpublisher/latest/htmlpublisher.hpi"
#end

#template "/home/jenkins/.ssh/id_rsa.pub" do
#  source "id_rsa.pub.erb"
#  mode 0644
#end

#execute 'add backup alias'do
#  user 'vagrant'
#  command 'echo "sudo tar -zcvf /vagrant/chef-server/data/jenkins-backup/back-up-latest.tar.gz /home/jenkins" >> ~/.bash_profile'
#end

#start jenkins
service "jenkins" do
  action :restart
end