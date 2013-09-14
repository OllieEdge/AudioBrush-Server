bash "Install 2.0.0 with rvm" do
  code <<-EOH
    su -l vagrant -c "rvm install 2.0.0"
  EOH
end

bash "Set 2.0.0 as default" do
  code <<-EOH
    su -l vagrant -c "rvm --default 2.0.0"
  EOH
end

bash "install compass gem" do
  code <<-EOH
    su -l vagrant -c "gem install compass"
  EOH
end