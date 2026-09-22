#Requires -RunAsAdministrator
<#
  Exposes the WSL preview server (default port 3100) to LAN or Tailscale peers.

  WSL runs in NAT mode, so LAN clients can't reach it directly. This script:
    1. adds a portproxy from <Windows LAN IP>:<Port> to <WSL IP>:<Port>
    2. adds one inbound firewall rule, limited to the Private profile, the LAN
       adapter, and remote addresses on the local subnet.
  Nothing is opened on the router and no tunnel is created.
  With -Tailscale, configures a separate listener on the Tailscale IPv4 address
  and a firewall rule limited to the Tailscale adapter and peer address range.
  LAN and Tailscale setup/removal are independent; run both to enable both.

  The WSL IP changes when WSL restarts; run this again after a restart.

  Usage (elevated PowerShell, from the repo folder):
    powershell -ExecutionPolicy Bypass -File scripts\windows-lan-preview.ps1
    ... -InterfaceAlias "Ethernet 2"   # pick the LAN adapter explicitly
    ... -Tailscale                     # add Tailscale access, preserving LAN
    ... -Remove                       # remove LAN access only
    ... -Tailscale -Remove             # remove Tailscale access only
#>
param(
  [ValidateRange(1, 65535)][int]$Port = 3100,
  [string]$InterfaceAlias,
  [switch]$Tailscale,
  [switch]$Remove
)
$ErrorActionPreference = 'Stop'
$accessName = if ($Tailscale) { 'Tailscale' } else { 'LAN' }
$RuleName = "Portfolio $accessName preview (TCP $Port)"

function Remove-Preview {
  param([string]$CurrentAddress)
  $rules = @(Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue)
  $addresses = @($rules | Get-NetFirewallAddressFilter | ForEach-Object { $_.LocalAddress })
  if ($CurrentAddress) { $addresses += $CurrentAddress }
  # Rows look like: <listen address> <listen port> <connect address> <connect port>
  foreach ($line in (netsh interface portproxy show v4tov4)) {
    $cols = $line.Trim() -split '\s+'
    if ($cols.Count -eq 4 -and $cols[1] -eq "$Port" -and $cols[0] -in $addresses) {
      netsh interface portproxy delete v4tov4 listenaddress=$($cols[0]) listenport=$Port | Out-Null
      if ($LASTEXITCODE -ne 0) { throw "Failed to remove preview forwarding for $($cols[0]):$Port." }
    }
  }
  $rules | Remove-NetFirewallRule
}

if ($Remove) {
  Remove-Preview
  Write-Host "Removed the $accessName portproxy and firewall rule for port $Port."
  return
}

if ($Tailscale) {
  if (-not $InterfaceAlias) { $InterfaceAlias = 'Tailscale' }
  $address = Get-NetIPAddress -InterfaceAlias $InterfaceAlias -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -match '^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.' } |
    Select-Object -First 1
  if (-not $address) { throw "No Tailscale IPv4 address found on '$InterfaceAlias'. Connect Tailscale first." }
  $listenIp = $address.IPAddress
  $listenInterface = $address.InterfaceAlias
  $remoteAddresses = '100.64.0.0/10'
  $firewallProfile = 'Any'
} else {
  # The LAN adapter: a Private network that isn't WSL, a VPN or Tailscale.
  $profiles = Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -eq 'Private' }
  if ($InterfaceAlias) {
    $profiles = $profiles | Where-Object { $_.InterfaceAlias -eq $InterfaceAlias }
  } else {
    $profiles = $profiles | Where-Object { $_.InterfaceAlias -notmatch 'vEthernet|WSL|Tailscale|NordLynx|VPN|Loopback' }
  }
  $lanProfile = $profiles | Select-Object -First 1
  if (-not $lanProfile) {
    throw "No Private LAN adapter found. Set the network to Private in Windows Settings, or pass -InterfaceAlias."
  }
  $lanIp = (Get-NetIPAddress -InterfaceIndex $lanProfile.InterfaceIndex -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress
  if (-not $lanIp) { throw "Adapter '$($lanProfile.InterfaceAlias)' has no IPv4 address." }
  $listenIp = $lanIp
  $listenInterface = $lanProfile.InterfaceAlias
  $remoteAddresses = 'LocalSubnet'
  $firewallProfile = 'Private'
}

$wslIp = ((wsl.exe hostname -I) -split '\s+' | Where-Object { $_ -match '^\d+\.\d+\.\d+\.\d+$' } | Select-Object -First 1)
if (-not $wslIp) { throw "Couldn't read the WSL IP. Is WSL running?" }

Remove-Preview -CurrentAddress $listenIp
netsh interface portproxy add v4tov4 listenaddress=$listenIp listenport=$Port connectaddress=$wslIp connectport=$Port | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Failed to add preview forwarding for ${listenIp}:$Port." }
New-NetFirewallRule -DisplayName $RuleName -Direction Inbound -Action Allow -Protocol TCP `
  -LocalPort $Port -LocalAddress $listenIp -RemoteAddress $remoteAddresses -Profile $firewallProfile `
  -InterfaceAlias $listenInterface | Out-Null

Write-Host "Adapter     : $listenInterface ($listenIp)"
Write-Host "Forwarding  : ${listenIp}:$Port -> WSL ${wslIp}:$Port"
Write-Host "Firewall    : '$RuleName' ($firewallProfile profile, $remoteAddresses)"
Write-Host "Open        : http://${listenIp}:$Port"
