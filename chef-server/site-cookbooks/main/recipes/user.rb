#-> USERS
user 'jenkins' do
  home '/home/jenkins'
  action :create
end

user 'node' do
  home '/home/node'
  action :create
end