#!/bin/bash
# AgriSwarm Project Setup Script
# Free tier Google Cloud Services setup

# Set project configuration
gcloud config set project agricompetition
gcloud config set compute/zone us-central1

# Verify billing (required for some services)
echo "Verifying billing status..."
gcloud beta billing projects describe agricompetition

# Enable required APIs (free tier services)
echo "Enabling Google Cloud APIs..."
gcloud services enable \
  cloudfunctions.googleapis.com \
  storage-api.googleapis.com \
  drive.googleapis.com \
  sheets.googleapis.com \
  gmail.googleapis.com \
  appsscript.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com

# Create service account for AgriSwarm
echo "Creating service account..."
gcloud iam service-accounts create agriswarm-service \
  --display-name="AgriSwarm Service Account" \
  --description="Service account for AgriSwarm agricultural system"

# Grant necessary roles
gcloud projects add-iam-policy-binding agricompetition \
  --member="serviceAccount:agriswarm-service@agricompetition.iam.gserviceaccount.com" \
  --role="roles/cloudfunctions.invoker"

gcloud projects add-iam-policy-binding agricompetition \
  --member="serviceAccount:agriswarm-service@agricompetition.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding agricompetition \
  --member="serviceAccount:agriswarm-service@agricompetition.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant admin access to the specified email
gcloud projects add-iam-policy-binding agricompetition \
  --member="user:shehrbanoxgirlx@gmail.com" \
  --role="roles/owner"

echo "Project setup completed!"
echo "Service Account: agriswarm-service@agricompetition.iam.gserviceaccount.com"