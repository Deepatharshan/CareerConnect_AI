pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_PREFIX = 'careerconnect'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-org/careerconnect-ai.git'
            }
        }
        
        stage('Build Core Services') {
            steps {
                dir('backend/api-gateway') {
                    sh 'mvn clean package -DskipTests'
                }
                dir('backend/auth-service') {
                    sh 'mvn clean package -DskipTests'
                }
                // Add more microservices here
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS_ID) {
                        def gwImage = docker.build("${IMAGE_PREFIX}/api-gateway:latest", "./backend/api-gateway")
                        gwImage.push()
                        
                        def authImage = docker.build("${IMAGE_PREFIX}/auth-service:latest", "./backend/auth-service")
                        authImage.push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployments/'
                sh 'kubectl apply -f k8s/services/'
                sh 'kubectl rollout restart deployment/auth-service'
                sh 'kubectl rollout restart deployment/api-gateway'
            }
        }
    }
}
