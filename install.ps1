# batbout installer — Windows (PowerShell 5.1+ / PowerShell 7)
# Licensed under the Apache License, Version 2.0. See LICENSE.
#
#   irm https://raw.githubusercontent.com/Abdullah1x2x/batbout/main/install.ps1 | iex
#
# With options (download first, then run):
#   & ([scriptblock]::Create((irm https://raw.githubusercontent.com/Abdullah1x2x/batbout/main/install.ps1))) -Agent claude-code,cursor
#   ... -All | -Project | -Uninstall | -List | -Link (from a local clone: link instead of copy)

[CmdletBinding()]
param(
  [string[]]$Agent,
  [switch]$All,
  [switch]$Project,
  [switch]$Uninstall,
  [switch]$Link,
  [switch]$List
)

$ErrorActionPreference = 'Stop'
$Repo   = if ($env:BATBOUT_REPO) { $env:BATBOUT_REPO } else { 'Abdullah1x2x/batbout' }
$Ref    = if ($env:BATBOUT_REF)  { $env:BATBOUT_REF }  else { 'main' }
$Skills = @('batbout', 'batbout-review', 'batbout-recap')
# The names before the rename to Batbout, removed so they don't run twice
$Legacy = @('takemyhand', 'takemyhand-review', 'takemyhand-recap')
$H      = $HOME

# id, global skills dir, project skills dir, detection dir
$Agents = @(
  @{ Id='claude-code';    Global="$H\.claude\skills";            Proj='.claude\skills';   Detect="$H\.claude" }
  @{ Id='codex';          Global="$H\.agents\skills";            Proj='.agents\skills';   Detect="$H\.codex" }
  @{ Id='cursor';         Global="$H\.cursor\skills";            Proj='.agents\skills';   Detect="$H\.cursor" }
  @{ Id='gemini-cli';     Global="$H\.gemini\skills";            Proj='.agents\skills';   Detect="$H\.gemini" }
  @{ Id='github-copilot'; Global="$H\.copilot\skills";           Proj='.agents\skills';   Detect="$H\.copilot" }
  @{ Id='opencode';       Global="$H\.config\opencode\skills";   Proj='.agents\skills';   Detect="$H\.config\opencode" }
  @{ Id='windsurf';       Global="$H\.codeium\windsurf\skills";  Proj='.windsurf\skills'; Detect="$H\.codeium\windsurf" }
  @{ Id='cline';          Global="$H\.agents\skills";            Proj='.agents\skills';   Detect="$H\.cline" }
  @{ Id='roo';            Global="$H\.roo\skills";               Proj='.roo\skills';      Detect="$H\.roo" }
  @{ Id='kiro-cli';       Global="$H\.kiro\skills";              Proj='.kiro\skills';     Detect="$H\.kiro" }
  @{ Id='goose';          Global="$H\.config\goose\skills";      Proj='.goose\skills';    Detect="$H\.config\goose" }
  @{ Id='continue';       Global="$H\.continue\skills";          Proj='.continue\skills'; Detect="$H\.continue" }
  @{ Id='qwen-code';      Global="$H\.qwen\skills";              Proj='.qwen\skills';     Detect="$H\.qwen" }
  @{ Id='trae';           Global="$H\.trae\skills";              Proj='.trae\skills';     Detect="$H\.trae" }
  @{ Id='junie';          Global="$H\.junie\skills";             Proj='.junie\skills';    Detect="$H\.junie" }
  @{ Id='augment';        Global="$H\.augment\skills";           Proj='.augment\skills';  Detect="$H\.augment" }
  @{ Id='amp';            Global="$H\.config\agents\skills";     Proj='.agents\skills';   Detect="$H\.config\amp" }
  @{ Id='universal';      Global="$H\.agents\skills";            Proj='.agents\skills';   Detect='' }
)

function Test-Detected($a) { (-not $a.Detect) -or (Test-Path -LiteralPath $a.Detect -PathType Container) }

