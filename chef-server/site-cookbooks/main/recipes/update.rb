#-> UPDATE & UPGRADE
bash '--- apt-get update ---' do
  user "root"

  code <<-EOH
  sudo apt-get update -q -y
  EOH
end

#-> UPDATE & UPGRADE
#bash '--- apt-get upgrade ---' do
#  user "root"
#
#  code <<-EOH
#  aptitude safe-upgrade
#  -o Aptitude::Delete-Unused=false
#  --assume-yes
#  --target-release
#  `lsb_release -cs`-security
#  EOH
#end