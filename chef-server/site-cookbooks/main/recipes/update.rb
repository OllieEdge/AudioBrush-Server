#-> UPDATE & UPGRADE
bash '--- apt-get update ---' do
  user "root"

  code <<-EOH
  sudo apt-get update -q -y
  EOH
end