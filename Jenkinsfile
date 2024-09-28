pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('c5a41cbe-9b4b-45e3-b02a-52f6ab5d63fc') // Replace with your Jenkins credentials ID
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/discover-devops/JenkinsDocker.git'  // Your public repo URL
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image from Dockerfile
                    def app = docker.build("discoverdevops/mywebapp")
                }
            }
        }
        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    // Use Docker Hub credentials to log in and push the image
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        def app = docker.build("discoverdevops/mywebapp")
                        app.push('latest')  // Push the image to Docker Hub with the 'latest' tag
                    }
                }
            }
        }
    }
}
