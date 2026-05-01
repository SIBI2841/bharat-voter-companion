Write-Host "Authenticating with Google Cloud..."
gcloud auth login
Write-Host "Setting project to amazing-plateau-495020-q8..."
gcloud config set project amazing-plateau-495020-q8
Write-Host "Deploying to Cloud Run..."
gcloud run deploy election-assistant --source . --region us-central1 --allow-unauthenticated
Write-Host "Deployment complete!"
