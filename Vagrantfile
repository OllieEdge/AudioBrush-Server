# -*- mode: ruby -*-
# vi: set ft=ruby :


VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "precise32"

  config.vm.network :forwarded_port, guest: 8080, host: 8080
  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 55281, host: 55281

  

  config.vm.provision :chef_solo do |chef|
    
    chef.data_bags_path = "chef-server/data_bags"
    chef.cookbooks_path = ["chef-server/cookbooks", "chef-server/site-cookbooks"]

    chef.add_recipe "build-essential"
    chef.add_recipe "apt"
    chef.add_recipe "git"

    chef.add_recipe 'rvm::user'
        
    chef.add_recipe "mongodb::10gen_repo"
    chef.add_recipe "redis-package::server"

    chef.add_recipe "nodejs"
    chef.add_recipe "grunt_cookbook::install_grunt_cli"    
    chef.add_recipe "npm-install"    
    chef.add_recipe "node-inspector"
    chef.add_recipe "jump_js"    
    
    
    chef.json = {
      :rvm => {
        :user_installs => [
          { 'user'          => 'vagrant',
            'default_ruby'  => '2.0.0',
            'rubies'        => ['2.0.0'],
            'global_gems'     => [
                {'name'    => 'compass'}
            ]
          }
        ],
      },
            
    }
  end
end
