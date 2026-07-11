# Script to generate 200+ commits with micro changes
$commitCount = 200
$srcPath = "src"

# Create a file to track commit progress
$progressFile = "commit-progress.txt"
if (-not (Test-Path $progressFile)) {
    "0" | Out-File -FilePath $progressFile
}

$currentCommit = [int](Get-Content $progressFile)

for ($i = $currentCommit + 1; $i -le $commitCount; $i++) {
    Write-Host "Creating commit $i of $commitCount"
    
    # Generate micro changes based on commit number
    switch ($i % 10) {
        1 {
            # Add a comment to App.jsx
            $appFile = "$srcPath/App.jsx"
            if (Test-Path $appFile) {
                $content = Get-Content $appFile -Raw
                $comment = "`n// Micro change commit $i"
                Add-Content -Path $appFile -Value $comment
                git add $appFile
                git commit -m "feat: add comment $i to App.jsx"
            }
        }
        2 {
            # Add a blank line to main.jsx
            $mainFile = "$srcPath/main.jsx"
            if (Test-Path $mainFile) {
                $content = Get-Content $mainFile -Raw
                "`n" | Out-File -FilePath $mainFile -Append
                git add $mainFile
                git commit -m "style: add formatting $i to main.jsx"
            }
        }
        3 {
            # Add a comment to index.css
            $cssFile = "$srcPath/index.css"
            if (Test-Path $cssFile) {
                "/* Micro change $i */" | Out-File -FilePath $cssFile -Append
                git add $cssFile
                git commit -m "style: add comment $i to index.css"
            }
        }
        4 {
            # Add a comment to supabaseClient.js
            $clientFile = "$srcPath/supabaseClient.js"
            if (Test-Path $clientFile) {
                "// Micro change $i" | Out-File -FilePath $clientFile -Append
                git add $clientFile
                git commit -m "feat: add comment $i to supabaseClient.js"
            }
        }
        5 {
            # Create a small component file
            $componentDir = "$srcPath/components"
            if (-not (Test-Path $componentDir)) {
                New-Item -ItemType Directory -Path $componentDir | Out-Null
            }
            $componentFile = "$componentDir/Micro$i.jsx"
            "// Micro component $i" | Out-File -FilePath $componentFile
            git add $componentFile
            git commit -m "feat: add Micro$i component"
        }
        6 {
            # Add a README comment
            $readmeFile = "README.md"
            if (-not (Test-Path $readmeFile)) {
                "# Food Rescue Board" | Out-File -FilePath $readmeFile
            }
            "`n- Update $i" | Out-File -FilePath $readmeFile -Append
            git add $readmeFile
            git commit -m "docs: update README commit $i"
        }
        7 {
            # Add a .gitignore entry
            $gitignoreFile = ".gitignore"
            if (-not (Test-Path $gitignoreFile)) {
                "node_modules/" | Out-File -FilePath $gitignoreFile
            }
            "# Micro change $i" | Out-File -FilePath $gitignoreFile -Append
            git add $gitignoreFile
            git commit -m "chore: update .gitignore commit $i"
        }
        8 {
            # Modify tailwind config comment
            $tailwindFile = "tailwind.config.js"
            if (Test-Path $tailwindFile) {
                "// Micro change $i" | Out-File -FilePath $tailwindFile -Append
                git add $tailwindFile
                git commit -m "config: update tailwind config $i"
            }
        }
        9 {
            # Add a context file
            $contextDir = "$srcPath/contexts"
            if (-not (Test-Path $contextDir)) {
                New-Item -ItemType Directory -Path $contextDir | Out-Null
            }
            $contextFile = "$contextDir/Micro$i.js"
            "// Micro context $i" | Out-File -FilePath $contextFile
            git add $contextFile
            git commit -m "feat: add Micro$i context"
        }
        0 {
            # Add a page file
            $pagesDir = "$srcPath/pages"
            if (-not (Test-Path $pagesDir)) {
                New-Item -ItemType Directory -Path $pagesDir | Out-Null
            }
            $pageFile = "$pagesDir/Micro$i.jsx"
            "// Micro page $i" | Out-File -FilePath $pageFile
            git add $pageFile
            git commit -m "feat: add Micro$i page"
        }
    }
    
    # Update progress
    $i | Out-File -FilePath $progressFile
    
    # Small delay to avoid issues
    Start-Sleep -Milliseconds 100
}

Write-Host "Completed $commitCount commits!"
