Here is a high-level summary of the plan that can be used as a `README.md` file for your project:

---

# Jenkins Declarative Pipeline for CI/CD with Docker

## Project Overview

This project demonstrates how to set up a **Jenkins Declarative Pipeline** for automating the Continuous Integration (CI) and Continuous Deployment (CD) of a simple Node.js web application. The pipeline includes building a Docker image, pushing it to Docker Hub, and deploying it to a target machine within the same subnet.

## Features

- A **Node.js** web application that serves a basic message.
- **Dockerfile** to containerize the web application.
- Jenkins **CI job** to build the Docker image and push it to **Docker Hub**.
- Jenkins **CD job** to deploy the Docker container on a target machine via SSH.

## Project Structure

```
.
├── app.js              # Node.js application file
├── package.json        # Node.js dependencies
├── Dockerfile          # Dockerfile to containerize the Node.js application
└── Jenkinsfile         # Jenkins pipeline definition for CI job
```

## Prerequisites

- **Jenkins** with the following plugins installed:
  - Docker Pipeline Plugin
  - SSH Pipeline Steps Plugin
- **Docker** installed on Jenkins and the target machine.
- **GitHub repository** for the application code.
- **Docker Hub account** for pushing the Docker image.
- **Target machine** (VM or server) in the same subnet as Jenkins with SSH access.

## Step-by-Step Guide

### 1. **Node.js Web Application**

The application is a simple Node.js server that listens on port 3000 and returns a message.

### 2. **Containerizing the Application**

The **Dockerfile** is used to containerize the Node.js application. It defines how to set up the container environment, copy the source code, install dependencies, and expose the necessary port.

```dockerfile
FROM node:14-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. **CI Pipeline (Build and Push Docker Image)**

A Jenkins **CI job** will:
- Checkout the source code from the GitHub repository.
- Build the Docker image using the Dockerfile.
- Push the Docker image to Docker Hub.

**Jenkinsfile (for CI job)**:

```groovy
pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
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
```

### 4. **CD Pipeline (Deploy to Target Machine)**

The **CD job** will:
- SSH into the target machine.
- Pull the latest Docker image from Docker Hub.
- Stop and remove any existing container.
- Run the new Docker container on the target machine.

**Jenkinsfile (for CD job)**:

```groovy
pipeline {
    agent any
    environment {
        TARGET_VM_CREDENTIALS = credentials('target-vm-ssh')
    }
    stages {
        stage('Deploy to Target VM') {
            steps {
                sshagent(['TARGET_VM_CREDENTIALS']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no user@target_vm_ip '
                    docker pull yourdockerhubusername/sample-node-app:latest &&
                    docker stop sample-node-app || true &&
                    docker rm sample-node-app || true &&
                    docker run -d --name sample-node-app -p 3000:3000 yourdockerhubusername/sample-node-app:latest
                    '
                    '''
                }
            }
        }
    }
}
```

### 5. **Automating CI/CD**

You can trigger the **CD job** to run automatically after the **CI job** by configuring the Jenkins **CD job** to trigger after a successful CI build.

---

## How to Run

1. Set up **Jenkins** with the required plugins and credentials.
2. Add your **Docker Hub credentials** and **target VM SSH credentials** in Jenkins.
3. Create two Jenkins jobs:
   - **CI job**: To build and push the Docker image.
   - **CD job**: To deploy the Docker container on the target machine.
4. Run the **CI job** to build the Docker image and push it to Docker Hub.
5. Run the **CD job** to deploy the container on the target machine.

---

## Notes

- Ensure that the target machine is accessible via SSH and Docker is installed.
- Replace `<your-username>` and `<your-repo>` with your GitHub repository information.
- Replace `yourdockerhubusername` with your Docker Hub username.

---

This `README.md` provides a high-level overview of the project setup and serves as a guide for using Jenkins pipelines to automate the CI/CD process for a containerized application.

