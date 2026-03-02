# Check user to confirm:
read -p "This will overwrite existing charts and GitHub Actions workflows. Do you want to continue? (y/n) " -n 1 -r
echo    # move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting setup."
    exit 1
fi

# check is in the correct directory
if [ ! -d "deployment-jenkins-based" ]; then
    echo "Error: This script must be run from the root directory of the project."
    exit 1
fi

rm -rf charts
rm -rf .github/workflows
cp -rp deployment-jenkins-based/charts .
cp -rp deployment-jenkins-based/.github/workflows .github/
cp deployment-jenkins-based/jenkins-config.yaml .