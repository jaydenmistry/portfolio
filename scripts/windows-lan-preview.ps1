#Requires -RunAsAdministrator
<#
  Exposes the WSL preview server (default port 3100) to the local network only.

  WSL runs in NAT mode, so LAN clients can't reach it directly. This script:
    1. adds a portproxy from <Windows LAN IP>:<Port> to <WSL IP>:<Port>
    2. adds one inbound firewall rule, limited to the Private profile, the LAN
       adapter, and remote addresses on the local subnet.
  Nothing is opened on the router and no tunnel is created.

  The WSL IP changes when WSL restarts; run this again after a restart.

  Usage (elevated PowerShell, from the repo folder):
    powershell -ExecutionPolicy Bypass -File scripts\windows-lan-preview.ps1
    ... -InterfaceAlias "Ethernet 2"   # pick the LAN adapter explicitly
    ... -Remove                        # undo everything this script added
#>
param(
  [int]$Port = 3100,
  [string]$InterfaceAlias,
  [switch]$Remove
)
$ErrorActionPreference = 'Stop'
$RuleName = "Portfolio LAN preview (TCP $Port)"

function Remove-Preview {
  # Rows look like: <listen address> <listen port> <connect address> <connect port>
  foreach ($line in (netsh interface portproxy show v4tov4)) {
    $cols = $line.Trim() -split '\s+'
    if ($cols.Count -eq 4 -and $cols[1] -eq "$Port") {
      netsh interface portproxy delete v4tov4 listenaddress=$($cols[0]) listenport=$Port | Out-Null
    }
  }
  Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue | Remove-NetFirewallRule
}

if ($Remove) {
  Remove-Preview
  Write-Host "Removed the portproxy and firewall rule for port $Port."
  return
}

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

$wslIp = ((wsl.exe hostname -I) -split '\s+' | Where-Object { $_ -match '^\d+\.\d+\.\d+\.\d+$' } | Select-Object -First 1)
if (-not $wslIp) { throw "Couldn't read the WSL IP. Is WSL running?" }

Remove-Preview
netsh interface portproxy add v4tov4 listenaddress=$lanIp listenport=$Port connectaddress=$wslIp connectport=$Port | Out-Null
New-NetFirewallRule -DisplayName $RuleName -Direction Inbound -Action Allow -Protocol TCP `
  -LocalPort $Port -LocalAddress $lanIp -RemoteAddress LocalSubnet -Profile Private `
  -InterfaceAlias $lanProfile.InterfaceAlias | Out-Null

Write-Host "LAN adapter : $($lanProfile.InterfaceAlias) ($lanIp)"
Write-Host "Forwarding  : ${lanIp}:$Port -> WSL ${wslIp}:$Port"
Write-Host "Firewall    : '$RuleName' (Private profile, local subnet only)"
Write-Host "Open        : http://${lanIp}:$Port"
