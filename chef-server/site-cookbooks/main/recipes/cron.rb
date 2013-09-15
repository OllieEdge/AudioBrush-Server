#start jenkins
service 'jenkins' do
  action :start
end


#get comand line tools
execute 'install jenkins command line tools' do

  user 'root'

  cwd '/usr/local/bin'
  command 'wget http://localhost:8080/jnlpJars/jenkins-cli.jar'

  action :run
end

directory '/home/vagrant/' do
  action :create
end

#remove jenkins default home folder
execute '-- remove Jenkins settings' do
  user 'root'
  cwd '/home'
  command 'rm -rf jenkins'
end

#re-create jenkins home dir
directory '/home/jenkins' do
  owner 'jenkins'
  action :create
end


#un-tar jenkins config
execute 'restore jenkins backup' do
  user 'root'

  cwd '/vagrant/chef-server/data/jenkins-backup'
  command  'tar -zxvf back-up-latest.tar.gz -C /home/jenkins/'
end

#install jenkins plugins
execute 'install Git for Jenkins' do
  user 'vagrant'
  cwd '/usr/local/bin'
  command  'java -jar jenkins-cli.jar -s http://localhost:8080 install-plugin Git'
end

#install jenkins plugins
execute 'install html publisher for Jenkins' do
  user 'vagrant'
  cwd '/usr/local/bin'
  command  'java -jar jenkins-cli.jar -s http://localhost:8080 install-plugin htmlpublisher'
end

#start jenkins
service 'jenkins' do
  action :restart
end