include_recipe 'grunt_cookbook::default'

grunt_cookbook_npm "/" do
  action :install
  package "mocha"
  flags "--global"
end