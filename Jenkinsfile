pipeline {
    agent any

    environment {
        CONTAINER_NAME = "d-day_counter"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        echo $password | docker login --username $username --password-stdin
                        docker build -f Dockerfile -t "$username/$CONTAINER_NAME" .
                        """
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        docker push "$username/$CONTAINER_NAME"
                        """
                    }
                }
            }
        }

        stage('Deploy to Prod') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        docker ps
                        docker stop "$CONTAINER_NAME" || true
                        docker rm "$CONTAINER_NAME" || true
                        docker pull "$username/$CONTAINER_NAME"
                        docker run -it -d --name "$CONTAINER_NAME" --restart always -p 127.0.0.1:9009:80 "$username/$CONTAINER_NAME"
                        docker image prune -f
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}