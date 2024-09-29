pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')  // Your Docker Hub credentials ID
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/<your-repo>.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def app = docker.build("yourdockerhubusername/sample-node-app")
                }
            }
        }
        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        def app = docker.build("yourdockerhubusername/sample-node-app")
                        app.push('latest')
                    }
                }
            }
        }
    }
}
