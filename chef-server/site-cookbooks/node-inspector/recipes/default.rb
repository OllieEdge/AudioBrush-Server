# stops nodeinspector service if running
 service 'nodeinspector' do
   action :stop
   provider Chef::Provider::Service::Upstart
 end


template "/etc/init/nodeinspector.conf" do
  source "nodeinspector.conf.erb"
  mode 0440
end

# starts nodeinspector service
service 'nodeinspector' do
	action :start
	provider Chef::Provider::Service::Upstart
end