# A junction must be removed as a link: Remove-Item -Recurse on it can delete the linked repo's files
function Remove-Skill($p) {
  if (-not (Test-Path -LiteralPath $p)) { return }
  if ((Get-Item -LiteralPath $p -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { [IO.Directory]::Delete($p) }
  else { Remove-Item -LiteralPath $p -Recurse -Force }
}

if ($List) {
  $Agents | ForEach-Object {
    [pscustomobject]@{ Agent = $_.Id; Detected = $(if (Test-Detected $_) { 'yes' } else { '-' }); GlobalPath = $_.Global }
  } | Format-Table -AutoSize
  return
}

# Accept -Agent a,b as well as -Agent "a,b"
$Want = @()
if ($Agent) { $Want = $Agent | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ } }
foreach ($w in $Want) {
  if (-not ($Agents | Where-Object { $_.Id -eq $w })) { throw "Unknown agent: $w (use -List)" }
}

# Choose targets, merging agents that share a folder
$Targets = [ordered]@{}
foreach ($a in $Agents) {
  $take = if ($All) { $true } elseif ($Want.Count -gt 0) { $Want -contains $a.Id } else { Test-Detected $a }
  if (-not $take) { continue }
  $dir = if ($Project) { Join-Path (Get-Location).Path $a.Proj } else { $a.Global }
  if ($Targets.Contains($dir)) { $Targets[$dir] += ", $($a.Id)" } else { $Targets[$dir] = $a.Id }
}
if ($Targets.Count -eq 0) { throw 'No matching agents found. Use -List to see them, or -All.' }

if ($Uninstall) {
  foreach ($dir in $Targets.Keys) {
    foreach ($s in $Skills + $Legacy) { Remove-Skill (Join-Path $dir $s) }
    Write-Host "✓ removed from $dir  ($($Targets[$dir]))"
  }
  return
}

# Find the skills: local checkout first, otherwise download the repo
$Src = $null
if ($PSScriptRoot -and (Test-Path (Join-Path $PSScriptRoot 'skills\batbout\SKILL.md'))) {
  $Src = Join-Path $PSScriptRoot 'skills'
} else {
  if ($Link) { throw '-Link needs a local clone: run .\install.ps1 -Link from the repo.' }
  $Tmp = Join-Path ([IO.Path]::GetTempPath()) ("batbout-" + [guid]::NewGuid())
  New-Item -ItemType Directory -Path $Tmp | Out-Null
  $Zip = Join-Path $Tmp 'repo.zip'
  Write-Host "Downloading $Repo@$Ref ..."
  [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
  Invoke-WebRequest -UseBasicParsing -Uri "https://codeload.github.com/$Repo/zip/refs/heads/$Ref" -OutFile $Zip
  Expand-Archive -LiteralPath $Zip -DestinationPath $Tmp -Force
  $Src = Get-ChildItem -LiteralPath $Tmp -Directory | ForEach-Object { Join-Path $_.FullName 'skills' } |
         Where-Object { Test-Path (Join-Path $_ 'batbout\SKILL.md') } | Select-Object -First 1
  if (-not $Src) { throw 'Could not find skills in the download.' }
}

try {
  foreach ($dir in $Targets.Keys) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    foreach ($s in $Legacy) { Remove-Skill (Join-Path $dir $s) }
    foreach ($s in $Skills) {
      $dest = Join-Path $dir $s
      Remove-Skill $dest
      if ($Link) { New-Item -ItemType Junction -Path $dest -Target (Join-Path $Src $s) | Out-Null }
      else { Copy-Item -LiteralPath (Join-Path $Src $s) -Destination $dest -Recurse }
    }
    Write-Host "✓ $dir  ($($Targets[$dir]))"
  }
} finally {
  if ($Tmp -and (Test-Path -LiteralPath $Tmp)) { Remove-Item -LiteralPath $Tmp -Recurse -Force }
}

Write-Host ''
Write-Host 'batbout installed. Ask your agent to "use batbout" (Claude Code: /batbout <task>).'
Write-Host 'Restart your agent if it was already running.'
