# -*- mode: ruby -*-
# vi: set ft=ruby :


VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "precise64"

  #config.vm.network :forwarded_port, guest: 1234,  host: 1234
  #config.vm.network :forwarded_port, guest: 8080,  host: 8080
  #config.vm.network :forwarded_port, guest: 3000,  host: 3000
  #config.vm.network :forwarded_port, guest: 55281, host: 55281

  config.vm.network :private_network, ip: "192.168.33.10"

  config.vm.provider :virtualbox do |vb|

    vb.customize ["modifyvm", :id, "--ioapic", "on"]
    vb.customize ["modifyvm", :id, "--memory", "4096"]
    vb.customize ["modifyvm", :id, "--cpus", "4"]

  end


  config.vm.provision :chef_solo do |chef|

    chef.arguments = '-l debug'

    chef.data_bags_path = "chef-server/data_bags"
    chef.cookbooks_path = ["chef-server/cookbooks", "chef-server/site-cookbooks"]

    chef.add_recipe "apt::default"
    chef.add_recipe "build-essential::default"
    chef.add_recipe "git::default"

    chef.add_recipe "rvm::vagrant"
    chef.add_recipe "rvm::system"

    chef.add_recipe "mongodb::10gen_repo"
    chef.add_recipe "redis-package::server"

    chef.add_recipe "main::user"

    chef.add_recipe "java::openjdk"
    chef.add_recipe "jenkins::server"

    chef.add_recipe "dotfiles::default"

    chef.add_recipe "nodejs::default"
    chef.add_recipe "npm-install::default"
    chef.add_recipe "main::npm"
    chef.add_recipe "node-inspector::default"
    chef.add_recipe "jump_js::default"

    chef.add_recipe "main::cron"

    chef.json = {

        :dotfiles => {
            :standard_repository => 'https://github.com/mathiasbynens/dotfiles.git'
        },

        :jenkins => {
            :server => {
                :home => '/home/jenkins'
            }
        }
    }

  end

end
